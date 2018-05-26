//add new daily report to sheet DailyReport
function DailyReport_Trigger(){
  var sheet = getSheetByName('DailyReport');
  var newRow = sheet.getLastRow() + 1;
  
  calc_DailyReport_openDialog(newRow)
  
  var range = sheet.getRange('A' +newRow +':AA'+ newRow); range.setValues( range.getValues() );
  
  return true;
}

function calc_DailyReport_test (){ 
  //get last row  
  init_DailyReport(160, '180403');
  calc_DailyReport(160, '180403');
  post_DailyReport(160)
}
function calc_DailyReport_openDialog_test (){ calc_DailyReport_openDialog ( 94 )}

function calc_DailyReport_openDialog ( row ){ 
  init_DailyReport(row);
  calc_DailyReport(row);
  post_DailyReport(row);
}

function init_DailyReport ( row, date ){
  var sheet = getSheetByName('DailyReport');

  if(date == null){  date = sheet.getRange('B'+row).getValue(); }   
  if(date == ""  ){  date = getLastTransactionDate(); }
  
  /*1 A "合約月"      */ sheet.getRange('B'+row).setValue(date);
  /*1 B "交易日"      */ sheet.getRange('A'+row).setValue( getContractYearMonth_currStr(date) );
  
  var rangeList = sheet.getRange('C'+row+':G'+row);
  var formulaR1C1List = [];
  /*2  C 3001 IV 		 */ formulaR1C1List[0] = "=R[0]C[8]+R[0]C[9]-ABS(R[0]C[3]-R[0]C[5]) -(R[0]C[6]+R[0]C[7]-ABS(R[0]C[2]-R[0]C[5]))";
  /*3  D 下月 3001 IV	    */ formulaR1C1List[1] = "=(R[0]C[9]+R[0]C[10]-ABS(R[0]C[3]-R[0]C[4])) -(R[0]C[7]+R[0]C[8]-ABS(R[0]C[2]-R[0]C[4]))";
  /*4  E 即月  HSIF:		*/ formulaR1C1List[2] = '=VLOOKUP("'+date+'",HSIF!C1:C15,6,FALSE)';
  /*5  F 下月  HSIF:		*/ formulaR1C1List[3] = '=VLOOKUP("'+date+'",HSIF!C1:C15,13,FALSE)';
  /*6  G 下月  HSIF:		*/ formulaR1C1List[4] = '=VLOOKUP("'+date+'",HSIF!C1:C22,20,FALSE)';
  rangeList.setFormulasR1C1([formulaR1C1List]);

  /*6  H ATM  行使價:	*/  
  var strick = sheet.getRange('H'+row).getValue();
  if (strick == ""){
    sheet.getRange('H'+row).setFormula("=getClosestStrikePrice(R[0]C[-3])")
  }
}

/**
 * get calc_DailyReport
 * @customfunction
 */
function calc_DailyReport ( row ){
  try{
    Logger.log("\n\n trigered calc_DailyReport("+row + ") ------------------------------------\n" );
    var sheet = getSheetByName('DailyReport');
    
    var rangeList = sheet.getRange('A'+row+':H'+row);
    var valueList = rangeList.getValues()[0];    
    var date      = valueList[1]; // B: 交易日 yymmdd
    var strike    = valueList[7]; // H: ATM 行使價:
//    var strike_next = valueList[6]; // F: 下月 ATM 行使價:
    
    var contract = getContractYearMonths_json(date);
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
    if(data){
      sheet.getRange('I'+row).setValue( data[ date + Curr_C_str  ].OQP_CLOSE ); // H: 交易日 即月 Call    date + CommonData.Month[contract_curr.month]  + "-" + contract_curr.year  + "-" + strike + "-" + "C"
      sheet.getRange('J'+row).setValue( data[ date + Curr_P_str  ].OQP_CLOSE ); // I: 交易日 即月 Put     date + CommonData.Month[contract_curr.month]  + "-" + contract_curr.year  + "-" + strike + "-" + "P"
      sheet.getRange('K'+row).setValue( data[ date + Next_C_str  ].OQP_CLOSE ); // J: 交易日 下月 Call    date + CommonData.Month[contract_next.month]  + "-" + contract_next.year  + "-" + strike + "-" + "C"
      sheet.getRange('L'+row).setValue( data[ date + Next_P_str  ].OQP_CLOSE ); // K: 交易日 下月 Put     date + CommonData.Month[contract_next.month]  + "-" + contract_next.year  + "-" + strike + "-" + "P" 
      sheet.getRange('M'+row).setValue( data[ date + Next2_C_str ].OQP_CLOSE ); // J: 交易日 下下月 Call  date + CommonData.Month[contract_next2.month] + "-" + contract_next2.year + "-" + strike + "-" + "C"
      sheet.getRange('N'+row).setValue( data[ date + Next2_P_str ].OQP_CLOSE ); // K: 交易日 下下月 Put   date + CommonData.Month[contract_next2.month] + "-" + contract_next2.year + "-" + strike + "-" + "P" 
            
      sheet.getRange('Y'+row).setValue( date + " "+ getDateNowStr() );
    }
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
}

function getfunction(){
  var sheet = getSheetByName('DailyReport');
  var aa= sheet.getRange('B14:M14').getFormulasR1C1();
  Logger.log(aa);
}

function post_DailyReport(row){
  var sheet = getSheetByName('DailyReport');

  var rangeList = sheet.getRange('Q'+row+':W'+row);
  var formulaR1C1List = rangeList.getFormulasR1C1();
  formulaR1C1List[0] = "=(R[0]C[-8]+R[0]C[-7]-ABS(R[0]C[-12]-R[0]C[-9]))";
  formulaR1C1List[1] = "=(R[0]C[-7]+R[0]C[-6]-ABS(R[0]C[-12]-R[0]C[-10]))";
  formulaR1C1List[2] = "=(R[0]C[-6]+R[0]C[-5]-ABS(R[0]C[-12]-R[0]C[-11]))";
  formulaR1C1List[3] = "=R[0]C[-3]-R[0]C[-2]";
  formulaR1C1List[4] = "=R[0]C[-11]+R[0]C[-12]-(R[0]C[-10]+R[0]C[-9])*2";
  formulaR1C1List[5] = "=-(R[0]C[-12]+R[0]C[-13])+(R[0]C[-11]+R[0]C[-10])*2";
  formulaR1C1List[6] = "=-(R[0]C[-13]+R[0]C[-14])+(R[0]C[-12]+R[0]C[-11])" ;
  rangeList.setFormulasR1C1([formulaR1C1List]);
  
}

function test(){
  post_DailyReport(160)
//  var row = 120;
//  var sheet = getSheetByName('DailyReport');
//    
//  var rangeList = sheet.getRange('A'+row+':X'+row);
//  var c= rangeList.getFormulasR1C1();
//  Logger.log(c);
  
}

// A 合約月	 		=getContractYearMonths(date)
// B 交易日			
// C 3001 IV 		"=R[0]C[7]+R[0]C[8]-ABS(R[0]C[3]-R[0]C[4]) -(R[0]C[5]+R[0]C[6]-ABS(R[0]C[2]-R[0]C[4]))"
// D 下月 3001 IV	"=(R[0]C[8]+R[0]C[9]-ABS(R[0]C[2]-R[0]C[3])) -(R[0]C[6]+R[0]C[7]-ABS(R[0]C[1]-R[0]C[3]))"
// E 即月  HSIF:		"=VLOOKUP(R[0]C[-3],HSIF!C1:C15,6,FALSE)"
// F 下月  HSIF:		"=VLOOKUP(R[0]C[-4],HSIF!C1:C15,13,FALSE)"
// G ATM  行使價:	"=getClosestStrikePrice(R[0]C[-2])"
// H 即月  Call		
// I 即月  Put		
// J 下月  Call		
// K 下月  Put		
// L 下下月  Call	
// M 下下月  Put			