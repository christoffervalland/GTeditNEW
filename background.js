try {
  var urlList = [];
  var jsonUrl = '';
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.url == "chrome://newtab/") {

    }

    else if (changeInfo.url) {
      jsonUrl = '{"url":' + '"' + changeInfo.url + '"' + '}'
      var xhr = new XMLHttpRequest();
          xhr.open("POST", "https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(jsonUrl);

      urlList.push(tab.url);
      chrome.storage.sync.set({'urlList': urlList}, function() {
          // callback body
      }); 
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
