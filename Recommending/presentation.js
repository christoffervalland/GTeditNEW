/**
Get ten objects from Mongolab DB.
Print these ten to the objectlist

To-do: Check if spiderurls exists in popular urls
		IF exists: Total value = spider.weight + url.weight
Why: So that the most popular object will be printed first.
**/

$('#suggestionInfo').hide();

function getTenObjects(){
	$('#objectLoading').show();
	$('#suggestionsLoading').hide();
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/objects?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhr.onload = function(){
			var response = JSON.parse(xhr.responseText);
			response.sort(function(a, b){
				return b.collectedobject.weight - a.collectedobject.weight;
			});
			for(var i = 0; i < 10; i++){
				var tempObject = response[i];
				//i+1 because it's an array and I don't want the first object to be 0.
				printObjects(i+1, tempObject.collectedobject.object, tempObject.collectedobject.weight);
			}
			$("#objectList > li > a").on("click", function() {
				search($(this).html());
				$('#suggestionsLoading').show();
			});
		}
	xhr.send();
}
getTenObjects();


function getTenUrls(){
	$('#urlLoading').show();
	var xhrUrl = new XMLHttpRequest();
	xhrUrl.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhrUrl.onload = function(){
			var response = JSON.parse(xhrUrl.responseText);
			response.sort(function(a, b){
				return b.visited.weight - a.visited.weight;
			});
			for(var i = 0; i < 10; i++){
				var tempUrl = response[i];
				//i+1 because it's an array and I don't want the first object to be 0.
				printUrls(i+1, tempUrl.visited.url, tempUrl.visited.weight);
			}
		}
	xhrUrl.send();
}
getTenUrls();

function getTenSpiders(){
	$('#spiderLoading').show();
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/spiderurls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhr.onload = function(){
			var response = JSON.parse(xhr.responseText);
			response.sort(function(a, b){
				return b.spider.weight - a.spider.weight;
			});
			for(var i = 0; i < 10; i++){
				var tempUrl = response[i];
				//i+1 because it's an array and I don't want the first object to be 0.
				printSpiders(i+1, tempUrl.spider.url, tempUrl.spider.weight);
			}
		}
	xhr.send();
}
getTenSpiders();

function search(searchString){
	//console.log("Searchstring: " + searchString);
	var urlList = [];
	var spiderList = [];
	
	$("#suggestionList").empty();

	$('#urlList > li > a').each(function(){
		urlList.push($(this).html());
	});
	$('#spiderurls > li > a').each(function(){
		urlList.push($(this).html());
	});
	
	for(var i = 0; i < urlList.length; i++){
		loadSite(searchString, urlList[i]);
	}
}

function loadSite(searchString, searchUrl){
	//console.log(searchString + " : " + searchUrl);
	$.get(searchUrl, function( data ) {
  		//console.log(data);
  		//if(searchString.indexOf(data) > -1){
  		if(data.search(searchString) >= 0){

  			printSuggestions(searchUrl, searchString);
  			console.log(searchString + " exists on: " + searchUrl);

  		} else {
  			console.log(searchString + " DOESN'T EXIST ON: " + searchUrl);
  		}
	});
}


function printObjects(value, object, popularity){
	var objectList = $("#objectList");
	$('#objectLoading').hide();
	objectList.append("<li>" + value + ": " + '<a href="#">' + object + '</a> | "' + popularity + "</li>");
}

function printSuggestions(object, searched){
	$('#suggestionsLoading').hide();

	$('#suggestionInfo').empty();
	$('#suggestionInfo').show();
	$('#suggestionInfo').append("Here's the suggestion for your search query: " + searched);

	$("#suggestionList").append('<li><a href="' + object + '" target="_blank">' + object + '</a></li>');
}

function printUrls(value, url, popularity){
	var htmlList = $("#urlList");
	$('#urlLoading').hide();
	htmlList.append("<li>" + value + ": " + '<a href="' + url + '" target="_blank">' + url + "</a>" + " | " + popularity + "</li>");
}

function printSpiders(value, url, popularity){
	var spiderList = $('#spiderurls');
	$('#spiderLoading').hide();
	spiderList.append("<li>" + value + ": " + '<a href="' + url + '" target="_blank">' + url + "</a>" + " | " + popularity + "</li>")
}