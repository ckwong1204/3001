var token = "456425019:AAGPvI1Gi4LdD9zaOz9l9E0S2BuYefcJpDE";
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
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + text);
  Logger.log(response.getContentText());
}


function doPost(e){
//  GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),"Telegram Bot Update",JSON.stringify(e,null,4));
//  logError("Telegram", JSON.stringify(e,null,4) , "");
  //  logError("Telegram", JSON.stringify(contents,null,4) , "");
  
  var contents = JSON.parse(e.postData.contents);
  
  var text = contents.message.text;
  var id   = contents.message.from.id;
  var username = contents.message.from.username;
  
  sendMessage( id , "hi, "+ username )
  
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors').appendRow([getDateNowStr(), id,username,text, contents]);
}

function textTelegramText(){
 sendMessage ("212470449", "1111111");

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