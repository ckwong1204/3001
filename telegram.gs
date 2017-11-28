//https://gist.github.com/whatsmate/7555d8435a0d769fd01b3acefdf6ce47

function main() {
  var groupName = "YOUR_UNIQUE_GROUP_NAME_HERE";   // TODO: Specify the name of the group
  var message = "Guys, lets party tonight!";  // TODO: Specify the content of your message
  sendTelegramGroup(groupName, message);
}


function sendTelegramGroup(groupName, message) {
  var instanceId = "YOUR_INSTANCE_ID_HERE";  // TODO: Replace it with your gateway instance ID here
  var clientId = "YOUR_CLIENT_ID_HERE";  // TODO: Replace it with your Premium client ID here
  var clientSecret = "YOUR_CLIENT_SECRET_HERE";   // TODO: Replace it with your Premium client secret here

  var jsonPayload = JSON.stringify({
    group: groupName,
    message: message
  });

  var options = {
    "method" : "post",
    "contentType": "application/json",
    "headers": {
      "X-WM-CLIENT-ID": clientId,
      "X-WM-CLIENT-SECRET": clientSecret
    },
    "payload" : jsonPayload,
    "Content-Length": jsonPayload.length
  };

  UrlFetchApp.fetch("http://api.whatsmate.net/v1/telegram/group/message/" + instanceId, options);
}