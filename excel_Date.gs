
var cacheGetContractMonthInfoList=null;
function clearCacheContractMonthInfoList(){
  this.cacheGetContractMonthInfoList=null
}
function getContractMonthInfoList(){
  if(!this.cacheGetContractMonthInfoList){
    var sheet = getSheetByName('date');
    var rangeList = sheet.getRange('A2:C');
    
    this.cacheGetContractMonthInfoList = rangeList.getValues()
      .map(function(v,index, arr) { 
        var dateList = v[2] == ""? []: v[2].split(',');
        return {  //convert to obj
          contractMonth: v[0],
          dateEnd:  v[1],
          date1st:  dateList[0] || "",
          dateList: dateList,
          sheetRow:  index + 2         
        }})
     .filter( function(val) {return val.dateEnd != ""} ); // filter out those Expiry Day 結算日 is empty
  }
  return this.cacheGetContractMonthInfoList;
}

//return concated dateList for all months
function getDateList(){
  return getContractMonthInfoList()
  .reduce(function(concatList,v,i,arr){ return concatList.concat(v.dateList.concat()) }, [])
}

function findContractMonthInfoByDate(targetDate){
  var v= getContractMonthInfoList();
  for (var i = 1; i < v.length; i++) {
    if(targetDate <= v[i].dateEnd)
      return v[i];
  }
  return null;
}

function findContractMonthInfoByMonth(targetMonth){
  if(targetMonth && typeof targetMonth == "string" && targetMonth.length == 7 ){ //2017-12
    var v= getContractMonthInfoList();
    for (var i = 1; i < v.length; i++) {
      if(targetMonth == v[i].contractMonth)
        return v[i];
    }
  }
  return null;
}

function findTargetRow(date){
  return findContractMonthInfoByDate(date).sheetRow;
}

//triggered daily
function addDateList_test(){ addDateList ("180527")}
function addDateList(date){
  var sheet = getSheetByName('date');
  
  var contractMonthInfo = findContractMonthInfoByDate(date);
  
  if( contractMonthInfo.dateList.indexOf(date) == -1){
    var newDateStr = contractMonthInfo.dateList.concat(date).sort().join();
    sheet.getRange('C' + contractMonthInfo.sheetRow).setValue(newDateStr);
    clearCacheContractMonthInfoList();
    
    //update  "Last Transaction Date"
    sheet.getRange('D2').setValue(date);
  }
  return true;
}

function getLastTransactionDate(){
  var sheet = getSheetByName('date');
  return sheet.getRange('D2').getValue();
}
function getContractYearMonth_test(date){  
  var a = getContractYearMonth('170101')  
  Logger.log(a);
}
function getContractYearMonth_currStr(date){
  return getContractYearMonths_json(date, true);
}  

//this shd be handle in HSIF
function getContractYearMonths_json(date, isStr){
  var sheet = getSheetByName('date');
  var target_row = findTargetRow(date);
  var rangeList = sheet.getRange('A' + target_row + ':A'+ (target_row +2) );
  var list_str = rangeList.getValues(); //[["2017-11"], ["2017-12"], ["2018-01"]]
  
  var str_curr  = list_str[0][0];
  var str_next  = list_str[1][0];
  var str_next2 = list_str[2][0];
  
  if(isStr) {return str_curr;}
  
  var contracts = {
    curr:  { year: str_curr.substr(2,2),  month: str_curr.substr(5,2)  },
    next:  { year: str_next.substr(2,2),  month: str_next.substr(5,2)  },
    next2: { year: str_next2.substr(2,2), month: str_next2.substr(5,2) }
  };
  
  return contracts;
}

function getDate_Next(date){
  try{
    if(date && typeof date == "string" && date.length == 6 ){
      var list = getDateList();
      if(list)
        return list[ list.indexOf(date) +1];
    }
    return "";
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}
