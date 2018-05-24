
function logError(s1, s2, s3, s4){
//  var errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors');
//  lastRow = errorSheet.getLastRow() + 1;
//  var range = errorSheet.getRange( 'A' + lastRow + ':D' +lastRow);
//  range.setValues([[
//    getDateNowStr(),
//    message,
//    fileName,
//    lineNumber
//  ]]);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors').appendRow([
    getDateNowStr(),
    s1,
    s2,
    s3,
    s4
  ]);
}


////  Error ////////////////////////////////////////////////////////////////////////////

function errorLog(e){
    logError(e.message, e.fileName, e.lineNumber);
}


function Log_test(range){
  if(!range){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors');
    range = sheet.getRange('A1')
  }
  range.setValue( "180223 " + getDateNowStr()  );
}

function test222(){
  logError("123")
  
}
