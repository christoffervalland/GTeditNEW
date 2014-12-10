chrome.runtime.onConnect.addListener(function(port){
  port.postMessage({greeting:"hello"});
});






//BRUK DENNE KODEN I CONTENT-SCRIPT HARVEST.JS




/**
//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"mycontentscript"});
port.onMessage.addListener(function(message,sender){
  if(message.greeting === "hello"){
    console.log(message.greeting);
  }
});
**/