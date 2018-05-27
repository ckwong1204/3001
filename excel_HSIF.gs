function HSIF_test_addExcel_trigger(){   HSIF.addExcel_trigger('180525'); }
function HSIF_test_addExcel(){           HSIF.addExcel('180525'); }
function HSIF_getRange_json_test(){      HSIF.getRange_json('171229', '180112'); }
function HSIF_getDate_test(){            HSIF.getHSIF(); }
function HSIF_getHSIF() { return HSIF.getHSIF()}
var HSIF = {
  cacheHSIF: null,
  getHSIF: function(){
    if(!this.cacheHSIF){
      var sheet = getSheetByName('HSIF');
      var result = {};
      sheet.getDataRange().getValues().forEach(function(v){
        if( v[0] != "" ||  v[0] != "Date")
          result[v[0]] = {date:v[0],
                         curr:{ contract_Month: v[1],
                               day_Open_Price: v[2], 
                               day_Daily_High: v[3], 
                               day_Daily_Low: v[4], 
                               day_Settlement_Price: v[5], 
                               combined_Open_Interest: v[6], 
                               day_Volume: v[7]              },
                         next:{  contract_Month: v[8],
                               day_Open_Price: v[9], 
                               day_Daily_High: v[10], 
                               day_Daily_Low: v[11], 
                               day_Settlement_Price: v[12], 
                               combined_Open_Interest: v[13], 
                               day_Volume: v[14]             },
                         next2:{ contract_Month: v[15],
                                day_Open_Price: v[16], 
                                day_Daily_High: v[17], 
                                day_Daily_Low: v[18], 
                                day_Settlement_Price: v[19], 
                                combined_Open_Interest: v[20], 
                                day_Volume: v[21]              },
                         next3:{ contract_Month: v[22],
                                day_Open_Price: v[23], 
                                day_Daily_High: v[24], 
                                day_Daily_Low: v[25], 
                                day_Settlement_Price: v[26], 
                                combined_Open_Interest: v[27], 
                                day_Volume: v[28]              }
                        };
      })
      this.cacheHSIF = result;
    }
    return this.cacheHSIF;
  },
  
  getRange_json: function (dateFrom, dateEnd) {
  	var sheet = getSheetByName('HSIF');
    var values = sheet.getDataRange().getValues();

    console.log(range)
  },
  getDate: function (date) {
  	return this.cacheHSIF[date];
  },

  addExcel_trigger: function(date) {
    return HSIF.addExcel(date);
  },
  addExcel: function(date) {
    if(date == null || date == "") date = getLastTransactionDate();    
    var json = get_hsif_json(date);
    
    if(json != null){
      getSheetByName('HSIF').appendRow([
        date,							// C	Date
        
        json[0].Contract_Month,         // C. Month
        json[0].day_Open_Price,			    // Open
        json[0].day_Daily_High,			    // High
        json[0].day_Daily_Low,			    // Low
        json[0].day_Settlement_Price,	  // Close
        json[0].combined_Open_Interest, // Gross O.I.
        json[0].day_Volume,				      // Volumn
        
        json[1].Contract_Month,
        json[1].day_Open_Price,			
        json[1].day_Daily_High,			
        json[1].day_Daily_Low,			
        json[1].day_Settlement_Price,	
        json[1].combined_Open_Interest,	
        json[1].day_Volume,				
        
        json[2].Contract_Month,
        json[2].day_Open_Price,			
        json[2].day_Daily_High,			
        json[2].day_Daily_Low,			
        json[2].day_Settlement_Price,	
        json[2].combined_Open_Interest,	
        json[2].day_Volume,				
        
        json[3].Contract_Month,
        json[3].day_Open_Price,			
        json[3].day_Daily_High,			
        json[3].day_Daily_Low,			
        json[3].day_Settlement_Price,	
        json[3].combined_Open_Interest,	
        json[3].day_Volume
      ]);
      
      return json[0].Contract_Month;
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




function findHSIF_row_ByDate(date)
{
	//  var searchString = "180112";
	var searchString = date;
	var sheet = getSheetByName("HSIF"); 
	var column =1; //column Index   
	var columnValues = sheet.getRange(2, column, sheet.getLastRow()).getValues(); //1st is header row
	var searchResult = columnValues.findListListIndex(searchString) + 2; //Row Index - 2

	//return searchResult;

	if(searchResult != -1){
      //searchResult + 2 is row index.
      //setActiveRange(sheet.getRange(searchResult, 1))
	}
}

Array.prototype.findListListIndex = function(search){
  if(search == "") return false;
  for (var i=0; i<this.length; i++)
    if (this[i][0] == search) return i;

  return -1;
} 