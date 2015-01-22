try {
  var urlList = [];
  var jsonUrl = '';
  chrome.tabs.onUpdated.addListener(function(request, changeInfo, tab) {
    if(changeInfo.url == "chrome://newtab/") {

    }

    else if (changeInfo.url) {
      //Pushing visited URLs to the chrome storage area   POSSIBLY NOT NECESSARY TO USE!!!!
      urlList.push(tab.url);
      chrome.storage.sync.set({'urlList': urlList}, function() {
          // callback body
      }); 

      var xhrGet = new XMLHttpRequest()
          xhrGet.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?q={"visited.url": "' + changeInfo.url + '"}&apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
          xhrGet.onreadystatechange = function(){
            var response = JSON.parse(xhrGet.responseText);
            //var response = xhrGet.responseText;
            alert("line 21: " + changeInfo.url);
            alert("Line 22: " + response);
            if(response.length == 0){
              //alert("DENNE ER TOM");
              //Pushing visited urls to the mongolab DB
              //jsonUrl = '{"url":' + '"' + changeInfo.url + '"' +'}';
              //jsonUrl = '{"url":' + '"' + changeInfo.url + '"' + ', "weight": 1}';
              jsonUrl = '{"visited":' + '{"url":' + '"' + changeInfo.url + '"' + ', "weight": 1}}';
              alert("Line 29: " + jsonUrl);
              
              var xhr = new XMLHttpRequest();
                  xhr.open("POST", "https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s", true);
                  xhr.setRequestHeader("Content-Type", "application/json");
                  xhr.send(jsonUrl);

            } else {
              for(var i = 0; i < response.length; i++){
                var temp = response[i];
                var weight = temp.visited.weight + 1;
                
                /** FORTSETT HER HER HER HER!!!!!!!!!!!!! OPPDATERE VERDI I DB!!!

                xhrGet.open("PUT", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?q={"visited.weight": "' + weight + '"}&apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
                xhrGet.send()
              
                **/


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
