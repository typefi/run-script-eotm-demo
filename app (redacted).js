const express = require('express');
const bodyParser = require('body-parser');
const fs = require('node:fs');
const axios = require('axios');
const aws = require('aws-sdk');

const awsRegion = 'xxxxxxxxx';
const awsAccessKey = 'xxxxxxxxxxxxxxxxxxxx';
const awsSecretAccessKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const awsS3Bucket = 'xxxxxxxxxxxxxx';
const runscriptKey = 'xxxxxxxxxxxxxxxxxxxxxxxx';
const runscriptSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

const s3 = new aws.S3({ region: awsRegion, accessKeyId: awsAccessKey, secretAccessKey: awsSecretAccessKey });

const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/generate', async (req, res) => {
  try {
    const name = req.body.name;
    const script = fs.readFileSync(__dirname + '/eotm.jsx', 'utf8');

    // input files
    const inddFile = {
      href: await s3.getSignedUrl('getObject', { Bucket: awsS3Bucket, Key: 'eotm.indd', }),
      path: 'eotm.indd',
    };
    const pdfFile = {
      href: await s3.getSignedUrl('getObject', { Bucket: awsS3Bucket, Key: 'eotm.pdf' }),
      path: 'eotm.pdf',
    };
    const fontFile = {
      href: await s3.getSignedUrl('getObject', { Bucket: awsS3Bucket, Key: 'Brush Script MT Italic.ttf' }),
      path: 'Document Fonts/Brush Script MT Italic.ttf',
    };

    // output files
    const outputFile = {
      href: await s3.getSignedUrl('putObject', { Bucket: awsS3Bucket, Key: 'certificate.pdf', ContentType: 'application/octet-stream' }),
      path: 'certificate.pdf',
    };

    // request data
    const data = {
      inputs: [inddFile, pdfFile, fontFile],
      outputs: [outputFile],
      args: [{ name: 'Name', value: name }],
      script: script,
    };

    const auth = { username: runscriptKey, password: runscriptSecret };
    let url = 'https://runscript.typefi.com/api/v1/job';
    response = await axios.post(url, data, { auth: auth, 'Content-Type': 'application/json' });
    const jobId = response.data._id;
    console.log(`Job ${jobId}.`);

    // poll every second for job status, break when complete
    url = 'https://runscript.typefi.com/api/v1/job/' + jobId;
    for (;;) {
      response = await axios.get(url, { auth: auth });
      console.log(response.data.status);
      if (response.data.status === 'complete') {
        break;
      }
      await setTimeout(_ => { }, 1000); // sleep for 1 second
    }

    // download from presigned output pdf url and return to client
    url = await s3.getSignedUrl('getObject', { Bucket: awsS3Bucket, Key: 'certificate.pdf' });
    response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(res);

  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
})
