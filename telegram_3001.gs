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
        var hsio_date1st_curr_C = {   value: data_1st[ date1st + curr_C_str ], date: date1st, note: curr_C_str } // I: 1st交易日 即月 Call  date1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "C"
        var hsio_date1st_curr_P = {   value: data_1st[ date1st + curr_P_str ], date: date1st, note: curr_P_str } // K: 1st交易日 即月 Put   date1st + CommonData.Month[contract.curr.month] + "-" + contract.curr.year + "-" + strike_curr + "-" + "P"
        var hsio_date1st_next_C = {   value: data_1st[ date1st + next_C_str ], date: date1st, note: next_C_str } // M: 1st交易日 下月 Call  date1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
        var hsio_date1st_next_P = {   value: data_1st[ date1st + next_P_str ], date: date1st, note: next_P_str } // O: 1st交易日 下月 Put   date1st + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"      
        date1st + " "+  getDateNowStr() ;
      }
    }
    

    if (date1st < date ) { // if 第一交易日 < current Date
      var dateMov;
      if(date < dateEnd){ dateMov = date; } // if 第一交易日 < current Date < 結算日 
      else{               dateMov = dateEnd; }     // if  結算日 <= current Date
      
      var hsif_dateMov    = HSIF.getDate(dateMov);

      var data_dateMov = get_hsio_json(dateMov, contracts);
      if(data_dateMov){
         var hsio_dateMov_curr_C = { value: data_dateMov[ dateMov + curr_C_str ], date: dateMov, note: curr_C_str } /* J "結算日 即月 Call"               */
         var hsio_dateMov_curr_P = { value: data_dateMov[ dateMov + curr_P_str ], date: dateMov, note: curr_P_str } /* L "結算日 即月 Put"                */
         var hsio_dateMov_next_C = { value: data_dateMov[ dateMov + next_C_str ], date: dateMov, note: next_C_str } // N: 結算日    下月 Call  date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "C"
         var hsio_dateMov_next_P = { value: data_dateMov[ dateMov + next_P_str ], date: dateMov, note: next_P_str } // P: 結算日    下月 Put   date_end   + CommonData.Month[contract.next.month] + "-" + contract.next.year + "-" + strike_next + "-" + "P"
         dateMov + " "+ getDateNowStr() ;
        
        
        // setFormulas_3001_beforeEndDay(sheet, row, dateMov);
      }
    }

    returnObj["date"] = date;
    returnObj["contractMonth"] = contractMonth;
    returnObj["date1st"] = date1st;
    returnObj["dateEnd"] = dateEnd;

    returnObj["hsif_date1st"] = hsif_date1st;
    returnObj["hsif_dateMov"] = hsif_dateMov;
    
    returnObj["strike_curr"] = strike_curr;
    returnObj["strike_next"] = strike_next;

    returnObj["hsio_date1st_curr_C"] = hsio_date1st_curr_C;
    returnObj["hsio_date1st_curr_P"] = hsio_date1st_curr_P;
    returnObj["hsio_date1st_next_C"] = hsio_date1st_next_C;
    returnObj["hsio_date1st_next_P"] = hsio_date1st_next_P;
    returnObj["hsio_dateMov_curr_C"] = hsio_dateMov_curr_C;
    returnObj["hsio_dateMov_curr_P"] = hsio_dateMov_curr_P;
    returnObj["hsio_dateMov_next_C"] = hsio_dateMov_next_C;
    returnObj["hsio_dateMov_next_P"] = hsio_dateMov_next_P;
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return returnObj;
}

function getModel3001(){
  var m3001 = getModel3001Base();
  
  var date = m3001.date;
  var contractMonth = m3001.contractMonth;
  var date1st = m3001.date1st;  /* B "1st交易日"                      */
  var dateEnd = m3001.dateEnd;  /* C "結算日 d/m/Y"                   */
  
  var hsif_date1st_curr_close = parseInt(m3001.hsif_date1st.curr.day_Settlement_Price) || 0 ; /* E "1st交易日 即月 HSIF:"            */
  var hsif_date1st_next_close = parseInt(m3001.hsif_date1st.next.day_Settlement_Price) || 0 ; /* F "1st交易日 下月 HSIF:"            */
  var hsif_dateMov_curr_close = parseInt(m3001.hsif_dateMov.curr.day_Settlement_Price) || 0 ;
  var hsif_dateMov_next_close = parseInt(m3001.hsif_dateMov.next.day_Settlement_Price) || 0 ;
  
  var strike_curr = m3001.strike_curr;   // G: 即月 行使價
  var strike_next = m3001.strike_next;   // H: 下月 行使價

  var hsio_date1st_curr_C_Close = parseInt(m3001.hsio_date1st_curr_C.value.OQP_CLOSE) || 0 ; /* I "1st交易日 即月 Call"             */
  var hsio_date1st_curr_P_Close = parseInt(m3001.hsio_date1st_curr_P.value.OQP_CLOSE) || 0 ; /* K "1st交易日 即月 Put"              */
  var hsio_date1st_next_C_Close = parseInt(m3001.hsio_date1st_next_C.value.OQP_CLOSE) || 0 ; /* M "1st交易日 下月 Call"             */
  var hsio_date1st_next_P_Close = parseInt(m3001.hsio_date1st_next_P.value.OQP_CLOSE) || 0 ; /* O "1st交易日 下月 Put"              */
  var hsio_dateMov_curr_C_Close = parseInt(m3001.hsio_dateMov_curr_C.value.OQP_CLOSE) || 0 ; /* J "結算日 即月 Call"                */
  var hsio_dateMov_curr_P_Close = parseInt(m3001.hsio_dateMov_curr_P.value.OQP_CLOSE) || 0 ; /* L "結算日 即月 Put"                 */
  var hsio_dateMov_next_C_Close = parseInt(m3001.hsio_dateMov_next_C.value.OQP_CLOSE) || 0 ; /* N "結算日 下月 Call"                */
  var hsio_dateMov_next_P_Close = parseInt(m3001.hsio_dateMov_next_P.value.OQP_CLOSE) || 0 ; /* P "結算日 下月 Put"                 */
  
  
  m3001["VI"] = { /* D "IV spread"                     */
    value:   (hsio_date1st_next_C_Close + hsio_date1st_next_P_Close - Math.abs(hsif_date1st_next_close - strike_next))
           - (hsio_date1st_curr_C_Close + hsio_date1st_curr_P_Close - Math.abs(hsif_date1st_curr_close - strike_curr)),
    node: hsio_date1st_next_C_Close + "+" + hsio_date1st_next_P_Close + "-ABS("+ hsif_date1st_next_close +"-"+ strike_next +")-(" +
          hsio_date1st_curr_C_Close + "+" + hsio_date1st_curr_P_Close + "-ABS("+ hsif_date1st_curr_close +"-"+ strike_curr + "))"
  };

  // hsio long current month Call+Put Profile & Lost
  var hsio_L_curr_CP_pl = { value:    hsio_dateMov_curr_P_Close + hsio_dateMov_curr_C_Close - hsio_date1st_curr_P_Close - hsio_date1st_curr_C_Close,
                            note:  ""+hsio_dateMov_curr_P_Close +"+"+ hsio_dateMov_curr_C_Close +"-"+ hsio_date1st_curr_P_Close +"-"+ hsio_date1st_curr_C_Close };
  // hsio long next    month Call+Put Profile & Lost
  var hsio_L_next_CP_pl = { value:    hsio_dateMov_next_C_Close + hsio_dateMov_next_P_Close - hsio_date1st_next_P_Close - hsio_date1st_next_C_Close,
                            note:  ""+hsio_dateMov_next_C_Close +"+"+ hsio_dateMov_next_P_Close +"-"+ hsio_date1st_next_P_Close +"-"+ hsio_date1st_next_C_Close };

  m3001["model"] ={};
  m3001["model"]["A"] ={// /* T "A:L即ATM both S下ATM both x2"   */   
    value: ( hsio_L_curr_CP_pl.value - hsio_L_next_CP_pl.value * 2  ),
    note:  hsio_L_curr_CP_pl.note + "-("+ hsio_L_next_CP_pl.note +") *2"
  };
  m3001["model"]["B"] ={// /* U "B:S即ATM both L下ATM both x2"   */   
    value: ( - hsio_L_curr_CP_pl.value + hsio_L_next_CP_pl.value * 2  ),
    note:  "-("+ hsio_L_curr_CP_pl.note + ")+("+ hsio_L_next_CP_pl.note +") *2"
  };
  m3001["model"]["C"] ={// /* V "C:S即ATM both L下ATM both "*/  
    value: ( - hsio_L_curr_CP_pl.value + hsio_L_next_CP_pl.value   ),
    note:  "-("+ hsio_L_curr_CP_pl.note + ")+("+ hsio_L_next_CP_pl.note +") "
  };

  m3001["summary"] = 
  "" + m3001.date + " 3001 Profit n Loss: " +"\n"
  +"A: " + m3001.model.A.value +"\n"
  +"B: " + m3001.model.B.value +"\n"
  +"C: " + m3001.model.C.value +"\n"
  +"Model VI: " + m3001.VI.value + "\n"
  +"\n"
  +changeStr("date", date1st,  date)
  +changeStr("HSIF", hsif_date1st_curr_close,  hsif_dateMov_curr_close)
  +changeStr(m3001.hsio_date1st_curr_C.note, m3001.hsio_date1st_curr_C.value.OQP_CLOSE,  m3001.hsio_dateMov_curr_C.value.OQP_CLOSE)
  +changeStr(m3001.hsio_date1st_curr_P.note, m3001.hsio_date1st_curr_P.value.OQP_CLOSE,  m3001.hsio_dateMov_curr_P.value.OQP_CLOSE)
  +changeStr(m3001.hsio_date1st_next_C.note, m3001.hsio_date1st_next_C.value.OQP_CLOSE,  m3001.hsio_dateMov_next_C.value.OQP_CLOSE)
  +changeStr(m3001.hsio_date1st_next_P.note, m3001.hsio_date1st_next_P.value.OQP_CLOSE,  m3001.hsio_dateMov_next_P.value.OQP_CLOSE)

  ;

  return m3001;
}

function changeStr(description, oldValue, newValue){
  return "" + description +": "+ oldValue +" -> "+ newValue + "\n";
}

function dailyTelegramUpdate(){
  var m3001 = getModel3001();
  textTelegramText(m3001.summary);

}

// /* A Contract Month                  */   [ 0] 
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
// /* S "IV B:<400 A:400-580 C:>580"     */   [18] =IF(D_<400, "B", IF(D_>580, "C", "A") )
// /* T "A:L即ATM both S下ATM both x2"   */   [19] =IF(S_="A", (J_-I_ + L_-K_ ) + (M_-N_ + O_-P_)*2," ")
// /* U "B:S即ATM both L下ATM both x2"   */   [20] =IF(S_="B", - (J_-I_ + L_-K_ ) - (M_-N_ + O_-P_)*2," ")
// /* V "C:S即ATM both x2 L下ATM both x2"*/   [21] =IF(S_="C", - (J_-I_ + L_-K_ ) - (M_-N_ + O_-P_)," ")
