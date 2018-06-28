var token = "456425019:AAGPvI1Gi4LdD9zaOz9l9E0S2BuYefcJpDE";
var chatId_ck = "212470449";
var chatId_group = "-297241281";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl    = "https://script.google.com/macros/s/AKfycbxKcVkaCnsGDO_0CB0uw8P_qMOqlsITNRTZeK0wHWoJRrC7NOWG/exec";
//var webAppUrldev = "https://script.google.com/macros/s/AKfycbyzY9alKolkmDbsW7MgtwteILaLOOXsdjwkeUPtyWp6/dev"

function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
  
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

function setWebHook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function sendMessage(id, text) {
  try{
    var encodedText = encodeURIComponent((text));
    var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + encodedText );
    Logger.log(response.getContentText());
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}


function doPost(postMsg){
  try{
    //  GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),"Telegram Bot Update",JSON.stringify(postMsg,null,4));
    //  logError("Telegram", JSON.stringify(postMsg,null,4) , "");
    //  logError("Telegram", JSON.stringify(contents,null,4) , "");
    
    var contents = JSON.parse(postMsg.postData.contents);
    
    var text = contents.message.text;
    var id   = contents.message.from.id;
    var chatId   = contents.message.chat.id;
    var username = contents.message.from.username;
    
    getSheetByName('Errors').appendRow([getDateNowStr(), id,username,text, contents]);
    
    if(chatId == chatId_ck){
      sendMessage( id , "hi, "+ username );
    }
  } catch (e) { errorLog(e);}
}

function textTelegramText(text, chatId){
  if(chatId == "group") chatId = chatId_group;
  else chatId = chatId_ck;
  
  sendMessage (chatId, text);

}

function textTelegramText_test(text){
 textTelegramText ("detail in goo.gl/D5BJv2");

}

function replaceSpecialwords(){
//  Only the tags mentioned above are currently supported.
//Tags must not be nested.
//All <, > and & symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (
//< with &lt;
//> with &gt;
//& with &amp;
//All numerical HTML entities are supported.
//The API currently supports only the following named HTML entities: &lt;, &gt;, &amp; and &quot;.
  
//  < with &lt;, > with &gt; and & with &amp;
  
  
}
  
  /*  
{
    "update_id": 199335288,
    "message": {
        "message_id": 8,
        "from": {
            "id": 212470449,
            "is_bot": false,
            "first_name": "CK",
            "username": "ckwongck",
            "language_code": "en-US"
        },
        "chat": {
            "id": 212470449,
            "first_name": "CK",
            "username": "ckwongck",
            "type": "private"
        },
        "date": 1527073004,
        "text": "testset"
    }
  }
"
  
  
  */


function googleChart(){
  var data = Charts.newDataTable()
      .addColumn(Charts.ColumnType.STRING, 'Month')
      .addColumn(Charts.ColumnType.NUMBER, 'In Store')
      .addColumn(Charts.ColumnType.NUMBER, 'Online')
      .addRow(['January', 10, 1])
      .addRow(['February', 12, 1])
      .addRow(['March', 20, 2])
      .addRow(['April', 25, 3])
      .addRow(['May', 30, 4])
      .build();

  var chart = Charts.newAreaChart()
      .setDataTable(data)
      .setStacked()
      .setRange(0, 40)
      .setTitle('Sales per Month')
      .build();

  var blob = chart.getAs('image/png');
  return blob;
  
  var htmlOutput = HtmlService.createHtmlOutput().setTitle('My Chart');                       
  var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
  var imageUrl = "data:image/png;base64," + encodeURI(imageData);
  htmlOutput.append("Render chart server side: <br/>");
  htmlOutput.append("<img border=\"1\" src=\"" + imageUrl + "\">");
  return htmlOutput;

}


function sendPhoto(id, text) {
  try{
    
    var blob = googleChart();
    console.log(blob);
    var formData = {
      chat_id: chatId_ck,
      photo: blob
    };
    var options = {
      'method' : 'post',
      'payload' : formData
    };
    
    var response = UrlFetchApp.fetch(url + "/sendPhoto", options );
    
    
    Logger.log(response.getContentText());
    
  } catch (e) { errorLog(e); return "failed" + e.message + ";" + e.fileName + "(" + e.lineNumber + ")"}
}


function sendTelegramPhoto(text, chatId){
  if(chatId == "group") chatId = chatId_group;
  else chatId = chatId_ck;
  
  sendPhoto (chatId, googleChart());

}