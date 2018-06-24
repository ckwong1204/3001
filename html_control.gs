//menu ----------------------------------------------------------------------
// Use this code for Google Docs, Forms, or new Sheets.
function onOpen() {
  var dialogMenu = SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Script');
  dialogMenu.addItem('Open', 'openDialog')
            .addItem('Update 3001 selected row', 'update3001excel')
            .addItem('Update DailyReport selected row', 'updateDailyReportexcel')
            .addItem('Update HSIF', 'updateHSIFexcel')
            .addItem('Transter Fomula to value', 'transterToValue')
            .addItem('test', 'html_control_test')
            .addToUi();
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
    updateSheet3001Row(i);
  }
  SpreadsheetApp.getUi().alert(     'update3001excel: updated from row '+row_1st+' to ' + row_end     );
}

function updateDailyReportexcel(){
  var range = SpreadsheetApp.getActiveRange();
  var row_1st = range.getRow();
  var row_end = range.getLastRow();
  for (var i = row_1st; i <= row_end; i++){
    calc_DailyReport_openDialog(i);
  }
  SpreadsheetApp.getUi().alert(     'updateDailyReportexcel: updated from row '+row_1st+' to ' + row_end     );
}

function updateHSIFexcel(){
  var range = SpreadsheetApp.getActiveRange();
  var row_1st = range.getRow();
  var row_end = range.getLastRow();
  for (var i = row_1st; i <= row_end; i++){
    HSIF.addExcel(i);
  }
}

function transterToValue(){
  var range = SpreadsheetApp.getActiveRange();
  logError(range, range.getA1Notation())
  range.setValues( range.getValues() );
}

function html_control_test(){
  var range = SpreadsheetApp.getActiveRange();
  Log_test(range);
}
//menu ----------------------------------------------------------------------

//web request ----------------------------------------------------------------------

function doGet(e) {
  logError(e);
  
  if(e.pathInfo == "3001")
    return HtmlService.createHtmlOutputFromFile('html_3001');
  
  if(e.pathInfo == "highchats")
    return HtmlService.createHtmlOutputFromFile('html_highchats');
  
  if(e.pathInfo == "stockchats")
    return HtmlService.createHtmlOutputFromFile('html_stockchats');
  
  if(!e.parameter.a)
    return HtmlService.createHtmlOutputFromFile('html_Index');
  
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
  
  if(e.parameter.a == "csv"){
    var result = run_unzip();
    return ContentService.createTextOutput(
      "ddd,fff,dfdf\n111,222,333"
    ).setMimeType(ContentService.MimeType.CSV).downloadAsFile('test.csv');
  }
  
  if(e.parameter.a == "csv2"){
    var result = run_unzip();
    return ContentService.createTextOutput(
      "ddd,fff,dfdf\n111,222,333"
    ).setMimeType(ContentService.MimeType.CSV);
  }
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

