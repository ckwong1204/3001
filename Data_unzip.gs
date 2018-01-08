function get_dqe_csv_test() {
  var data = get_dqe_csv("A50", 170915, 17, "" , "14.00", "."); //SEP17,7.25,C,
  Logger.log(data);
}

function get_hsio_csv_test() {
  var data = get_hsio_csv(170915, 17, "" , 26600, "P")
  Logger.log(data);
}

function get_hsio_json_test() {
  var contracts = [
      { year: 17, month: 10, strike: 26600, C_P: "P" },
      { year: 17, month: 9,  strike: 26600, C_P: "P" }
    ];
  var data = get_hsio_json(170915, contracts)
  Logger.log(data);
}
// test ------------------------------------------------------------------

function run_unzip() {
  var context = getfileByName('hsio170908.zip');
  var listheader = context.match(/CONTRACT MONTH.*/i);
  var list = context.match(/SEP-17,26600,C.*/g);

  //merge header and data tgt
  var csvFormat_str = listheader[0].replace(/[^A-Za-z ,]/g, "").replace(/ /g, "_");
  list.forEach(function(item) {
    csvFormat_str += "\n" + item;
  })

  return csvJSON(csvFormat_str);
}

//CLASS(.*\n)+.*CLASS
//^"CONTRACT.*\n.*\n.*YZC.*(\n^(?!\"CLASS).*)+

/**
 * get dqe
 *
 * @param {"A50"} stockCode
 * @param {170908} date
 * @param {17} year
 * @param {1} month
 * @param {"14.00"} strike
 * @param {"C","P"} C_P
 *
 * @customfunction
 */
function get_dqe_csv(stockCode, date, year, month, strike, C_P) {
  var fileName = 'dqe' + date + '.zip';
  var headerRegex = "CONTRACT\",.*";
  ////SEP-17,26600,C.*
//  var dataRegex = "\"CONTRACT.*\\n.*\\n.*"+class+".*(\\n(?!\"CLASS).*)+";
  var dataRegex = CommonData.Month[month] + year + "," + strike + "," + C_P + ',.*';
  var stockCodeRegex = "";
  if (stockCode && stockCode.search( /^\w{3}$/ ) == 0) { stockCodeRegex = ".*CLASS " + stockCode + ".*"; }
  // if (stockCode && stockCode.search( /^\d{4}$/ ) == 0) { stockCodeRegex = ".*(0" + stockCode + ").*"; }

  if(stockCodeRegex){
    return searchFile(fileName, date, headerRegex, dataRegex, stockCodeRegex);
  }
  return "stock in wrong format";
}

/**
 * get HSIO
 *
 * @param {170908} date
 * @param {17} year
 * @param {1} month
 * @param {26000} strike
 * @param {"C","P"} C_P
 *
 * @customfunction
 */
function get_hsio_csv(date, year, month, strike, C_P) {
  var fileName = 'hsio' + date + '.zip';
  var headerRegex = "CONTRACT MONTH.*";
  ////SEP-17,26600,C.*
  var dataRegex = CommonData.Month[month] + "-" + year + "," + strike + "," + C_P + ',.*';

  return searchFile(fileName, date, headerRegex, dataRegex);
}

function get_hsio_json(date, contracts) {
  //contracts: [{year, month, strike, C_P}]
  var fileName = 'hsio' + date + '.zip';
  var headerRegex = "CONTRACT MONTH.*";
  var dataRegex = "";      //(AUG-17,25600,.,.*)|(JUL-17,25600,.,.*)
  contracts.forEach(function(c){
  if (dataRegex != "") { dataRegex+='|'}
    dataRegex += "(" + CommonData.Month[c.month] + "-" + c.year + "," + c.strike + "," + c.C_P + ',.*' + ")";
  })
  var data = searchFile(fileName, date, headerRegex, dataRegex);
  if(data){
    Logger.log("---" + date + JSON.stringify(contracts) +"\n----------" + data + "\n" );
    var dataKey = {};
    csvJSON(data).forEach(function(i){
      key = i.date + "-" + i.CONTRACT_MONTH + "-" + i.STRIKE_PRICE + "-" + i.C_P;
      dataKey[key] = i;
    })
    return dataKey;
  }
  return null;
}

function get_hsif_csv_test() {
 var a = get_hsif_csv('171229');
  Logger.log('171207');
}

/**
 * get HSIF
 */
function get_hsif_csv(date) {
  try {
    var fileName = 'hsif' + date + '.zip';  //// hsif171207.zip
    var headerRegex = "\"Contract Month\",\".*";
    ////DEC-17,.*
    var dataRegex = "\n...\-..\,\[\\d\-\].*";
    
    var csv = searchFile(fileName, date, headerRegex, dataRegex);
  
    //deal with header
    if(csv == null){
      return null;
    }
    var rows = csv.split('\n')
    var oldHeader = rows[0].split(',');
    var newHeader = [];
    for (var i = 0; i < oldHeader.length ; i ++){
      if     (i <= 1)  newHeader.push( oldHeader[i]);
      else if(i <= 6)  newHeader.push( "night_"+oldHeader[i]);
      else if(i <= 12) newHeader.push( "day_"+oldHeader[i]);
      else             newHeader.push( "combined_"+oldHeader[i]);
    }
    rows[0] = newHeader.join(',');
    
    return rows.join('\n');
    
  } catch (e) { errorLog(e); return null;}
}

function get_hsif_json(date) {
  var hsif_csv = get_hsif_csv(date);
  return csvJSON(hsif_csv);
}

// seach file in folder   /////////////////////////////////////////////
//fileName = 'hsio' + date + '.zip'
//headerRegex = CONTRACT MONTH.*
//dataRegex = "" + CommonData.Month[month] + "-" + year + "," + strike + "," + C_P + ',.*'         ////SEP-17,26600,C.*
function searchFile(fileName, date, headerRegex, dataRegex, stockCodeRegex) { //date, year, month, strike, C_P
  try {
    var context = getfileByName(fileName);
    if(context){
      var listheader = context.match(new RegExp(headerRegex , 'mi'));
      var list = null;
      if(stockCodeRegex){
        var splitedContext = context.split(listheader[0]);
        var splitedContext_target = ""; 
        splitedContext.forEach( function(item){ 
          if( item.match(new RegExp(stockCodeRegex , 'mi')) ){
            splitedContext_target = item;
          }
        })

        list = splitedContext_target.match(new RegExp(dataRegex , 'g'));
      }
      else {
        list = context              .match(new RegExp(dataRegex , 'g'));
      }
      if(list){
        //merge header and data tgt
        var csvFormat_str = "date," +listheader[0].replace(/[^A-Za-z ,/]/g, "").replace(/[ /]/g, "_");
        list.forEach(function(item) {
          csvFormat_str += "\n" +date +','+ item.replace(/[\n/]/g, "");
        })
      }
      // Logger.log("\n\n" + SearchKey_regex+ "\n"+csvFormat_str);
      return csvFormat_str;
    }
    return null;
  } catch (e) { errorLog(e); return null;}
}
function getfileByName_test() {
  getfileByName("hsio1710...zip")
}
// config   /////////////////////////////////////////////
var FOLDER_ID = '0BytahsRby1tEZC1fUjY3Z3Z2QzA'; // AutoDownloadData

function getfileByName(zipFileName) {
  var theFolder = DriveApp.getFolderById(FOLDER_ID);
  var theFile = theFolder.getFilesByName(zipFileName);
  if(theFile.hasNext()){
    var fileBlob = theFile.next().getBlob();
    fileBlob.setContentType("application/zip");
    var unZippedfile = Utilities.unzip(fileBlob);
    
    var file = unZippedfile[0];
    var fileContext = file.getDataAsString();
    return fileContext;
  }
  var errorMsg = 'file '+ zipFileName+ ' not exist in folder ' + theFolder.getName();
  logError( errorMsg, 'Data_unzip', '106')
//  throw errorMsg;
}

// var csv is the CSV file with headers /////////////////////////////////////////////
function csvJSON(csv) {
  if(csv == null){
    logError("csv cannot be null", "Data_unzip.gs", "function csvJSON(csv)")
    return null;
  }
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    if (lines[i] != "") {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    };
  }
  return result; //JavaScript object
}


////// unused function
function handleDuplicateCSVHeader(header){
  var counts = {};
  var newHeader = "";
  header.split(",").forEach(function(x) { 
    counts[x] = (counts[x] || 0)+1; 
    newHeader += (newHeader == "" ? "": ",") + x  + ( counts[x] == 1 ? "" : "_" + counts[x] );
  });
  return newHeader;
}


/***** hsif
night_date
night_Contract_Month
night_Open_Price
night_Daily_High
night_Daily_Low
night_Close_Price
night_Volume
day_Open_Price
day_Daily_High
day_Daily_Low
day_Volume
day_Settlement_Price
day_Change_in_Settlement_Price
combined_Contract_High
combined_Contract_Low
combined_Volume
combined_Open_Interest
combined_Change_in_O
*****/


