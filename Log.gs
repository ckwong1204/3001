
function logError(message, fileName, lineNumber){
  var errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors');
  lastRow = errorSheet.getLastRow() + 1;
  var range = errorSheet.getRange( 'A' + lastRow + ':D' +lastRow);
  range.setValues([[
    getDateNowStr(),
    message,
    fileName,
    lineNumber
  ]]);
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

function test(){
  var t = getDateNowStr();
  
  Logger.log(t);
  Logger.log(t);
  
}

function test11111(){ 
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors').appendRow([1,2,3,4])
}