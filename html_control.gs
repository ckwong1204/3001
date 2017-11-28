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
  dialogMenu.addItem('Open', 'openDialog').addToUi();
//  dialogMenu.addItem('Open', 'openDialog').addToUi();
}

function openDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Dialog title');
}
//menu ----------------------------------------------------------------------

