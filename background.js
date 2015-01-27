try {
  //This happens when message received from content script... 
  //Fix it so that it only happens once!
  chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
  if(changeInfo.status == "complete"){
    //alert("Page finished loading");
    
    if(tab.url == "chrome://newtab") {
      //Should provide code to avoid storing chrome-specific urls
      //Examples: "chrome://newtab", "chrome://extensions" etc etc.
    } else {
      /**
      var urlList = [];
      
      //Pushing visited URLs to the chrome storage area   POSSIBLY NOT NECESSARY TO USE!!!!
      urlList.push(tab.url);
      chrome.storage.sync.set({'urlList': urlList}, function() {
          // callback body
      }); 
      **/
      //alert("Line 19: " + tab.url);
      var xhrGet = new XMLHttpRequest();
          xhrGet.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?q={"visited.url": "' + tab.url + '"}&apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
          xhrGet.onreadystatechange = function(){
            var response = JSON.parse(xhrGet.responseText);
            //var response = xhrGet.responseText;
            if(response.length === 0){
              var jsonUrl = '{"visited":' + '{"url":' + '"' + tab.url + '"' + ', "weight": 1}}';
              //alert("Line 32: " + jsonUrl);
              xhrGet.open("POST", "https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s");
              xhrGet.setRequestHeader("Content-Type", "application/json");
              xhrGet.send(jsonUrl);
            } else {           
              for(var i = 0; i < response.length; i++){
                var temp = response[i];
                var weight = temp.visited.weight + 1;  
                //alert("Line 45: " + weight);
                var updated = '{"visited":' + '{"url":' + '"' + tab.url + '"' + ', "weight":' + weight + '}}';
                xhrGet.open("PUT", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s&q={"visited.url": "' + temp.visited.url + '"}' );              
                xhrGet.setRequestHeader("Content-Type", "application/json");
                xhrGet.send(updated);

              }
            }
          }

        xhrGet.send();
      }
    }
  });


  //This happens when the backgroundscript receive message from contentscript
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
     //console.log(sender.tab ? "from a content script: " + sender.tab.id+", "+sender.tab.url : "from the extension" );
     if (request.harvestedTriples) {
         chrome.pageAction.show(sender.tab.id);
         sendResponse({});
     }  else {
        sendResponse({}); // snub them.
     }
  });

  //This happens ONBUTTON CLICK!!!!!!!!!!!!
  chrome.pageAction.onClicked.addListener(function(tab) {
        var url = chrome.extension.getURL("viewer.xhtml");
        chrome.tabs.create({"url": url, "selected": true},
          function(viewerTab) {
           chrome.tabs.sendRequest(viewerTab.id, { viewerInit: true, url: tab.url, id: tab.id});
        });
  });

  
} catch (ex) {
   console.log("Error setting up rdfa extension: "+ex);
}
