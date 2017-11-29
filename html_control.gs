function doGet(e) {
  if(!e.parameter.a)
    return HtmlService.createHtmlOutputFromFile('Index');
  
  if(e.parameter.a == "get"){
    return HtmlService.createHtmlOutput(run_unzip());
  }
  if(e.parameter.a == "get2"){
    var result = run_unzip();
    return ContentService.createTextOutput(
      
       e.parameters.callback + '(' + JSON.stringify(result) + ')'
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  if(e.parameter.a == "get3"){
    var result = run_unzip();
    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  if(e.parameter.a == "get4"){
    var result = run_unzip();
    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.TEXTJAVASCRIPT);
  }
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

//menu ----------------------------------------------------------------------
// Use this code for Google Docs, Forms, or new Sheets.
function onOpen() {
  var dialogMenu = SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Dialog');
  dialogMenu.addItem('Open', 'openDialog')
            .addItem('Update 3001', 'update3001excel').addToUi();
}

function openDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Dialog title');
}

function update3001excel(){
  var range = SpreadsheetApp.getActiveRange();
  var row_1st = range.getRow();
  var row_end = range.getLastRow();
  
  for (var i = row_1st; i <= row_end; i++){
    calc_DailyReport_openDialog(i);
  }
  
  SpreadsheetApp.getUi().alert(     'update3001excel: updated from row '+row_1st+' to ' + row_end     );
}
//menu ----------------------------------------------------------------------

