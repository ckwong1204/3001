function calc_3001_obj ( date ){
  var  returnObj = {};
  try{
    Logger.log("\n\n trigered calc_3001_obj(" + date+ ") ------------------------------------\n" );
    if(!date){ var date = getLastTransactionDate(); }
    
    
    //set 1st交易日 by 結算日
    var contractMonthInfoByDate = findContractMonthInfoByDate(date);
   
    var contractMonth = contractMonthInfoByDate.contractMonth;
    var date1st = contractMonthInfoByDate.date1st;
    var dateEnd = contractMonthInfoByDate.dateEnd;
    
    var hsif_date1st = HSIF.getDate(date1st);
    var hsif_date1st_curr_close = hsif_date1st.curr.day_Settlement_Price;
    var hsif_date1st_next_close = hsif_date1st.next.day_Settlement_Price;
        
    var strike_curr = getClosestStrikePrice(hsif_date1st_curr_close); // G: 即月 行使價
    var strike_next = getClosestStrikePrice(hsif_date1st_next_close); // H: 下月 行使價
    
    var contract = getContractYearMonths_json(date);
    var contracts = [{ year: contract.curr.year,  month: contract.curr.month,  strike: strike_curr, C_P: '.' },
                     { year: contract.next.year,  month: contract.next.month,  strike: strike_next, C_P: '.' }];

    var curr_C_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C";
    var curr_P_str = '-' + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P";
    var next_C_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C";
    var next_P_str = '-' + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P";
    
    if (date1st  <=  date) { // if current Date >= 第一交易日
      var data_1st = get_hsio_json(date1st, contracts);
      if(get_hsio_json){
        var hsio_date1st_curr_C = {   hsio: data_1st[ date1st + curr_C_str ],   node: date1st + curr_C_str } // I: 1st交易日 即月 Call  date1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C"
        var hsio_date1st_curr_P = {   hsio: data_1st[ date1st + curr_P_str ],   node: date1st + curr_P_str } // K: 1st交易日 即月 Put   date1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P"
        var hsio_date1st_next_C = {   hsio: data_1st[ date1st + next_C_str ],   node: date1st + next_C_str } // M: 1st交易日 下月 Call  date1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
        var hsio_date1st_next_P = {   hsio: data_1st[ date1st + next_P_str ],   node: date1st + next_P_str } // O: 1st交易日 下月 Put   date1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"      
        date1st + " "+  getDateNowStr() ;
      }
    }
    

    if (date1st < date ) { // if 第一交易日 < current Date
      var ongoingDate;
      if(date < dateEnd){ ongoingDate = date; } // if 第一交易日 < current Date < 結算日 
      else{               ongoingDate = dateEnd; }     // if  結算日 <= current Date
      
      var hsif_ongoingDate    = HSIF.getDate(ongoingDate);

      var data_ongoingDate = get_hsio_json(ongoingDate, contracts);
      if(data_ongoingDate){
         var hsio_ongoingDate_curr_C = { hsio: data_ongoingDate[ ongoingDate + curr_C_str ], note: ongoingDate + curr_C_str } /* J "結算日 即月 Call"               */
         var hsio_ongoingDate_curr_P = { hsio: data_ongoingDate[ ongoingDate + curr_P_str ], note: ongoingDate + curr_P_str } /* L "結算日 即月 Put"                */
         var hsio_ongoingDate_next_C = { hsio: data_ongoingDate[ ongoingDate + next_C_str ], note: ongoingDate + next_C_str } // N: 結算日    下月 Call  date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
         var hsio_ongoingDate_next_P = { hsio: data_ongoingDate[ ongoingDate + next_P_str ], note: ongoingDate + next_P_str } // P: 結算日    下月 Put   date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"
         ongoingDate + " "+ getDateNowStr() ;
        
        
        // setFormulas_3001_beforeEndDay(sheet, row, ongoingDate);
      }
    }

    returnObj["date"] = date;
    returnObj["contractMonth"] = contractMonth;
    returnObj["date1st"] = date1st;
    returnObj["dateEnd"] = dateEnd;

    returnObj["hsif_date1st"] = hsif_date1st;
    returnObj["hsif_ongoingDate"] = hsif_ongoingDate;

    returnObj["hsio_date1st_curr_C"] = hsio_date1st_curr_C;
    returnObj["hsio_date1st_curr_P"] = hsio_date1st_curr_P;
    returnObj["hsio_date1st_next_C"] = hsio_date1st_next_C;
    returnObj["hsio_date1st_next_P"] = hsio_date1st_next_P;
    returnObj["hsio_ongoingDate_curr_C"] = hsio_ongoingDate_curr_C;
    returnObj["hsio_ongoingDate_curr_P"] = hsio_ongoingDate_curr_P;
    returnObj["hsio_ongoingDate_next_C"] = hsio_ongoingDate_next_C;
    returnObj["hsio_ongoingDate_next_P"] = hsio_ongoingDate_next_P;
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return returnObj;
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
