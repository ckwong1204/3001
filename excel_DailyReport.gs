function calc_DailyReport_test ( row, date ){ 
  //get last row  
  init_DailyReport(5, '171122');
  calc_DailyReport(5, '171122');
}
function calc_DailyReport_openDialog_test (){ calc_DailyReport_openDialog ( 8 )}

function calc_DailyReport_openDialog ( row ){ 
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('DailyReport');
  var date = sheet.getRange('B'+row).getValue();
  if(!date){  date = getLastTransactionDate(); }   
  init_DailyReport(row, date);
  calc_DailyReport(row, date);
}

/**
 * get calc_DailyReport
 * @customfunction
 */
function calc_DailyReport ( row, date ){
  try{
    Logger.log("\n\n trigered calc_DailyReport("+row + " "+date+ ") ------------------------------------\n" );
    var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('DailyReport');
    
    if(!date){  date = getLastTransactionDate(); }   
    
    var rangeList = sheet.getRange('A'+row+':H'+row);
    var valueList = rangeList.getValues()[0];    
    var date        = valueList[1]; // B: 交易日 yymmdd
    var strike = valueList[5]; // E: 即月 ATM 行使價:
//    var strike_next = valueList[6]; // F: 下月 ATM 行使價:
    
    var contract = getContractYearMonths(date);
    var contracts = [{ year: contract.curr.year,  month: contract.curr.month,  strike: strike, C_P: '.' },
                     { year: contract.next.year,  month: contract.next.month,  strike: strike, C_P: '.' },
                     { year: contract.next2.year, month: contract.next2.month, strike: strike, C_P: '.' }];


    var Curr_C_str  = '-' + CommonData.Month[contract.curr.month]  + "-" + contract.curr.year  + "-" + strike + "-" + "C";
    var Curr_P_str  = '-' + CommonData.Month[contract.curr.month]  + "-" + contract.curr.year  + "-" + strike + "-" + "P";
    var Next_C_str  = '-' + CommonData.Month[contract.next.month]  + "-" + contract.next.year  + "-" + strike + "-" + "C";
    var Next_P_str  = '-' + CommonData.Month[contract.next.month]  + "-" + contract.next.year  + "-" + strike + "-" + "P";
    var Next2_C_str = '-' + CommonData.Month[contract.next2.month] + "-" + contract.next2.year + "-" + strike + "-" + "C";
    var Next2_P_str = '-' + CommonData.Month[contract.next2.month] + "-" + contract.next2.year + "-" + strike + "-" + "P";
    
    var data = get_hsio_json(date, contracts);
    if(get_hsio_json){
      sheet.getRange('H'+row).setValue( data[ date + Curr_C_str  ].OQP_CLOSE ); // H: 交易日 即月 Call    date + CommonData.Month[contract_curr.month]  + "-" + contract_curr.year  + "-" + strike + "-" + "C"
      sheet.getRange('I'+row).setValue( data[ date + Curr_P_str  ].OQP_CLOSE ); // I: 交易日 即月 Put     date + CommonData.Month[contract_curr.month]  + "-" + contract_curr.year  + "-" + strike + "-" + "P"
      sheet.getRange('J'+row).setValue( data[ date + Next_C_str  ].OQP_CLOSE ); // J: 交易日 下月 Call    date + CommonData.Month[contract_next.month]  + "-" + contract_next.year  + "-" + strike + "-" + "C"
      sheet.getRange('K'+row).setValue( data[ date + Next_P_str  ].OQP_CLOSE ); // K: 交易日 下月 Put     date + CommonData.Month[contract_next.month]  + "-" + contract_next.year  + "-" + strike + "-" + "P" 
      sheet.getRange('L'+row).setValue( data[ date + Next2_C_str ].OQP_CLOSE ); // J: 交易日 下下月 Call  date + CommonData.Month[contract_next2.month] + "-" + contract_next2.year + "-" + strike + "-" + "C"
      sheet.getRange('M'+row).setValue( data[ date + Next2_P_str ].OQP_CLOSE ); // K: 交易日 下下月 Put   date + CommonData.Month[contract_next2.month] + "-" + contract_next2.year + "-" + strike + "-" + "P" 
      sheet.getRange('W'+row).setValue( "from " + date + " "+ new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
    }
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
}

function init_DailyReport ( row, date ){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('DailyReport');
  /*1 B "交易日"      */ sheet.getRange('B'+row).setValue(date);
  
  var rangeList = sheet.getRange('C'+row+':G'+row);
  var formulaR1C1List = [];
  /*2  C: IV spread      */ formulaR1C1List[0] = "=R[0]C[7]+R[0]C[8]-ABS(R[0]C[2]-R[0]C[4]) -(R[0]C[5]+R[0]C[6]-ABS(R[0]C[1]-R[0]C[3]))" ;
  /*3  B: 即月 HSIF:      */ formulaR1C1List[1] = "=VLOOKUP(R[0]C[-2],HSIF!C1:C15,7,FALSE)" ;
  /*4  D: 下月 HSIF:      */ formulaR1C1List[2] = "=VLOOKUP(R[0]C[-3],HSIF!C1:C15,13,FALSE)" ;
  /*5  E: 即月 ATM 行使價: */ formulaR1C1List[3] = "=getClosestStrikePrice(R[0]C[-2])" ;
//  /*6  F: 下月 ATM 行使價: */ formulaR1C1List[4] = "=getClosestStrikePrice(R[0]C[-2])";
  rangeList.setFormulasR1C1([formulaR1C1List]);
}

//0  A: 
//1  B: 1st 交易日
//2  C: IV spread
//3  B: 即月 HSIF:
//4  D: 下月 HSIF:
//5  E: 即月 ATM 行使價:
//6  F: 下月 ATM 行使價:

//7  H: 交易日 即月 Call
//8  I: 交易日 即月 Put
//9  J: 交易日 下月 Call
//10 K: 交易日 下月 Put