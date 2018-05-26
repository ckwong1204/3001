//set get range

//add trigger


function calc_3001_test(){
//  calc_3001(80);
  calc_3001(84);
}

function formular_test(){
  row = 106;
  var sheet = getSheetByName('3001');
  //  setFormulas_3001_1stDay(sheet, row);
  setFormulas_3001_endDay(sheet, row);
}

function DailyMartketReport_triger_test(){
  //  calc_3001(80);
  DailyMartketReport_triger('180523');
}
function calc_3001_today_test(date){ calc_3001_today('171124'); }
// test ------------------------------------------------------------------

// update the data in row 2 for today's record
function calc_3001_today(date){
  calc_3001(2, date);
  //send email    
}

//triggered daily
function DailyMartketReport_triger(date){
  try{
    var sheet_serch_row_base = 81;
    
    var sheet = getSheetByName('3001');
    var rangeList = sheet.getRange('B'+sheet_serch_row_base+':C');
    var valuesList = rangeList.getValues();
    
    var target_row = sheet_serch_row_base;
    //  valuesList.forEach(function(item){
    for (var i = 0; i < valuesList.length; i++) {
      var date_1st = valuesList[i][0]; /* B "1st交易日"                      */  
      var date_end = valuesList[i][1]; /* C "結算日 d/m/Y"                   */
      if(date_1st == ""){
        //      /* B "1st交易日"*/ sheet.getRange('B'+(target_row + i)).setFormula("=VLOOKUP(R[-1]C[1],HSIF!C[-1]:C[13],2,false)");
        target_row += i;
        break;
      }
      if(date_1st <= date && date  <= date_end){ 
        target_row += i;
        break;
      }
    }
    calc_3001(target_row, date);
    
    // update row 2 for today's record, will send extra email
    calc_3001_today(date);
    
    var range = sheet.getRange('A' +target_row +':AA'+ target_row); range.setValues( range.getValues() );
    range = sheet.getRange('A2:AA2');                               range.setValues( range.getValues() );
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}
///**
// * get HSIO
// * @param {18-Sep-17} str
// * @return {"170918"} date
// *
// * @customfunction
// */
//function toDate_dd_MMM_yy(str) {
////    var str = "31-Mar-17";
//  var date = str.split('-')[0];
//  var Month = str.split('-')[1];
//  var year = str.split('-')[2];
//  return year + CommonData.Month[Month.toUpperCase()] + (date.length == 1 ? "0" + date : date);
////  var a =  year + CommonData.Month[Month.toUpperCase()] + (date.length == 1 ? "0" + date : date);
////  return a;
//}




/**
 * get calc_3001
 *
 * @param {26001} excel_row
 * @return {26000} closest
 *
 * @customfunction
 */
function calc_3001 ( row, date){
  try{
    Logger.log("\n\n trigered calc_3001("+row + " "+date+ ") ------------------------------------\n" );
    var sheet = getSheetByName('3001');
    var rangeList = sheet.getRange('A'+row+':H'+row);
    
    var today_yymmdd = date;
    if(!date){  today_yymmdd = getLastTransactionDate(); }
    
    setFormulas_3001_1stDay(sheet, row, today_yymmdd);
    
    
    var valueList = rangeList.getValues()[0];    
    var date_1st    = valueList[1]; // B: 第一交易日 yymmdd
    var date_end    = valueList[2]; // C: 結算日    yymmdd
    var strike_curr = valueList[6]; // G: 即月 行使價
    var strike_next = valueList[7]; // H: 下月 行使價
    
    var contract = getContractYearMonths_json(date_end);
    var contracts = [{ year: contract.curr.year,  month: contract.curr.month,  strike: strike_curr, C_P: '.' },
                     { year: contract.next.year,  month: contract.next.month,  strike: strike_next, C_P: '.' }];

    var Curr_C_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C";
    var Curr_P_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P";
    var Next_C_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C";
    var Next_P_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P";
    
    
    if (date_1st  <=  today_yymmdd) { // if current Date >= 第一交易日
      var data_1st = get_hsio_json(date_1st, contracts);
      if(get_hsio_json){
        sheet.getRange('I'+row).setValue( data_1st[ date_1st + Curr_C_str ].OQP_CLOSE ).setNote( date_1st + Curr_C_str ); // I: 1st交易日 即月 Call  date_1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C"
        sheet.getRange('K'+row).setValue( data_1st[ date_1st + Curr_P_str ].OQP_CLOSE ).setNote( date_1st + Curr_P_str ); // K: 1st交易日 即月 Put   date_1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P"
        sheet.getRange('M'+row).setValue( data_1st[ date_1st + Next_C_str ].OQP_CLOSE ).setNote( date_1st + Next_C_str ); // M: 1st交易日 下月 Call  date_1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
        sheet.getRange('O'+row).setValue( data_1st[ date_1st + Next_P_str ].OQP_CLOSE ).setNote( date_1st + Next_P_str ); // O: 1st交易日 下月 Put   date_1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"      
        sheet.getRange('W'+row).setValue( date_1st + " "+  getDateNowStr() );
      }
    }
    if (date_1st < today_yymmdd ) { // if 第一交易日 < current Date
      var dataDate;
      
      if(today_yymmdd < date_end){ dataDate = today_yymmdd; } // if 第一交易日 < current Date < 結算日 
      else{                        dataDate = date_end; }     // if  結算日 <= current Date
      
      var data_after_1stday = get_hsio_json(dataDate, contracts);
      if(data_after_1stday){
        if (dataDate == date_end) {
          setFormulas_3001_endDay(sheet, row, dataDate);
        } else {
          sheet.getRange('J'+row).setValue( data_after_1stday[ dataDate + Curr_C_str ].OQP_CLOSE ).setNote( dataDate + Curr_C_str ); /* J "結算日 即月 Call"               */
          sheet.getRange('L'+row).setValue( data_after_1stday[ dataDate + Curr_P_str ].OQP_CLOSE ).setNote( dataDate + Curr_P_str ); /* L "結算日 即月 Put"                */
        }
        sheet.getRange('N'+row).setValue( data_after_1stday[ dataDate + Next_C_str ].OQP_CLOSE ).setNote( dataDate + Next_C_str ); // N: 結算日    下月 Call  date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
        sheet.getRange('P'+row).setValue( data_after_1stday[ dataDate + Next_P_str ].OQP_CLOSE ).setNote( dataDate + Next_P_str ); // P: 結算日    下月 Put   date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"
        sheet.getRange('W'+row).setValue( dataDate + " "+ getDateNowStr() );
        
        
        setFormulas_3001_beforeEndDay(sheet, row, dataDate);
      }
    }
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
}

function getDate(date_diff){
  //new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}) //Asia/Hong_Kong
  var d = new Date();
  d.setDate(d.getDate() + date_diff);
  
  var dd = d.getDate();
  var mm = d.getMonth()+1; //January is 0!
  var yyyy = d.getFullYear();
  
  return "" + yyyy%100 + (mm < 10 ? "0"+ mm : mm) + (dd < 10 ? "0"+ dd : dd);
}

function setFormulas_3001_1stDay(sheet, row, dataDate){
  if(row ==2){
    /* B "1st交易日"      */ sheet.getRange('B'+row).setValue(dataDate);
    /* C                 */ sheet.getRange('C'+row).setValue(dataDate);
  }
  else{
    //set 1st交易日 by 結算日
    var date_Last = sheet.getRange('C'+row).getValue();
    var date_1st = getDate_firstdateOfMonth_byDate(date_Last).day_first;
    /* B "1st交易日"      */ sheet.getRange('B'+row).setValue( date_1st );
    
    dataDate = date_1st;
  }
  
  /* S "IVB:<400 A:400-580 C:>580"  */ sheet.getRange('S'+row).setFormula("=IF(R[0]C[-15]<400, \"B\", IF(R[0]C[-15]>580, \"C\", \"A\") )");
  
  var rangeList = sheet.getRange('D'+row+':H'+row);
  var formulaR1C1List = [];
  /* D "IV spread"                */   formulaR1C1List[0] = "=R[0]C[9]+R[0]C[11]-ABS(R[0]C[2]-R[0]C[4]) -(R[0]C[5]+R[0]C[7]-ABS(R[0]C[1]-R[0]C[3]))";
  /* E "1st交易日 即月 HSIF:"       */   formulaR1C1List[1] = '=INT(VLOOKUP("'+dataDate+'",HSIF!C1:C15,6,FALSE))';
  /* F "1st交易日 下月 HSIF:"       */   formulaR1C1List[2] = '=INT(VLOOKUP("'+dataDate+'",HSIF!C1:C15,13,FALSE))';
  /* G "即月ATM 行使價:"            */   formulaR1C1List[3] = "=INT(getClosestStrikePrice(R[0]C[-2]))";
  /* H "下月ATM 行使價:"            */   formulaR1C1List[4] = "=INT(getClosestStrikePrice(R[0]C[-2]))";
  
  rangeList.setFormulasR1C1([formulaR1C1List]);

}

function setFormulas_3001_endDay(sheet, row, dataDate){
/* J "結算日 即月 Call"              */   sheet.getRange('J'+row).setFormula("=IF(INT(R[0]C[7])>INT(R[0]C[-3]),R[0]C[7]-R[0]C[-3],0)");
/* L "結算日 即月 Put"               */   sheet.getRange('L'+row).setFormula("=IF(INT(R[0]C[5])<INT(R[0]C[-5]),R[0]C[-5]-R[0]C[5],0)");
}

function setFormulas_3001_beforeEndDay(sheet, row, dataDate){
  var rangeList = sheet.getRange('Q'+row+':V'+row);
  var formulaR1C1List = [];
  /* Q "結算日 即月 HSIF"                */   formulaR1C1List[0] = "=VLOOKUP(R[0]C[-14],HSIF!C1:C15,6,FALSE)";
  /* R "結算日 下月 HSIF"                */   formulaR1C1List[1] = "=VLOOKUP(R[0]C[-15],HSIF!C1:C15,13,FALSE)";
  /* S "IVB:<400 A:400-580 C:>580"     */   formulaR1C1List[2] = "=IF(R[0]C[-15]<400, \"B\", IF(R[0]C[-15]>580, \"C\", \"A\") )";
  /* T "A:L即ATM both S下ATM both x2"   */   formulaR1C1List[3] = "=IF(R[0]C[-1]=\"A\", (R[0]C[-10]-R[0]C[-11] + R[0]C[-8]-R[0]C[-9] ) + (R[0]C[-7]-R[0]C[-6] + R[0]C[-5]-R[0]C[-4])*2,\" \")";
  /* U "B:S即ATM both L下ATM both x2"   */   formulaR1C1List[4] = "=IF(R[0]C[-2]=\"B\", - (R[0]C[-11]-R[0]C[-12] + R[0]C[-9]-R[0]C[-10] ) - (R[0]C[-8]-R[0]C[-7] + R[0]C[-6]-R[0]C[-5])*2,\" \")";
  /* V "C:S即ATM both x2 L下ATM both x2"*/   formulaR1C1List[5] = "=IF(R[0]C[-3]=\"C\", - (R[0]C[-12]-R[0]C[-13] + R[0]C[-10]-R[0]C[-11] )*2 - (R[0]C[-9]-R[0]C[-8] + R[0]C[-7]-R[0]C[-6])*2,\" \")";

  if (dataDate) {
  /* Q "結算日 即月 HSIF"                */   formulaR1C1List[0] = "=VLOOKUP(\""+dataDate+"\",HSIF!C1:C15,6,FALSE)";
  /* R "結算日 下月 HSIF"                */   formulaR1C1List[1] = "=VLOOKUP(\""+dataDate+"\",HSIF!C1:C15,13,FALSE)";
  }

  rangeList.setFormulasR1C1([formulaR1C1List]);

}

// /* A                                 */   //formulaR1C1List[ 0] = ;
// /* B "1st交易日"                      */   formulaR1C1List[ 1] = "=VLOOKUP(R[-1]C[1],HSIF!C[-1]:C[13],2,false)";;
// /* C "結算日 d/m/Y"                   */   //formulaR1C1List[ 2] = ;
// /* D "IV spread"                     */   formulaR1C1List[ 3] = "=R[0]C[9]+R[0]C[11]-ABS(R[0]C[2]-R[0]C[4]) -(R[0]C[5]+R[0]C[7]-ABS(R[0]C[1]-R[0]C[3]))";
// /* E "1st交易日 即月 HSIF:"            */   formulaR1C1List[ 4] = "=VLOOKUP(R[0]C[-3],HSIF!C1:C15,6,FALSE)";
// /* F "1st交易日 下月 HSIF:"            */   formulaR1C1List[ 5] = "=VLOOKUP(R[0]C[-4],HSIF!C1:C15,13,FALSE)";
// /* G "即月ATM 行使價:"                 */   formulaR1C1List[ 6] = "=getClosestStrikePrice(R[0]C[-2])";
// /* H "下月ATM 行使價:"                 */   formulaR1C1List[ 7] = "=getClosestStrikePrice(R[0]C[-2])";
// /* I "1st交易日 即月 Call"             */   //formulaR1C1List[ 8] = ;
// /* J "結算日 即月 Call"                */   formulaR1C1List[ 9] = "=IF(R[0]C[7]>R[0]C[-3],R[0]C[7]-R[0]C[-3],0)";
// /* K "1st交易日 即月 Put"              */   //formulaR1C1List[10] = ;
// /* L "結算日 即月 Put"                 */   formulaR1C1List[11] = "=IF(R[0]C[5]<R[0]C[-5],R[0]C[-5]-R[0]C[5],0)";
// /* M "1st交易日 下月 Call"             */   //formulaR1C1List[12] = ;
// /* N "結算日 下月 Call"                */   //formulaR1C1List[13] = ;
// /* O "1st交易日 下月 Put"              */   //formulaR1C1List[14] = ;
// /* P "結算日 下月 Put"                 */   //formulaR1C1List[15] = ;
// /* Q "結算日 即月 HSIF"                */   formulaR1C1List[16] = "=VLOOKUP(R[0]C[-14],HSIF!C1:C15,6,FALSE)";
// /* R "結算日 下月 HSIF"                */   formulaR1C1List[17] = "=VLOOKUP(R[0]C[-15],HSIF!C1:C15,13,FALSE)";
// /* S "IVB:<400 A:400-580 C:>580"     */   formulaR1C1List[18] = "=IF(R[0]C[-15]<400, \"B\", IF(R[0]C[-15]>580, \"C\", \"A\") )";
// /* T "A:L即ATM both S下ATM both x2"   */   formulaR1C1List[19] = "=IF(R[0]C[-1]=\"A\", (R[0]C[-10]-R[0]C[-11] + R[0]C[-8]-R[0]C[-9] ) + (R[0]C[-7]-R[0]C[-6] + R[0]C[-5]-R[0]C[-4])*2,\" \")";
// /* U "B:S即ATM both L下ATM both x2"   */   formulaR1C1List[20] = "=IF(R[0]C[-2]=\"B\", - (R[0]C[-11]-R[0]C[-12] + R[0]C[-9]-R[0]C[-10] ) - (R[0]C[-8]-R[0]C[-7] + R[0]C[-6]-R[0]C[-5])*2,\" \")";
// /* V "C:S即ATM both x2 L下ATM both x2"*/   formulaR1C1List[21] = "=IF(R[0]C[-3]=\"C\", - (R[0]C[-12]-R[0]C[-13] + R[0]C[-10]-R[0]C[-11] )*2 - (R[0]C[-9]-R[0]C[-8] + R[0]C[-7]-R[0]C[-6])*2,\" \")";
    