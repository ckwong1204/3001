function StaticCache_test_putCache(){    
  var key = "asdf";
  var value = ""
          StaticCache.putCache(key,value); 
  var a = StaticCache.getCache(key); 
  Logger.log(a);
}

var StaticCache = {
  
  cacheStaticCache: null,
  
  getStaticCacheOrCallFunctionIfNull: function(key, functionToBeCall, arg1, arg2, arg3, arg4){
    var cachedValue = this.getCache(key);
    if(cachedValue){
      return cachedValue.value;
    }
    return this.putCache(key, functionToBeCall(arg1, arg2, arg3, arg4) );
  },
  
  getStaticCache: function(){
    if(!this.cacheStaticCache){
      var sheet = getSheetByName('Cache');
      var result = {};
      sheet.getDataRange().getValues().forEach(function(v,i){
        if( v[0] != "" &&  v[0] != "Key")
          result[v[0]] = {
            i: i+1,  //represent the row number of spreadsheet
            value: JSON.parse(v[1])
          };
      });
      this.cacheStaticCache = result;
    }
    return this.cacheStaticCache;
  },
  
  getCache: function (key) {
  	return this.getStaticCache()[key];
  },

  putCache: function(key, value) {
    if(key != null && key != ""){
      var cachedValue = this.getStaticCache()[key];
      if(cachedValue){
        getSheetByName("Cache").getRange(cachedValue.i, 2).setValue( JSON.stringify(value) );
      }
      else{
        getSheetByName("Cache").appendRow([
          key, JSON.stringify(value)
        ]);
        this.cacheStaticCache = null; //clear session cacheStaticCache
      }
    }
    return value;
  }
  
}