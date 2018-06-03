var token = "0";
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


function doPost(e){
//  GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),"Telegram Bot Update",JSON.stringify(e,null,4));
//  logError("Telegram", JSON.stringify(e,null,4) , "");
  //  logError("Telegram", JSON.stringify(contents,null,4) , "");
  
  var contents = JSON.parse(e.postData.contents);
  
  var text = contents.message.text;
  var id   = contents.message.from.id;
  var chatId   = contents.message.chat.id;
  var username = contents.message.from.username;
  
  getSheetByName('Errors').appendRow([getDateNowStr(), id,username,text, contents]);
  
  if(chatId == "212470449"){
    sendMessage( id , "hi, "+ username );
  }
  
}

function textTelegramText(text, chatId){
  if(chatId == "group") chatId = 0;
  else chatId = 0;
  
  sendMessage (chatId, text);

}

function textTelegramText_test(text){
 textTelegramText ("detail in goo.gl/D5BJv2");

}

function replaceSpecialwords(){
//  Only the tags mentioned above are currently supported.
//Tags must not be nested.
//All <, > and & symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (< with &lt;, > with &gt; and & with &amp;).
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