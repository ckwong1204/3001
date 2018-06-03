var cacheGetSheetByName ={};
function getSheetByName(sheetName){
  var a = cacheGetSheetByName[sheetName];
  if(!cacheGetSheetByName[sheetName]){
    cacheGetSheetByName[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  }
  return cacheGetSheetByName[sheetName];
}

function getDateNowStr(){
  var d = new Date();
  var dd = ""+
      d.getFullYear() + "-" + 
      ("0" + (d.getMonth()+1)).slice(-2) +  "-" + 
      ("0" + d.getDate()).slice(-2) +  " " +
      ("0" + d.getHours()).slice(-2) + ":" + 
      ("0" + d.getMinutes()).slice(-2) + ":" +
      ("0" + d.getSeconds()).slice(-2);
  return dd;
}