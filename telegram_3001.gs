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
    var date_1st = findContractMonthInfoByDate(date_end).date1st;

    
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
