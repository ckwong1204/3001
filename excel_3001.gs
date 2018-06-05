function updateSheet3001Row_test(){
  updateSheet3001Row(84);
}

function DailyMartketReport_triger_test(){
  DailyMartketReport_triger('180523');
}
function updateSheet3001Row_test(date){ updateSheet3001Row(105,'171124'); }
// test ------------------------------------------------------------------


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
    
    var vi3001 = parseInt(m3001.VI.value); /* D "IV spread"                  */
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
    
    sheet.getRange('S'+row).setValue( vi3001<400? "B": (vi3001>580? "C":"A") ); /* S "IV B:<400 A:400-580 C:>580"      */ 
    sheet.getRange('T'+row).setValue( m3001.model.A.value ).setNote(m3001.model.A.note) ; /* T "A:L即ATM both S下ATM both x2"   */
    sheet.getRange('U'+row).setValue( m3001.model.B.value ).setNote(m3001.model.B.note) ; /* U "B:S即ATM both L下ATM both x2"   */
    sheet.getRange('V'+row).setValue( m3001.model.C.value ).setNote(m3001.model.C.note) ; /* V "C:S即ATM both x2 L下ATM both x2"*/

    sheet.getRange('W'+row).setValue( dateMov + " "+ getDateNowStr() );
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
  return "success";
}