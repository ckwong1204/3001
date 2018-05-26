function calc_3001_obj ( date ){
  try{
    Logger.log("\n\n trigered calc_3001_obj(" + date+ ") ------------------------------------\n" );
    var sheet = getSheetByName('3001')
    
    var today_yymmdd = date;
    if(!date){  
      today_yymmdd = getLastTransactionDate(); 
    }
    
//    setFormulas_3001_1stDay(sheet, row, today_yymmdd);
    
    
    //set 1st交易日 by 結算日
    var date_end = sheet.getRange('C'+row).getValue();
    var date_1st = getDate_firstdateOfMonth_byDate(date_end).day_first;

//    
//    
//    var date_1st    = valueList[1]; // B: 第一交易日 yymmdd ContrMnthDay1st firstTranactionDayInContractMonth
//    var date_end    = valueList[2]; // C: 結算日    yymmdd ContrMnthDayEnd lastTranactionDayInContractMonth
//    var strike_curr = valueList[6]; // G: 即月 行使價
//    var strike_next = valueList[7]; // H: 下月 行使價
//    
//    var contract = getContractYearMonths_json(date_end);
//    var contracts = [{ year: contract.curr.year,  month: contract.curr.month,  strike: strike_curr, C_P: '.' },
//                     { year: contract.next.year,  month: contract.next.month,  strike: strike_next, C_P: '.' }];
//
//    var curr_C_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C";
//    var curr_P_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P";
//    var next_C_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C";
//    var next_P_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P";
//    
//    
//    if (date_1st  <=  today_yymmdd) { // if current Date >= 第一交易日
//      var data_1st = get_hsio_json(date_1st, contracts);
//      if(get_hsio_json){
//        sheet.getRange('I'+row).setValue( data_1st[ date_1st + curr_C_str ].OQP_CLOSE ).setNote( date_1st + curr_C_str ); // I: 1st交易日 即月 Call  date_1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C"
//        sheet.getRange('K'+row).setValue( data_1st[ date_1st + curr_P_str ].OQP_CLOSE ).setNote( date_1st + curr_P_str ); // K: 1st交易日 即月 Put   date_1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P"
//        sheet.getRange('M'+row).setValue( data_1st[ date_1st + next_C_str ].OQP_CLOSE ).setNote( date_1st + next_C_str ); // M: 1st交易日 下月 Call  date_1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
//        sheet.getRange('O'+row).setValue( data_1st[ date_1st + next_P_str ].OQP_CLOSE ).setNote( date_1st + next_P_str ); // O: 1st交易日 下月 Put   date_1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"      
//        sheet.getRange('W'+row).setValue( date_1st + " "+  getDateNowStr() );
//      }
//    }
//    if (date_1st < today_yymmdd ) { // if 第一交易日 < current Date
//      var dataDate;
//      
//      if(today_yymmdd < date_end){ dataDate = today_yymmdd; } // if 第一交易日 < current Date < 結算日 
//      else{                        dataDate = date_end; }     // if  結算日 <= current Date
//      
//      var data_after_1stday = get_hsio_json(dataDate, contracts);
//      if(data_after_1stday){
//        if (dataDate == date_end) {
//          setFormulas_3001_endDay(sheet, row, dataDate);
//        } else {
//          sheet.getRange('J'+row).setValue( data_after_1stday[ dataDate + curr_C_str ].OQP_CLOSE ).setNote( dataDate + curr_C_str ); /* J "結算日 即月 Call"               */
//          sheet.getRange('L'+row).setValue( data_after_1stday[ dataDate + curr_P_str ].OQP_CLOSE ).setNote( dataDate + curr_P_str ); /* L "結算日 即月 Put"                */
//        }
//        sheet.getRange('N'+row).setValue( data_after_1stday[ dataDate + next_C_str ].OQP_CLOSE ).setNote( dataDate + next_C_str ); // N: 結算日    下月 Call  date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
//        sheet.getRange('P'+row).setValue( data_after_1stday[ dataDate + next_P_str ].OQP_CLOSE ).setNote( dataDate + next_P_str ); // P: 結算日    下月 Put   date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"
//        sheet.getRange('W'+row).setValue( dataDate + " "+ getDateNowStr() );
//        
//        
//        setFormulas_3001_beforeEndDay(sheet, row, dataDate);
//      }
//    }
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
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
