var document = app.open(new File('eotm.indd'));
document.links[0].relink(new File('eotm.pdf'));
app.findGrepPreferences.findWhat = '<<.+?>>';
var fields = document.findGrep();
for (var i = fields.length - 1; i >= 0; i--) {
  var field = fields[i].contents.replace(/^<</, '').replace(/>>$/, '');
  if (app.scriptArgs.isDefined(field) == true) {
    fields[i].contents = app.scriptArgs.getValue('Name');
  }
}
document.exportFile(ExportFormat.PDF_TYPE, new File('certificate.pdf'), false, app.pdfExportPresets.itemByName('[High Quality Print]'));
document.close(SaveOptions.NO);
