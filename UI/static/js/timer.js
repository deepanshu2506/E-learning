function countDown(complete){
    
    seconds = 10
    // Update the count down every 1 second
    var x = setInterval(function() {
      
        
    
      // Display the result in the element with id="demo"
      document.getElementById("clock").innerHTML = seconds + "s ";
      seconds = seconds -1;
    
      // If the count down is finished, write some text
      if (seconds < 0) {
        clearInterval(x);
        //executing the call back fun. (next question) 
        complete();
        document.getElementById("clock").innerHTML = "EXPIRED";
      }
    }, 1000);
}