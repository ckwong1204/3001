
function updateDateList(){
  var sheet = getSheetByName('date');
  var rangeList = sheet.getRange('C1');
  var list_str = rangeList.getValue();
  var list = list_str.split(',')
  list.forEach(function(i){
    addDateList(i)
  })
}
//triggered daily
function addDateList_test(){ addDateList ("171229")}
function addDateList(date){
  var sheet = getSheetByName('date');
  
  var target_row = findTargetRow(date, sheet);
  
  var rangeList = sheet.getRange('C' + target_row);
  var list_str = rangeList.getValue();
  var is_contain_date = list_str.indexOf(date) !== -1;
  if(!is_contain_date){
    list_str += "" + ( list_str == "" ? "":",") + date;
    rangeList.setValue(list_str);
    
    //update  "Last Transaction Date"
    sheet.getRange('D2').setValue(date);
  }
  return true;
}
function getLastTransactionDate(){
  var sheet = getSheetByName('date');
  return sheet.getRange('D2').getValue();
}
function findTargetRow(date, sheet){
  try{
    if(sheet == null){
      sheet = getSheetByName('date');
    }
    var sheet_serch_row_base = 2;
    var rangeList = sheet.getRange('A'+sheet_serch_row_base+':B');
    var valuesList = rangeList.getValues();
    
    var target_row = sheet_serch_row_base;
    //  valuesList.forEach(function(item){
    for (var i = 1; i < valuesList.length; i++) {
      var last_contract_date_end = valuesList[i-1][1]; /* B "結算日 d/m/Y"                   */
      var curr_contract_date_end = valuesList[i][1];   /* B "結算日 d/m/Y"                   */
      if (curr_contract_date_end == "") {
        target_row += i;
        break;
      }
      if(last_contract_date_end < date && date  <= curr_contract_date_end){ 
        target_row += i;
        break;
      }
    }
    return target_row;
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}
function getContractYearMonth_test(date){  
  var a = getContractYearMonth('170101')  
  Logger.log(a);
}
function getContractYearMonth_currStr(date){
  return getContractYearMonths_json(date, true);
}  
function getContractYearMonths_json(date, isCurrStr){
  var sheet = getSheetByName('date');
  var target_row = findTargetRow(date, sheet);
  var rangeList = sheet.getRange('A' + target_row + ':A'+ (target_row +2) );
  var list_str = rangeList.getValues(); //[["2017-11"], ["2017-12"], ["2018-01"]]
  
  var str_curr  = list_str[0][0];
  var str_next  = list_str[1][0];
  var str_next2 = list_str[2][0];
  
  if(isCurrStr) {return str_curr;}
  
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

function getDate_firstdateOfMonth_test(){ return getContractYearMonthInfo_byMonth("2017-12") }

function getDate_firstdateOfMonth_byDate(date){ 
  var month = getContractYearMonth_currStr(date);
  return getContractYearMonthInfo_byMonth(month) 
}
function getContractYearMonthInfo_byMonth(month){
  try{  
    if(month && typeof month == "string" && month.length == 7 ){ //2017-12
      var sheet = getSheetByName('date');
      var rangeList = sheet.getRange('A3:C');
      var valuesList = rangeList.getValues(); 
      var returnValue = {};
      
      valuesList.forEach(function(r){
        if(r[0] == month){
          returnValue.month = r[0];
          returnValue.day_last = r[1];
          returnValue.day_first = r[2].split(',')[0];
          returnValue.day_list = r[2].split(',');
        }
      })
      
      return returnValue;
    }
//    logError(message, fileName, lineNumber);
    return "";
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
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