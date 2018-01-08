function HSIF_test_addExcel_trigger(){
  HSIF.addExcel_trigger('171229');
}
function HSIF_test_addExcel(){
  HSIF.addExcel(2706);
}

var HSIF = {
  addExcel_trigger: function(date) {
    var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('HSIF');
    HSIF.addExcel(null, date);
  },
  addExcel: function(row, date) {
    var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('HSIF');
    if(row == null) {
      row = sheet.getLastRow() + 1; //new Row
    }else{
      date = sheet.getRange(row,1).getValue(); //A + row
    }
    if(date == null || date == "") 
      date = getLastTransactionDate();
    
    var rangeList = sheet.getRange("A"+row+":AC"+row);
    var valuesList = [];
    
    var json = get_hsif_json(date);
    
    if(json != null){
      valuesList[0]  = date;							// C	Date
      
      valuesList[1 ] = json[0].Contract_Month
      valuesList[2 ] = json[0].day_Open_Price;			// D	Open
      valuesList[3 ] = json[0].day_Daily_High;			// E	High
      valuesList[4 ] = json[0].day_Daily_Low;			// F	Low
      valuesList[5 ] = json[0].day_Settlement_Price;	// G	Close
      valuesList[6 ] = json[0].combined_Open_Interest;	// H	Gross O.I
      valuesList[7 ] = json[0].day_Volume;				// I	Volumn

      valuesList[8 ] = json[1].Contract_Month
      valuesList[9 ] = json[1].day_Open_Price;			// J	Open
      valuesList[10] = json[1].day_Daily_High;			// K	High
      valuesList[11] = json[1].day_Daily_Low;			// L	Low
      valuesList[12] = json[1].day_Settlement_Price;	// M	Close
      valuesList[13] = json[1].combined_Open_Interest;	// N	Gross O.I
      valuesList[14] = json[1].day_Volume;				// O	Volumn

      valuesList[15] = json[2].Contract_Month
      valuesList[16] = json[2].day_Open_Price;			// P	Open
      valuesList[17] = json[2].day_Daily_High;			// Q	High
      valuesList[18] = json[2].day_Daily_Low;			// R	Low
      valuesList[19] = json[2].day_Settlement_Price;	// S	Close
      valuesList[20] = json[2].combined_Open_Interest;	// T	Gross O.I
      valuesList[21] = json[2].day_Volume;				// U	Volumn
      
      valuesList[22] = json[3].Contract_Month
      valuesList[23] = json[3].day_Open_Price;			// V	Open
      valuesList[24] = json[3].day_Daily_High;			// W	High
      valuesList[25] = json[3].day_Daily_Low;			// X	Low
      valuesList[26] = json[3].day_Settlement_Price;	// Y	Close
      valuesList[27] = json[3].combined_Open_Interest;	// Z	Gross O.I
      valuesList[28] = json[3].day_Volume;				// AA	Volumn
      
      
      rangeList.setValues([valuesList]);
      
      sheet.getRange("A"+row).setValue(date);
    }
  }
}



/**

A	
B	
C	Date 			date
D	Open			day_Open_Price
E	High			day_Daily_High
F	Low				day_Daily_Low
G	Close			day_Settlement_Price
H	Gross O.I.		combined_Open_Interest
I	Volumn			day_Volume
J	Open			day_Open_Price
K	High			day_Daily_High
L	Low				day_Daily_Low
M	Close			day_Settlement_Price
N	Gross O.I.		combined_Open_Interest
O	Volumn			day_Volume
P	


date,Contract_Month,night_Open_Price,night_Daily_High,night_Daily_Low,night_Close_Price,night_Volume,day_Open_Price,day_Daily_High,day_Daily_Low,day_Volume,day_Settlement_Price,day_Change_in_Settlement_Price,combined_Contract_High,combined_Contract_Low,combined_Volume,combined_Open_Interest,combined_Change_in_OI
171229,JAN-18,29945,29963,29884,29898,10450,29915,30027,29871,88524,29948,+8,30027,28198,98974,132718,+6794
171229,FEB-18,-,-,-,-,-,29808,29979,29808,273,29909,-,29979,29808,273,-,-
171229,MAR-18,29920,29920,29856,29860,95,29861,29963,29855,445,29910,+10,30505,26649,540,9287,-42
171229,JUN-18,29611,29611,29555,29555,11,29568,29653,29562,930,29594,-9,29855,27790,941,2521,-350

**/