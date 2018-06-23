var CommFnCache ={};
function getSheetByName(sheetName){
  if(!CommFnCache[sheetName]){
    CommFnCache[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  }
  return CommFnCache[sheetName];
}

function putLocalCache(cacheKey, cacheObj){
  if(!CommFnCache[cacheKey]){
    CommFnCache[cacheKey] = cacheObj;
  }
  return CommFnCache[cacheKey];
}

function getLocalCache(cacheKey){
  return CommFnCache[cacheKey];
}

function getGoogleCache(cacheKey, functionToBeCall, arg1, arg2, arg3, arg4){
  
  var cached = CacheService.getDocumentCache().get(cacheKey) ;
  if(cached == null){
    try{
      var cached = functionToBeCall(arg1, arg2, arg3, arg4);
      CacheService.getDocumentCache().put(cacheKey, JSON.stringify(cached), 21600);
    }catch(e){ console.log(e); logError(e); }
  }
  else{cached = JSON.parse(cached)}

  return cached;
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

function changeStr(description, oldValue, newValue){
  return "" + description +": "+ oldValue +" -> "+ newValue + "\n";
}