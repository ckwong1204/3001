function updateSheet3001Row_test(){
  updateSheet3001Row(84);
}

function formular_test(){
  row = 106;
  var sheet = getSheetByName('3001');
  setFormulas_3001_endDay(sheet, row);
}

function DailyMartketReport_triger_test(){
  //  updateSheet3001Row(80);
  DailyMartketReport_triger('180523');
}
function updateSheet3001Row_today_test(date){ updateSheet3001Row_today('171124'); }
// test ------------------------------------------------------------------

// update the data in row 2 for today's record
function updateSheet3001Row_today(date){
  updateSheet3001Row(2, date);
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
      var date1st = valuesList[i][0]; /* B "1st交易日"                      */  
      var dateEnd = valuesList[i][1]; /* C "結算日 d/m/Y"                   */
      if(date1st == ""){
        target_row += i;
        break;
      }
      if(date1st <= date && date  <= dateEnd){ 
        target_row += i;
        break;
      }
    }
    updateSheet3001Row(target_row, date);
    
    // update row 2 for today's record, will send extra email
    updateSheet3001Row_today(date);
    
    var range = sheet.getRange('A' +target_row +':AA'+ target_row); range.setValues( range.getValues() );
    range = sheet.getRange('A2:AA2');                               range.setValues( range.getValues() );
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}

/**
 * get updateSheet3001Row
 *
 * @param {26001} excel_row
 * @return {26000} closest
 *
 * @customfunction
 */
function updateSheet3001Row ( row, date){
  try{
    Logger.log("\n\n trigered updateSheet3001Row("+row + " "+date+ ") ------------------------------------\n" );
    var sheet = getSheetByName('3001');
    var rangeList = sheet.getRange('A'+row+':H'+row);
    var valueList = rangeList.getValues()[0];    
  
    var m3001 = getModel3001(date);

    var dateMov = m3001.date;     
    var contractMonth = m3001.contractMonth; /* A Contract Month                  */
    var date1st = m3001.date1st;  /* B "1st交易日"                      */
    var dateEnd = m3001.dateEnd;  /* C "結算日 d/m/Y"                   */
    
    var hsif_date1st_curr_close = parseInt(m3001.hsif_date1st.curr.day_Settlement_Price); /* E "1st交易日 即月 HSIF:"            */
    var hsif_date1st_next_close = parseInt(m3001.hsif_date1st.next.day_Settlement_Price); /* F "1st交易日 下月 HSIF:"            */
    var hsif_dateMov_curr_close = parseInt(m3001.hsif_dateMov.curr.day_Settlement_Price); /* Q "結算日 即月 HSIF"                */
    var hsif_dateMov_next_close = parseInt(m3001.hsif_dateMov.next.day_Settlement_Price); /* R "結算日 下月 HSIF"                */
    
    var strike_curr = m3001.strike_curr;   // G: 即月 行使價
    var strike_next = m3001.strike_next;   // H: 下月 行使價

    var hsio_date1st_curr_C_Close = parseInt(m3001.hsio_date1st_curr_C.value.OQP_CLOSE); /* I "1st交易日 即月 Call"             */
    var hsio_date1st_curr_P_Close = parseInt(m3001.hsio_date1st_curr_P.value.OQP_CLOSE); /* K "1st交易日 即月 Put"              */
    var hsio_date1st_next_C_Close = parseInt(m3001.hsio_date1st_next_C.value.OQP_CLOSE); /* M "1st交易日 下月 Call"             */
    var hsio_date1st_next_P_Close = parseInt(m3001.hsio_date1st_next_P.value.OQP_CLOSE); /* O "1st交易日 下月 Put"              */
    var hsio_dateMov_curr_C_Close = parseInt(m3001.hsio_dateMov_curr_C.value.OQP_CLOSE); /* J "結算日 即月 Call"                */
    var hsio_dateMov_curr_P_Close = parseInt(m3001.hsio_dateMov_curr_P.value.OQP_CLOSE); /* L "結算日 即月 Put"                 */
    var hsio_dateMov_next_C_Close = parseInt(m3001.hsio_dateMov_next_C.value.OQP_CLOSE); /* N "結算日 下月 Call"                */
    var hsio_dateMov_next_P_Close = parseInt(m3001.hsio_dateMov_next_P.value.OQP_CLOSE); /* P "結算日 下月 Put"                 */
    
    var vi3001 = parseInt(m3001.VI); /* D "IV spread"                  */
    var modelAProfit = parseInt(m3001.model.A.value);
    var modelBProfit = parseInt(m3001.model.B.value);
    var modelCProfit = parseInt(m3001.model.C.value);

    var vi30012 = parseInt(m3001.VI2);
    var modelD = m3001.D;

    sheet.getRange('A'+row).setValue(contractMonth); /* A Contract Month   */
    sheet.getRange('B'+row).setValue(date1st); /* B "1st交易日"      */
    sheet.getRange('C'+row).setValue(dateEnd); /* C                 */ 
    
    sheet.getRange('D'+row).setValue(vi3001);/* D "IV spread"                  */  
    sheet.getRange('E'+row).setValue(hsif_date1st_curr_close);/* E "1st交易日 即月 HSIF:"       */
    sheet.getRange('F'+row).setValue(hsif_date1st_next_close);/* F "1st交易日 下月 HSIF:"       */
    sheet.getRange('G'+row).setValue(strike_curr);/* G "即月ATM 行使價:"            */
    sheet.getRange('H'+row).setValue(strike_next);/* H "下月ATM 行使價:"            */

    sheet.getRange('I'+row).setValue( hsio_date1st_curr_C_Close ).setNote( ""+ m3001.hsio_date1st_curr_C.date + m3001.hsio_date1st_curr_C.note ); // I  1st交易日 即月 Call
    sheet.getRange('K'+row).setValue( hsio_date1st_curr_P_Close ).setNote( ""+ m3001.hsio_date1st_curr_P.date + m3001.hsio_date1st_curr_P.note ); // K  1st交易日 即月 Put
    sheet.getRange('M'+row).setValue( hsio_date1st_next_C_Close ).setNote( ""+ m3001.hsio_date1st_next_C.date + m3001.hsio_date1st_next_C.note ); // M  1st交易日 下月 Call
    sheet.getRange('O'+row).setValue( hsio_date1st_next_P_Close ).setNote( ""+ m3001.hsio_date1st_next_P.date + m3001.hsio_date1st_next_P.note ); // O  1st交易日 下月 Put
    sheet.getRange('J'+row).setValue( hsio_dateMov_curr_C_Close ).setNote( ""+ m3001.hsio_dateMov_curr_C.date + m3001.hsio_dateMov_curr_C.note ); // J  結算日 即月 Call
    sheet.getRange('L'+row).setValue( hsio_dateMov_curr_P_Close ).setNote( ""+ m3001.hsio_dateMov_curr_P.date + m3001.hsio_dateMov_curr_P.note ); // L  結算日 即月 Put
    sheet.getRange('N'+row).setValue( hsio_dateMov_next_C_Close ).setNote( ""+ m3001.hsio_dateMov_next_C.date + m3001.hsio_dateMov_next_C.note ); // N: 結算日 下月 Call  
    sheet.getRange('P'+row).setValue( hsio_dateMov_next_P_Close ).setNote( ""+ m3001.hsio_dateMov_next_P.date + m3001.hsio_dateMov_next_P.note ); // P: 結算日 下月 Put   

    sheet.getRange('Q'+row).setValue(hsif_dateMov_curr_close);/* Q "結算日 即月 HSIF"       */
    sheet.getRange('R'+row).setValue(hsif_dateMov_next_close);/* R "結算日 下月 HSIF"       */    
    
    sheet.getRange('S'+row).setValue( hsio_date1st_curr_C_Close ); /* S "IV B:<400 A:400-580 C:>580"      */ 
    sheet.getRange('T'+row).setValue( m3001.model.A.value ).setNote(m3001.model.A.note) ; /* T "A:L即ATM both S下ATM both x2"   */
    sheet.getRange('U'+row).setValue( m3001.model.B.value ).setNote(m3001.model.B.note) ; /* U "B:S即ATM both L下ATM both x2"   */
    sheet.getRange('V'+row).setValue( m3001.model.C.value ).setNote(m3001.model.C.note) ; /* V "C:S即ATM both x2 L下ATM both x2"*/

    sheet.getRange('W'+row).setValue( dateMov + " "+ getDateNowStr() );
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
}

function setFormulas_3001_1stDay(sheet, row, dataDate){
  if(row ==2){
    /* B "1st交易日"      */ sheet.getRange('B'+row).setValue(dataDate);
    /* C                 */ sheet.getRange('C'+row).setValue(dataDate);
  }
  else{
    //set 1st交易日 by 結算日
    var date_Last = sheet.getRange('C'+row).getValue();
    var date1st = findContractMonthInfoByDate(date_Last).date1st;
    /* B "1st交易日"      */ sheet.getRange('B'+row).setValue( date1st );
    
    dataDate = date1st;
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