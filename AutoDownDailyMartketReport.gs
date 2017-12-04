//---= ManualDownload  ---=---=---=---=---=---=---=---=---=---=---=---=
function manualDownload() {
  var start = '170101';
  var end ='170313';
  
  var date = start;
  
  while(date <= end){ 
//      uploadFile(get_HKEX_Url(hkexTypeMap.DTOP_O, date));
//      uploadFile(get_HKEX_Url(hkexTypeMap.DTOP_F, date));
      uploadFile(get_HKEX_Url(hkexTypeMap.stockOption, date));
      uploadFile(get_HKEX_Url(hkexTypeMap.hsif, date));
      uploadFile(get_HKEX_Url(hkexTypeMap.hsio, date));

      date = getNextTransactionDate(date);
	}
  
}
//---= end ManualDownload  ---=---=---=---=---=---=---=---=---=---=---=---=

var hkexTypeMap = {
  stockOption: 'dayrpt/dqe',
  hsio: 'dayrpt/hsio',
  hsif: 'dayrpt/hsif',
  DTOP_O: 'OI/DTOP_O_20',
  DTOP_F: 'OI/DTOP_F_20'
}

// var date = "161003"
function get_HKEX_Url(hkexType, date){
  // https://www.hkex.com.hk/eng/stat/dmstat/dayrpt/dqe161003.zip
  // https://www.hkex.com.hk/eng/stat/dmstat/dayrpt/hsio161004.zip
  // https://www.hkex.com.hk/eng/stat/dmstat/dayrpt/hsifc161102.zip
  // https://www.hkex.com.hk/eng/stat/dmstat/OI/DTOP_F_20170317.zip
  // https://www.hkex.com.hk/eng/stat/dmstat/OI/DTOP_O_20170317.zip

  var HKEX_BASE_URL = 'https://www.hkex.com.hk/eng/stat/dmstat/';
  var titleName = hkexType + date + '.zip';
  
  return HKEX_BASE_URL + titleName;
}

//---=---=---=---=---=---=---=---=---=---=---=---=---=

// download Market Data - Daily Market Report
function run_downloadMarketData() {
  var date = getDate(0);
  var is_DailyMartketReport_triger = false;
  
//  uploadFile(get_HKEX_Url(hkexTypeMap.stockOption, date));
  Object.keys(hkexTypeMap).forEach(function(key){
    var ifSuccess = uploadFile(get_HKEX_Url(hkexTypeMap[key], date));
    if(key == 'hsio' && ifSuccess) { is_DailyMartketReport_triger = true; }
  });

  if (is_DailyMartketReport_triger){ 
    addDateList(date);
    DailyMartketReport_triger(date); 
  }
  
  sendEmail(date);
}

/**
 * Uploads a new file to the user's Drive.
 */
function uploadFile(url) {
  try{
    var dir = DriveApp.getFolderById("0BytahsRby1tEZC1fUjY3Z3Z2QzA");  
    var file_Blob = UrlFetchApp.fetch(url).getBlob();
    var file = dir.createFile(file_Blob);
    
    Logger.log('Name: %s, StoreAt: %s', file.getName(), dir.getName());
    return true;
    
  }catch(e){
    Logger.log('get url fail: "%s"', url);
    return false;
  }
}
function loopURL_test(){
  
    
  
}

function loopURL(){
  var date_now = new Date();
  if (date_now.getHours() >= 18 ){
    var date = getDate(0);
    
    var url = "https://www.hkex.com.hk/eng/stat/dmstat/dayrpt/hsio"+date+".zip";
    var isSuccess = false;
    
    try{
      var file_Blob = UrlFetchApp.fetch(url).getBlob();
      Logger.log('Url success' + file_Blob.getName());
      isSuccess = true;
    }catch(e){
      var msg = 'get url fail: "%s"' + url;
      Logger.log(msg);
      logError( msg, 'AutoDownDaily', '98')
    }
    logError( 'Url success: ' + file_Blob.getName() , 'AutoDownDaily', '100')
    sendEmail(date);
  }
}

//---=---=---=---=---=---=---=---=---=---=---=---=---=

function sendEmail(date){
  var recipient = Session.getActiveUser().getEmail();
  var subject = 'DailyMarketReport '+ date;
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body);
}


//date_diff = -1 -> yesterday
//date_diff = 0 -> today
//date_diff = 1 -> tomorrow
function getDate(date_diff){
  var d = new Date();
  d.setDate(d.getDate() + date_diff);
  
  var yy = d.getUTCFullYear()%100;
  var mm = (d.getUTCMonth() +1 <10 ? "0" : "" )+ (d.getUTCMonth() +1);
  var dd = (d.getDate() <10 ? "0" : "" )+ d.getDate();

  return "" +  yy + mm + dd;
}

function getNextTransactionDate(yymmdd){
  var d = new Date();
  d.setDate(yymmdd%100);
  d.setMonth(yymmdd/100%100 -1);
  d.setFullYear(2000 + yymmdd/10000);

  d.setDate(d.getDate() +1);
  while(d.getDay() === 6 || d.getDay() === 0){
    d.setDate(d.getDate() +1);
  }

  var yy = d.getUTCFullYear()%100;
  var mm = (d.getUTCMonth() +1 <10 ? "0" : "" )+ (d.getUTCMonth() +1);
  var dd = (d.getDate() <10 ? "0" : "" )+ d.getDate();

  return "" +  yy + mm + dd;
}





