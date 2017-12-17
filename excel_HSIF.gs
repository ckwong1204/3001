function run(){
  HSIF.addExcel_trigger('171213');
}

var HSIF = {
  sheet: SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('HSIF'),
  
  addExcel_trigger: function(date) {
    var sheet = this.sheet;
//    var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('HSIF');
    var newRow = sheet.getLastRow() + 1;
    var rangeList = sheet.getRange("C"+newRow+":O"+newRow);
    var valuesList = [];
    
    var json = get_hsif_json(date);
    
    valuesList[0]  = date;								// C	Date
    valuesList[1]  = json[0].day_Open_Price;			// D	Open
    valuesList[2]  = json[0].day_Daily_High;			// E	High
    valuesList[3]  = json[0].day_Daily_Low;				// F	Low
    valuesList[4]  = json[0].day_Settlement_Price;		// G	Close
    valuesList[5]  = json[0].combined_Open_Interest;	// H	Gross O.I
    valuesList[6]  = json[0].day_Volume;				// I	Volumn
    valuesList[7]  = json[1].day_Open_Price;			// J	Open
    valuesList[8]  = json[1].day_Daily_High;			// K	High
    valuesList[9]  = json[1].day_Daily_Low;				// L	Low
    valuesList[10] = json[1].day_Settlement_Price;		// M	Close
    valuesList[11] = json[1].combined_Open_Interest;	// N	Gross O.I
    valuesList[12] = json[1].day_Volume;				// O	Volumn
    
    rangeList.setValues([valuesList]);
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


**/