function getCommonData(){
  returnData = CommonData;
  returnData["DateList"] = getDateList()
  return returnData;
}
function getDateList(){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
  var rangeList = sheet.getRange('C8:C');
  var list_str = rangeList.getValues().filter(function (val) {if(val != ""){return val;}}).join();
  var list = list_str.split(',')
  return list;
}

var CommonData = {
  Month: {
    "01": "JAN",  "JAN":"01",   1: "JAN",
    "02": "FEB",  "FEB":"02",   2: "FEB",
    "03": "MAR",  "MAR":"03",   3: "Mar",
    "04": "APR",  "APR":"04",   4: "APR",
    "05": "MAY",  "MAY":"05",   5: "MAY",
    "06": "JUN",  "JUN":"06",   6: "JUN",
    "07": "JUL",  "JUL":"07",   7: "JUL",
    "08": "AUG",  "AUG":"08",   8: "AUG",
    "09": "SEP",  "SEP":"09",   9: "SEP",
    "10": "OCT",  "OCT":"10",  10: "OCT",
    "11": "NOV",  "NOV":"11",  11: "NOV",
    "12": "DEC",  "DEC":"12",  12: "DEC",
    "": "..."
   },
  StrikePrice:
  [8000,8200,8400,8600,8800,9000,9200,9400,9600,9800,10000,10200,10400,10600,10800,11000,
   11200,11400,11600,11800,12000,12200,12400,12600,12800,13000,13200,13400,13600,13800,14000,
   14200,14400,14600,14800,15000,15200,15400,15600,15800,16000,16200,16400,16600,16800,17000,
   17200,17400,17600,17800,18000,18200,18400,18600,18800,19000,19200,19400,19600,19800,20000,
   20200,20400,20600,20800,21000,21200,21400,21600,21800,22000,22200,22400,22600,22800,23000,
   23200,23400,23600,23800,24000,24200,24400,24600,24800,25000,25200,25400,25600,25800,26000,
   26200,26400,26600,26800,27000,27200,27400,27600,27800,28000,28200,28400,28600,28800,29000,
   29200,29400,29600,29800,30000,30200,30400,30600,30800,31000,31200,31400,31600,31800,32000,
   32200,32400,32600,32800,33000,33200,33400,33600,33800,34000,34200,34400,34600,34800,35000,
   35200,35400,35600,35800,36000,36200,36400,36600,36800,37000,37200,37400,37600,37800,38000,
   38200,38400,38600,38800,39000,39200,39400,39600,39800,40000,40200,40400,40600,40800,41000,
   41200,41400,41600,41800,42000,42200],
   
  // "MHI", "HHI", "MCH", "CUS", 
  stockList:
  ["HSI",
   "CKH-00001", "CLP-00002", "HKG-00003", "WHL-00004", "HKB-00005", 
   "HEH-00006", "HSB-00011", "HLD-00012", "SHK-00016", "NWD-00017", 
   "SWA-00019", "BEA-00023", "GLX-00027", "MTR-00066", "KLE-00135", 
   "WWC-00151", "GAH-00175", "CIT-00267", "CPA-00293", "JXC-00358", 
   "CPC-00386", "HEX-00388", "CRG-00390", "DFM-00489", "LIF-00494", 
   "COL-00688", "TCH-00700", "CTC-00728", "CHU-00762", "LNK-00823", 
   "PEC-00857", "CNC-00883", "HNP-00902", "ACC-00914", "XCC-00939", 
   "CHT-00941", "LEN-00992", "CTB-00998", "HGN-01044", "CSE-01088", 
   "CRL-01109", "CKP-01113", "YZC-01171", "CRC-01186", "BYD-01211", 
   "XAB-01288", "AIA-01299", "NCL-01336", "PIN-01339", "CDA-01359", 
   "XIC-01398", "CCC-01800", "CGN-01816", "BIH-01880", "CCE-01898", 
   "CCS-01919", "SAN-01928", "MSB-01988", "AAC-02018", "FIH-02038", 
   "MGM-02282", "PAI-02318", "MEN-02319", "PIC-02328", "GWM-02333", 
   "BOC-02388", "ALC-02600", "CPI-02601", "CLI-02628", "RFP-02777", 
   "TRF-02800", "CSA-02822", "A50-02823", "HCF-02828", "STC-02888", 
   "ZJM-02899", "AMC-03188", "NBM-03323", "BCM-03328", "PLE-03800", 
   "KSO-03888", "CMB-03968", "XBC-03988", "CTS-06030", "HAI-06837", 
   "HKE-30003", "HLB-30012", "ESP-00330", "CS3-02827", "FIA-12038", 
   "MTA-10066", "CSB-11088", "HEC-30006", "HED-10006", "CHB-10941"],
  
  stockstrikes:{
    "A50-02823": 
    ["7.25", "7.50", "7.75", "8.00", "8.25", "8.50", "8.75", "9.00", "9.25", "9.50", "9.75", 
     "10.00", "10.50", "11.00", "11.50", "12.00", "12.50", "13.00", "13.50", "14.00", "14.50", 
     "15.00", "15.50", "16.00", "16.50", "17.00", "17.50", "18.00", "18.50", "19.00", "19.50", "20.00"]
    
    
  }
  
}

function updateDateList(){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
  var rangeList = sheet.getRange('C1');
  var list_str = rangeList.getValue();
  var list = list_str.split(',')
  list.forEach(function(i){
    addDateList(i)
  })
}
//triggered daily
function addDateList_test(){ addDateList ("171129")}
function addDateList(date){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
  
  var target_row = findTargetRow(date, sheet);
  
  var rangeList = sheet.getRange('C' + target_row);
  var list_str = rangeList.getValue();
  list_str += "" + ( list_str == "" ? "":",") + date;
  rangeList.setValue(list_str);
  
  //update  "Last Transaction Date"
  sheet.getRange('D2').setValue(date);
  
  return true;
}
function getLastTransactionDate(){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
  return sheet.getRange('D2').getValue();
}
function findTargetRow(date, sheet){
  try{
    if(sheet == null){
      sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
    }
    var sheet_serch_row_base = 2;
    var rangeList = sheet.getRange('A'+sheet_serch_row_base+':B');
    var valuesList = rangeList.getValues();
    
    var target_row = sheet_serch_row_base;
    //  valuesList.forEach(function(item){
    for (var i = 1; i < valuesList.length; i++) {
      var last_contract_date_end = valuesList[i-1][1]; /* B "結算日 d/m/Y"                   */
      var curr_contract_date_end = valuesList[i][1];   /* B "結算日 d/m/Y"                   */
      if (curr_contract_date_end == "") {
        target_row += i;
        break;
      }
      if(last_contract_date_end < date && date  <= curr_contract_date_end){ 
        target_row += i;
        break;
      }
    }
    return target_row;
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}
function getContractYearMonth_test(date){  
  var a = getContractYearMonth('170101')  
  Logger.log(a);
}
function getContractYearMonths(date){
  var sheet = SpreadsheetApp.openById('1urOweWT8JMU2JWJy2gHCvXt-vGHkb5LSS16nWG79FEc').getSheetByName('date');
  var target_row = findTargetRow(date, sheet);
  var rangeList = sheet.getRange('A' + target_row + ':A'+ (target_row +2) );
  var list_str = rangeList.getValues(); //[["2017-11"], ["2017-12"], ["2018-01"]]
  
  var str_curr  = list_str[0][0];
  var str_next  = list_str[1][0];
  var str_next2 = list_str[2][0];
  
  var contracts = {
    curr:  { year: str_curr.substr(2,2),  month: str_curr.substr(5,2)  },
    next:  { year: str_next.substr(2,2),  month: str_next.substr(5,2)  },
    next2: { year: str_next2.substr(2,2), month: str_next2.substr(5,2) }
  };
  
  return contracts;
}

