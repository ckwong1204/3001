
function logError(s1, s2, s3, s4){
  getSheetByName('Errors').appendRow([
    getDateNowStr(),
    s1,
    s2,
    s3,
    s4
  ]);
}


function errorLog(e){
    logError(e.message, e.fileName, e.lineNumber);
}


function Log_test(range){
  if(!range){
    var sheet = getSheetByName('Errors');
    range = sheet.getRange('A1')
  }
  range.setValue( "180223 " + getDateNowStr()  );
}

function test222(){
  logError("123")
  
}
