var document = app.activeDocument;
app.findGrepPreferences.findWhat = '<<.+?>>';
var fields = document.findGrep();
for (var i = fields.length - 1; i >= 0; i--) {
  var field = fields[i].contents.replace(/^<</, '').replace(/>>$/, '');
  fields[i].contents = 'John Smith';
}
