/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    
    
    getLocation();
        
    
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};



//Geo Location function
function getLocation(){
        navigator.geolocation.getCurrentPosition(geoCallback, onError)
    }

var latitude;
var longitude;




function geoCallback(position){
 
    
     latitude = position.coords.latitude;
     longitude = position.coords.longitude;

    //calling the update map function and passing the latitute and longitute
    updateMap(latitude, longitude);
//
//    //calling the openCage function and passing the latitute and longitute
    openCage(latitude, longitude);

    document.getElementById('geo').innerHTML =
             "<br>"+ 'Latitude: '          + position.coords.latitude          + '<br>' +  
             "<br>"+'Longitude: '         + position.coords.longitude         + '<br>' +
             "<br>"+'Altitude: '          + position.coords.altitude          + '<br>' + "<br>";
    
    
//    console.log(position.coords.latitude);
//    console.log(position.coords.longitude);
            }

    function onError(message){
        
        console.log(message);

    }


//Calling Google Maps
function initMap() {

}

//Update function
function updateMap(latitude, longitude){
            var point = {lat: latitude, lng: longitude};  
            
            var map = new
            google.maps.Map(document.getElementById('map'),
            { zoom: 14,
                center: point
            });
            var marker = new google.maps.Marker({
                position: point,
            map: map });

        }






// City Location API


var country;
var city;

function openCage(latitude, longitude){

    var http = new XMLHttpRequest();
    
    //passed parameters in API for Latiture and Longitude for Geolocation
    const mySuperUrl =
    'https://api.opencagedata.com/geocode/v1/json?q='+latitude+'+'+longitude+'&key=830f6a1455954190849f27040584f835&language=en&pretty=1';
    http.open("GET", mySuperUrl);
    http.send();
    
    http.onreadystatechange = (e) => {
        var response = http.responseText
        var responseJSON = JSON.parse(response);
        
        
        city = responseJSON.results[0].components.city;
        console.log(city);

        country = responseJSON.results[0].components.country;
        console.log(country);

                
        currency = responseJSON.results[0].annotations.currency.iso_code;
        console.log(currency);
        
                //calling conversion rate function here can passing the parameter or currency.
        getPrice(currency);

        //calling weather API here
        weatherApi();

        
        
        
         document.getElementById('maincountry').innerHTML = country  ; 
        document.getElementById('maincity').innerHTML = city  ; 



        }

}

//Weather

 var showmainweather;
var showtemp;
function weatherApi(){


    

    console.log(latitude);
    console.log(longitude);
    
    
var http = new XMLHttpRequest();
const url =

    'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=248c67120e4309546841d826ad24e67a';


    
    
http.open("GET", url);
http.send();

http.onreadystatechange = (e) => {
    var response = http.responseText
    var responseJSON = JSON.parse(response);
    
    

    //getting the weather array and take the [0] object from array from API data
    var weather = responseJSON.weather[0].main;
    var weatherdetail = responseJSON.weather[0].description;
    var currentArea = responseJSON.name;
    
    
    var temp = responseJSON.main.temp;
    
    
    var cel = 273.15;

    
    var actual_Description = temp - cel;


    
    
    showmainweather = " Over All Weather of "+city+" is "+ weather;
    var showcurrentlocationArea = "You are currently in "+currentArea;
     showtemp="The temprature of "+currentArea+" is "+actual_Description.toFixed(1) + "°C";
    var showlocationweather= "The actual weather of "+currentArea+" is "+ weatherdetail ;
    
    document.getElementById('weather').innerHTML = showmainweather;

    document.getElementById('temperature_in_Celsius').innerHTML = showtemp;


    document.getElementById('currenctlocation').innerHTML = showcurrentlocationArea;


    document.getElementById('locationweather').innerHTML = showlocationweather;
    
    console.log(showmainweather);
    console.log(showcurrentlocationArea);
    console.log(showtemp);
    console.log(showlocationweather);
    
    



    
    }

}





//Getting conversion rate from API
var price;

function getPrice(currency){

var http = new XMLHttpRequest();
   //get  the data from Api
   http.open("GET", 'http://apilayer.net/api/live?access_key=db560b36bd079df3edffa88b5af38d92&currencies='+currency+'&source=USD&format=1');
   http.send(); 
   http.onreadystatechange = (e) => {
       var response = http.responseText   
       var responseJSON = JSON.parse(response); 
       var data = responseJSON.quotes; 
       console.log(data);
     var priceLabel = "USD"+currency;

       price = data[priceLabel];
       console.log(price);
    
   }

}



// Coverting into Local Currency

function priceConvert(){


    var text = document.getElementById('inpurPrice').value; 
    console.log(text);

    
    var output ="This is the current rate of "+currency+" in USD "+text * price;
    
    document.getElementById('output').innerHTML = output; //shows the conversion

    console.log(output);

}



//Storing File

function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

function fileSystemCallback(fs){
    // Displaying result in the console
    console.log('file system open: ' + fs.name);

    // Displaying in front end
//    var toFronEnd = 'file system open: ' + fs.name;
//    document.getElementById('file').innerHTML = toFronEnd;

    // Name of the file I want to create
    var fileToCreate = "newPersistentFile.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){
    // Display in the console
    console.log("fileEntry is file?" + fileEntry.isFile.toString());

    // Displaying in front end
//    var toFrontEnd = document.getElementById('file').innerHTML;
//    toFrontEnd += "fileEntry is file?" + fileEntry.isFile.toString();
//    document.getElementById('file').innerHTML = toFrontEnd;
    
    var dataObj = new Blob(['Country ',country,' City ',city,' Temperature ',showtemp,' Weather ',showmainweather], { type: 'text/plain' });
    // Now decide what to do
    // Write to the file
    writeFile(fileEntry, dataObj);

    // Or read the file
    readFile(fileEntry);
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['Hello'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}

// Let's read some files
function readFile(fileEntry) {

    // Get the file from the file entry
    fileEntry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function() {

            
            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);
            
            var show_Save_Data = this.result;
            
            document.getElementById('show_Save_Data').innerHTML=show_Save_Data;

        };

    }, onError);
}


