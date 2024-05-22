# run-script-eotm-demo

Developer walkthrough that shows how to work with Typefi Run Script.

## Setup

1. Create a Typefi Run Script account at [runscript.typefi.com](https://runscript.typefi.com).
2. Create an AWS account at [aws.amazon.com](https://aws.amazon.com) and setup an S3 bucket.
3. Upload the files `eotm.indd`, `eotm.pdf` and `Brush Script MT Italic.ttf` to your S3 bucket.
4. Duplicate the `app (redacted).js` file and call it `app.js`.
5. Edit `app.js` and enter keys and values on lines 7-12.
6. `$ npm install`

## Running

1. `$ node app.js`
2. Navigate to [localhost:3000/app.html](http://localhost:3000/app.html), enter a name and click the _Generate Certificate_ button.
3. All going well, you should now see your beautiful, PDF certificate.
