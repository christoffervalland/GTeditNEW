/**
Get ten objects from Mongolab DB.
Print these ten to the objectlist

To-do: Check if spiderurls exists in popular urls
		IF exists: Total value = spider.weight + url.weight
Why: So that the most popular object will be printed first.
**/
function getTenObjects(){
	$('#objectLoading').show();
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
			$('#objectLoading').hide();
			$("#objectList > li > a").on("click", function() {
				search($(this).html());
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
			$('#urlLoading').hide();
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
			$('#spiderLoading').hide();
		}
	xhr.send();
}
getTenSpiders();

function search(searchString){
	//console.log("Searchstring: " + searchString);
	var urlList = [];
	var spiderList = [];
	$('#urlList > li > a').each(function(){
		urlList.push($(this).html());
	});
	$('#spiderurls > li > a').each(function(){
		spiderList.push($(this).html());
	});

	//console.log("Urls: " + urlList);
	//console.log("Spider: " + spiderList);
	//console.log(urlList[0]);

	for(var i = 0; i < urlList.length; i++){
		gsitesearch(searchString, urlList[i]);
	}
}

function gsitesearch(searchString, searchUrl){
	//console.log(searchString + " : " + searchUrl);
	var temp = searchString += " " + searchUrl;
	window.open('http://www.google.com/search?q=' + encodeURIComponent(temp));
}


function printObjects(value, object, popularity){
	var objectList = $("#objectList");
	objectList.append("<li>" + value + ": " + '<a href="#">' + object + '</a> | "' + popularity + "</li>");
}

function printUrls(value, url, popularity){
	var htmlList = $("#urlList");
	htmlList.append("<li>" + value + ": " + '<a href="' + url + '" target="_blank">' + url + "</a>" + " | " + popularity + "</li>");
}

function printSpiders(value, url, popularity){
	var spiderList = $('#spiderurls');
	spiderList.append("<li>" + value + ": " + '<a href="' + url + '" target="_blank">' + url + "</a>" + " | " + popularity + "</li>")
}