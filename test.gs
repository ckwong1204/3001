function measuringExecutionTime() {
   // A simple INFO log message, using sprintf() formatting.
   console.info('Timing the %s function (%d arguments)', 'myFunction', 1);

   // Log a JSON object at a DEBUG level. The log is labeled
   // with the message string in the log viewer, and the JSON content
   // is displayed in the expanded log structure under "structPayload".
   var parameters = {
     isValid: true,
     content: 'some string',
     timestamp: new Date()
   };
   console.log({message: 'Function Input', initialData: parameters});

   var label = 'myFunction() time';  // Labels the timing log entry.
   console.time(label);              // Starts the timer.
   try {
     myFunction(parameters);         // Function to time.
   } catch (e) {
     // Logs an ERROR message.
     console.error('myFunction() yielded an error: ' + e);
   }
   console.timeEnd(label);      // Stops the timer, logs execution duration.
 }


function test2(date){
  Logger.log("123123");
  var cacheKey = "getModel3001MonthBase"+ date;
  
  var cached = CacheService.getDocumentCache().get(cacheKey) ;
  
  if(cached == null){
    try{
      var cached = getModel3001MonthBase(date);
      CacheService.getDocumentCache().put(cacheKey, cached);
    }catch(e){ 
      console.log(e); 
      logError(e)
    }
  }
  return cached;
}