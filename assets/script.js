/// fuelApiUrl 
var maxresults = "&maxresults=10";
var sortkey = "&sortkey=price";
var sortorder = "&sortorder=asc";
/// fuelApiUrl prox = latitude, longitude, radius in meters
var userProxInput = document.querySelector("select").value;
var prox = "&prox=" + userProxInput;
/// fuelApiUrl imagedimensions = w32-h32 (size of brand icon)
var imagedimensions = "&imagedimensions=";
/// fuelApiUrl fueltype(s): 1 = Diesel, 2 = Regular, 3 = Mid-grade, 4 = Premium
var fueltype = "";

var fuelApiUrl = "https://fuel-v2.cc.api.here.com/fuel/stations.json?app_id={}&app_code={}" + maxresults + sortkey + sortorder + prox + fueltype; 

document.querySelector("#search").addEventListener("click", function(event) {
    targetButton = event.target;

    var searchResultDiv = document.createElement("div");
    searchResultDiv.setAttribute("id","searchResultDiv");

    var brandName = document.createElement("h2");
    brandName.textContent = "Brand Name";
    searchResultDiv.appendChild(brandName);

    var stationAddress = document.createElement("h3");
    stationAddress.textContent = "Station Address";
    searchResultDiv.appendChild(stationAddress);

    var stationDistance = document.createElement("h3");
    stationDistance.textContent = "Station Distance";
    searchResultDiv.appendChild(stationDistance);

    var fuelPrice = document.createElement("h1");
    fuelPrice.textContent = "Fuel Price";
    searchResultDiv.appendChild(fuelPrice);

    document.querySelector("#resultContainer").appendChild(searchResultDiv);
})