
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
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('Errors');
  
  var a = sheet.getRange('A1')
  a.setValue("1111").setNote("updated at nnnn\n1111");
}
