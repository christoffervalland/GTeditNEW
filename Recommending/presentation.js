/**
Get ten objects from Mongolab DB.
Print these ten to the objectlist

To-do: Check if spiderurls exists in popular urls
		IF exists: Total value = spider.weight + url.weight
Why: So that the most popular object will be printed first.
**/

$('#suggestionInfo').hide();
$('#suggestedObject').hide();
$('#refreshButton').hide();

function getTenObjects(){
	$('#objectLoading').show();
	$('#refreshButton').show();
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/objects?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhr.onload = function(){
			var response = JSON.parse(xhr.responseText);
			//Method to sort from highest to lowest weight.
			response.sort(function(a, b){
				return b.collectedobject.weight - a.collectedobject.weight;
			});
			var tempInt = 0;
			for(var i = 0; i < 10; i++){
				var tempObject = response[i];
				//i+1 because it's an array and I don't want the first object to be 0.
				printObjects(i+1, tempObject.collectedobject.object, tempObject.collectedobject.weight);
				tempInt = i+1;
			}

			search(response[0].collectedobject.object);
			$("#objectList > li > a").on("click", function() {
				$('#suggestedObject').hide();
				$('#suggestionInfo').hide();
				search($(this).html());
				$('#suggestionsLoading').show();
			});
			
			/**
			Provides functionality to the Refresh button in GUI
			Provides ten new objects that the user may be interested in. 
			**/
			$('#refreshButton').on('click', function(){
				$('#objectList > li').empty();
				var i = tempInt;
				for(i; i < tempInt+10; i++){
					tempObject = response[i];
					console.log(tempObject.collectedobject.object);
					printObjects(i+1, tempObject.collectedobject.object, tempObject.collectedobject.weight);
				}
				tempInt = i+1;

				//Calling search here makes me able to search from the ten new after user hits "refresh"-button
				search(response[0].collectedobject.object);
					$("#objectList > li > a").on("click", function() {
					$('#suggestedObject').hide();
					$('#suggestionInfo').hide();
					search($(this).html());
					$('#suggestionsLoading').show();
				});

			});
		}
	xhr.send();
}
getTenObjects();


function getTenUrls(){
	$('#urlLoading').show();
	var xhrUrl = new XMLHttpRequest();
	xhrUrl.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
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
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/spiderurls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
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
	//var spiderList = [];
	
	$("#suggestionList").empty();

	var xhrUrl = new XMLHttpRequest();
	xhrUrl.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhrUrl.onload = function(){
		var response = JSON.parse(xhrUrl.responseText);
		//Sorting the URL collection so that the most visited URLs comes first
		response.sort(function(a, b){
			return b.visited.weight - a.visited.weight;
		});
		console.log("ANTAL URL: " + response.length);
		//To check every single URL in the collection, uncomment code line below.
		//for(var i = 0; i < response.length; i++){
		//Code line below limits the search to 50 Spidered URLs
		for(var i = 0; i < 49; i++){
			var tempUrl = response[i];
			//console.log(tempUrl.visited.url);
			loadSite(searchString, tempUrl.visited.url);
		}
	}
	xhrUrl.send();


	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/semanticuri/collections/spiderurls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhr.onload = function(){
		var response = JSON.parse(xhr.responseText);
		//Sorts the spidered URLs so that the most spidered URLs comes first.
		response.sort(function(a, b){
			return b.spider.weight - a.spider.weight;
		});
		console.log("ANTAL SPIDERURL: " + response.length);
		//To check every single spidered URL collection, uncomment code line below
		//for(var i = 0; i < response.length; i++){
		//Code line below limits the search to 50 Spidered URLs
		for(var i = 0; i < 49; i++){
			var tempUrl = response[i];
			//console.log(tempUrl.spider.url);
			loadSite(searchString, tempUrl.spider.url);
		}
	}
	xhr.send();
}

function loadSite(searchString, searchUrl){
	//console.log(searchString + " : " + searchUrl);
	$.get(searchUrl, function( data ) {
  		//console.log(data);
  		//if(searchString.indexOf(data) > -1){
  		if(data.search(searchString) >= 0){

  			printSuggestions(searchUrl, searchString);
  			//console.log(searchString + " exists on: " + searchUrl);

  		} else {
  			//console.log(searchString + " DOESN'T EXIST ON: " + searchUrl);
  		}
	});
}


function printObjects(value, object, popularity){
	var objectList = $("#objectList");
	$('#objectLoading').hide();
	objectList.append("<li>" + value + ": " + '<a href="#">' + object + '</a> | ' + popularity + "</li>");	
}

function printSuggestions(object, searched){
	$('#suggestionsLoading').hide();

	$('#suggestionInfo').empty();
	$('#suggestionInfo').show();
	$('#suggestionInfo').append("Here's the suggestion for your search query: ");
	$('#suggestedObject').empty();
	$('#suggestedObject').show();
	$('#suggestedObject').append(searched);
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