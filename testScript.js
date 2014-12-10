var objectTable = document.getElementById("storageOutput");
var objectButton = document.getElementById("getStorage");
var urlButton = document.getElementById("getUrl");
var urlTable = document.getElementById("urlOutput");

var key="";

var myjson = '{"id":"3", "name":"VG", "fullname":"Verdens Gang", "url":"www.vg.no/"}';

objectButton.onclick = function(){
    chrome.storage.sync.get("value", function(result){
    	for(key in result){
    		objectTable.innerHTML = result[key];
    		//console.log(result);
    	}
	});
}

urlButton.onclick = function(){
	//Getting info from mongolab mongodb

/**
	var request = new XMLHttpRequest();
    request.open("GET", "https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s");
    request.send(null);
    
    request.onreadystatechange = function(){
    	theresult = document.getElementById("urlOutput");

    	var text = request.responseText;

    	theresult.innerHTML = "Response from mongolab: " + request.responseText;

    }
**/
/**
var xhr = new XMLHttpRequest();
          xhr.open("POST", "https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(myjson);
**/
	//Getting info from chrom storage
	chrome.storage.sync.get("urlList", function(result){
		for(key in result){
			urlTable.innerHTML = result[key];
		}
	});
	
}