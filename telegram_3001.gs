function dailyTelegramUpdate(){
  var m3001 = getModel3001();
  textTelegramText(m3001.summary, "group");
}

function dailyTelegramUpdate_test(){
  var m3001 = getModel3001();
  textTelegramText(m3001.summary, "test");
}

function dailyTelegramUpdate_test_1stday(){
  var m3001 = getModel3001("180531");
  textTelegramText(m3001.summary, "test");
}

function dailyTelegramUpdate_test_Endday(){
  var m3001 = getModel3001("180530");
  textTelegramText(m3001.summary, "test");
}
