function myFunction(obj) {
  return obj;
}


function getYahooFinanceOpen2() {
  //  var url = "http://ichart.finance.yahoo.com/table.csv?" + "s=" + symbol 
//          + "&a=" + StartDate.m + "&b=" + StartDate.d + "&c=" + StartDate.y 
//          + "&d=" + EndDate.m + "&e=" + EndDate.d + "&f=" + EndDate.y 
//          + "&g=&q=q&y=0&z=" + symbol + "&x=.csv";
//  var url = "https://query1.finance.yahoo.com/v7/finance/download/1733.HK?period1=1464019200&period2=1495555200&interval=1d&events=history&crumb=y2yZeiZBR2t";
  
  var url = "https://query1.finance.yahoo.com/v7/finance/download/1733.HK?period1=1493023495&period2=1495615495&interval=1d&events=history&crumb=y2yZeiZBR2t";
     
//  var url = "http://www.aastocks.com/tc/ltp/rtquote.aspx?symbol=01733"
  
//  var r = UrlFetchApp.fetch(url);//.getContentText();
  var r = UrlFetchApp.fetch(url,{muteHttpExceptions:true});

  
//  var r = UrlFetchApp.getRequest(url);
//  r.keys(obj)
  var a1 = r.getContentText();
  var a2 = r.getAllHeaders();
  var a3 = r.getContent();
  var a4 = r.getHeaders();
  var a5 = r.getResponseCode();
  
  Logger.log(r.getHeaders());
  Logger.log("---------------------------------------------------------------------------");
  Logger.log(r.getContent());
  
//  var json = csvJSON(yahoodataRaw);

//  return json;
}