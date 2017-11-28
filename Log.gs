
function logError(message, fileName, lineNumber){
  var errorSheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('Errors');
  lastRow = errorSheet.getLastRow() + 1;
  var range = errorSheet.getRange( 'A' + lastRow + ':D' +lastRow);
  range.setValues([[
    new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}),
    message,
    fileName,
    lineNumber
  ]]);
}


////  Error ////////////////////////////////////////////////////////////////////////////

function errorLog(e){
  logError(e.message, e.fileName, e.lineNumber);
}


function test(){
  var ss = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc');
  var sheet = ss.getSheetByName('3001')
  
  var a = sheet.getRange('A106:V106');
  var b = a.getValues();
  var c = a.getFormulas();
  var d = a.getFormulasR1C1();
//  sheet.getRange('A108:V108').setValues(b);
  Logger.log(d);
}