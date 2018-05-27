function getModel3001Base ( date ){
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
    
    returnObj["strike_curr"] = strike_curr;
    returnObj["strike_next"] = strike_next;

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

function getModel3001(){
  var m3001 = getModel3001Base();
  m3001["VI"] = {
    value: 0,
    node: m3001.hsio_ongoingDate_next_C.hsio.OQP_CLOSE + "+"+ m3001.hsio_ongoingDate_next_P.hsio.OQP_CLOSE
    +"-ABS("+ m3001.hsif_ongoingDate.curr.day_Settlement_Price +"-"+  m3001.strike_next +")-("
    +m3001.hsio_date1st_next_C.hsio.OQP_CLOSE + "+"+ m3001.hsio_date1st_next_P.hsio.OQP_CLOSE
    +"-ABS("+ m3001.hsif_date1st.curr.day_Settlement_Price +"-"+  m3001.strike_curr +"))"

  }
  
  return m3001;
}





// /* A                                 */   [ 0] 
// /* B "1st交易日"                      */   [ 1] 180430
// /* C "結算日 d/m/Y"                   */   [ 2] 180530
// /* D "IV spread"                     */   [ 3] =M_+O_-ABS(F_-H_) -(I_+K_-ABS(E_-G_))
// /* E "1st交易日 即月 HSIF:"            */   [ 4] =INT(VLOOKUP("180430",HSIF!$A:$O,6,FALSE))
// /* F "1st交易日 下月 HSIF:"            */   [ 5] =INT(VLOOKUP("180430",HSIF!$A:$O,13,FALSE))
// /* G "即月ATM 行使價:"                 */   [ 6] =INT(getClosestStrikePrice(E_))
// /* H "下月ATM 行使價:"                 */   [ 7] =INT(getClosestStrikePrice(F_))
// /* I "1st交易日 即月 Call"             */   [ 8] 604
// /* J "結算日 即月 Call"                */   [ 9] 205
// /* K "1st交易日 即月 Put"              */   [10] 542
// /* L "結算日 即月 Put"                 */   [11] 157
// /* M "1st交易日 下月 Call"             */   [12] 789
// /* N "結算日 下月 Call"                */   [13] 546
// /* O "1st交易日 下月 Put"              */   [14] 834
// /* P "結算日 下月 Put"                 */   [15] 613
// /* Q "結算日 即月 HSIF"                */   [16] =VLOOKUP("180525",HSIF!$A:$O,6,FALSE)
// /* R "結算日 下月 HSIF"                */   [17] =VLOOKUP("180525",HSIF!$A:$O,13,FALSE)
// /* S "IVB:<400 A:400-580 C:>580"     */   [18] =IF(D_<400, "B", IF(D_>580, "C", "A") )
// /* T "A:L即ATM both S下ATM both x2"   */   [19] =IF(S_="A", (J_-I_ + L_-K_ ) + (M_-N_ + O_-P_)*2," ")
// /* U "B:S即ATM both L下ATM both x2"   */   [20] =IF(S_="B", - (J_-I_ + L_-K_ ) - (M_-N_ + O_-P_)*2," ")
// /* V "C:S即ATM both x2 L下ATM both x2"*/   [21] =IF(S_="C", - (J_-I_ + L_-K_ )*2 - (M_-N_ + O_-P_)*2," ")
