try {
  chrome.tabs.onUpdated.addListener(function(request, changeInfo, tab) {
    if(changeInfo.url == "chrome://newtab/") {

    }

    else if (changeInfo.url) {
      var xhrGet = new XMLHttpRequest();
          xhrGet.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/urls?q={"visited.url": "' + tab.url + '"}&apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
          xhrGet.onreadystatechange = function(){
            var response = JSON.parse(xhrGet.responseText);
            //var response = xhrGet.responseText;
            if(response.length === 0){
              var jsonUrl = '{"visited":' + '{"url":' + '"' + tab.url + '"' + ', "weight": 1}}';
              //alert("Line 32: " + jsonUrl);
              xhrGet.open("POST", "https://api.mongolab.com/api/1/databases/semanticuri/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s");
              xhrGet.setRequestHeader("Content-Type", "application/json");
              xhrGet.send(jsonUrl);
            } else {           
              for(var i = 0; i < response.length; i++){
                var temp = response[i];
                var weight = temp.visited.weight + 1;  
                //alert("Line 45: " + weight);
                var updated = '{"visited":' + '{"url":' + '"' + tab.url + '"' + ', "weight":' + weight + '}}';
                xhrGet.open("PUT", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s&q={"visited.url": "' + temp.visited.url + '"}' );              
                xhrGet.setRequestHeader("Content-Type", "application/json");
                xhrGet.send(updated);

              }
            }
          }
        xhrGet.send();
    }

    //console.log(sender.tab ? "from a content script: " + sender.tab.id+", "+sender.tab.url : "from the extension" );
     if (request.harvestedTriples) {
         chrome.pageAction.show(sender.tab.id);
         sendResponse({});
     }  else {
        sendResponse({}); // snub them.
     }
  });

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
     //console.log(sender.tab ? "from a content script: " + sender.tab.id+", "+sender.tab.url : "from the extension" );
     if (request.harvestedTriples) {
         chrome.pageAction.show(sender.tab.id);
         sendResponse({});
     }  else {
        sendResponse({}); // snub them.
     }
  });

  //This happens when clicking the browseraction-button
  chrome.browserAction.onClicked.addListener(function(tab) {
        var url = chrome.extension.getURL("Recommending/presentation.html");
        chrome.tabs.create({"url": url, "selected": true},
          function(viewerTab) {
           chrome.tabs.sendRequest(viewerTab.id, { viewerInit: true, url: tab.url, id: tab.id});
        });
  });

  
} catch (ex) {
   console.log("Error setting up rdfa extension: "+ex);
}
