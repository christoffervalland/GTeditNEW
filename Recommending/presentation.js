/**
Get ten objects from Mongolab DB.
Print these ten to the objectlist

To-do: Sort the ten collected objects by highest value on DB
Why: So that the most popular object will be printed first.
**/
function getTenObjects(){
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
		}
	xhr.send();
}
getTenObjects();

function printObjects(value, object, popularity){
	var htmlList = $("#objectList");
	htmlList.append('<li>' + value + ': ' + object + " | " + popularity + '</li>');
}

function getTenUrls(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://api.mongolab.com/api/1/databases/testbase/collections/urls?apiKey=2P7QlEw29SmcG6BrJ5TZJZZT-eQmd64s');
	xhr.onload = function(){
			var response = JSON.parse(xhr.responseText);
			response.sort(function(a, b){
				return b.visited.weight - a.visited.weight;
			});
			for(var i = 0; i < 10; i++){
				var tempUrl = response[i];
				//i+1 because it's an array and I don't want the first object to be 0.
				printUrls(i+1, tempUrl.visited.url, tempUrl.visited.weight);
			}
		}
	xhr.send();
}
getTenUrls();

function printUrls(value, url, popularity){
	var htmlList = $("#urlList");
	htmlList.append('<li>' + value + ': ' + url + " | " + popularity + '</li>');
}