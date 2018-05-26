var cacheGetSheetByName ={};
function getSheetByName(sheetName){
  var a = cacheGetSheetByName[sheetName];
  if(!cacheGetSheetByName[sheetName]){
    cacheGetSheetByName[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  }
  return cacheGetSheetByName[sheetName];
}