function run() {
//  var data = getYahooFinanceOpen("1733.hk");
//  clacRSI(data, 14)
}

function getRSI(stocknumber, rsi_windows){
  if ( /^\d{4}$/.test(stocknumber)){
    stocknumber += ".hk";
  }
//  var data = getYahooFinanceOpen(stocknumber);
//  return clacRSI(data, rsi_windows);
}

function clacRSI(data, rsi_windows) {
  // var data = getYahooFinanceOpen("1733.hk");
  //loop data from oldest to newest
  base = {
  	rsi_hvCalc:false,
  	rsi_gain:[],
  	rsi_loss:[],
  	v:[]
  };
  var Days_in_Year = 252;
  var Volatility_window = 14;
  var RSI_window = rsi_windows;
  var ATR_window = 14;

  for (var i = data.length - 1; i >= 0; i--) {
    //  for(var i=1;i<data.length;i++){
    
i = Number(i);
    var tdy = data[i];
    var ystdy = data[i+1];

    //rsi
    if (ystdy && tdy) {
    	tdy["Change"] = (tdy.Close - ystdy.Close).toFixed(2);
    	var tdy_Gain = tdy.Change > 0 ? Math.abs(tdy.Change) : 0;
    	var tdy_Loss = tdy.Change <  0 ? Math.abs(tdy.Change) : 0;

    	if (base.rsi_gain.length < RSI_window && !base.rsi_hvCalc) {
    		base.rsi_gain.push(tdy_Gain);
    		base.rsi_loss.push(tdy_Loss);
    		if(base.rsi_gain.length == RSI_window ){
				tdy["AvGain"] = average(base.rsi_gain);
				tdy["AvLoss"] = average(base.rsi_loss);
				tdy["RS"] = tdy.AvGain / tdy.AvLoss;
				tdy["RSI"]= tdy.AvLoss==0? 100 : 100-(100/(1+tdy.RS));
				base.rsi_hvCalc = true;
    		}
		}
		else{
    		tdy["AvGain"] = (ystdy.AvGain * (RSI_window -1) + tdy_Gain) / RSI_window;
    		tdy["AvLoss"] = (ystdy.AvLoss * (RSI_window -1) + tdy_Loss) / RSI_window;
			tdy["RS"] = tdy.AvGain / tdy.AvLoss;
			tdy["RSI"]= tdy.AvLoss==0? 100 : 100-(100/(1+tdy.RS));
          
		}
      Logger.log( "date: " + tdy.Date + " Close: " + tdy.Close +
            " AvGain: " + tdy.AvGain + " AvLoss: " + tdy.AvLoss + " RS: " + tdy.RS + " RSI: " + tdy.RSI
          );
      
        data[i] = tdy ;
        data[i+1] = ystdy ;
    };
    
    // Logger.log(tdy.RSI)
  }
  return data[0].RSI;
}

function average(arr){
	var total = 0;
	for(var i = 0; i < arr.length; i++) {
		total += arr[i];
	}
	return total / arr.length;
}

//function average(arr){
//  arr = [1,2,3,4,5,6];
//  var ss = SpreadsheetApp.getActiveSpreadsheet();
//  var sheet = ss.getSheets()[0];
//  for (var i = 0; i < arr.length ; i++){
//    var cell = sheet.getRange("A"+(i+1));  
//    cell.setValue(arr[i]);
//  }
//  
//  var cell_result = sheet.getRange("A"+(arr.length+2));
//      cell_result.setFormula("=Average(A1:A"+arr.length+")");
//  var result = cell_result.getValue()
//  
//	Logger.log(123)
////	return total / arr.length;
//}



function excel(arr){
	var total = 0;
	for(var i = 0; i < arr.length; i++) {
		total += arr[i];
	}
	return total / arr.length;
}


function getYahooFinanceOpen(symbol) {
  var EndDate = getDate(-1);
  var StartDate = getDate(-180);
  //  var yahoodataRaw = UrlFetchApp.fetch("http://ichart.finance.yahoo.com/table.csv?s=1733.hk&a=0&b=1&c=2017&d=4&e=9&f=2017&g=&q=q&y=0&z=1733.hk&x=.csv").getContentText(); 
  //  var symbol = "1733.hk";
  var url = "http://ichart.finance.yahoo.com/table.csv?" + "s=" + symbol 
          + "&a=" + StartDate.m + "&b=" + StartDate.d + "&c=" + StartDate.y 
          + "&d=" + EndDate.m + "&e=" + EndDate.d + "&f=" + EndDate.y 
          + "&g=&q=q&y=0&z=" + symbol + "&x=.csv";

  var yahoodataRaw = UrlFetchApp.fetch(url).getContentText();
  var json = csvJSON(yahoodataRaw);
  //"Date", "Open", "High", "Low", "Close", "Volume", "Adj Close"
  //latest date at first row
  return json;
}

//var csv is the CSV file with headers
function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
  	if ( lines[i] != "") {
	  var obj = {};
	  var currentline = lines[i].split(",");
	  for (var j = 0; j < headers.length; j++) {
	    obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
    };
  }
  return result; //JavaScript object
  //   return JSON.stringify(result); //JSON
}

function getDate(date_diff) {
  var d = new Date();
  d.setDate(d.getDate() + date_diff);

  var yy = d.getUTCFullYear();
  var mm = d.getUTCMonth();
  var dd = d.getDate();

  return { y: yy, m: mm, d: dd }
}

//
//
//// log..........
//function myFunction() {
//  try {
//    // Add one line to use BetterLog and log to a spreadsheet
//    Logger = BetterLog.useSpreadsheet('1ssbZGYXg4C4OhiB_XtBHFulPjr2A9T2qp1iIRs9ZzLs');
//
//    //Now you can log and it will also log to the spreadsheet
//    Logger.log("That's all you need to do");
//
//    //Do more logging
//    for (var i = 0; i < 5; i++) {
//      var processingMessage = 'Processing ' + i;
//      Logger.finest('This is inside my loop. i is %s', i);
//    }
//    //We're done
//    Logger.log('The loop is done and i is now %s', i);
//
//  } catch (e) { //with stack tracing if your exceptions bubble up to here
//    e = (typeof e === 'string') ? new Error(e) : e;
//    Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.', e.name || '',
//      e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', processingMessage || '');
//    throw e;
//  }
//}
