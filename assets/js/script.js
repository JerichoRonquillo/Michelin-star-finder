var baseApiUrl

var restaurantInfoPlusDistances = [];

function editURLGivenInput() {
  baseApiUrl = 'https://parseapi.back4app.com/classes/MichelinGuide_Restaurants?limit=10';

  var sortBy = document.querySelector("select").value;

  if (sortBy == "starsHighLow") {
    baseApiUrl += "&order=-Stars";
  } else if (sortBy == "starsLowHigh") {
    baseApiUrl += "&order=Stars";
  } else if (sortBy == "priceHighLow") {
    baseApiUrl += "&order=-price";
  } else if (sortBy == "priceLowHigh") {
    baseApiUrl += "&order=price";
  }
}
function fetchRestaurants() {
  (async () => {
    const response = await fetch(
      baseApiUrl, // &order=-Stars (desc), &order=Stars (asc), &order=-Price (desc), &order=Price(asc)
    {
      headers: {
        'X-Parse-Application-Id': 'i3w1okhZrfHaMxNFmpor1bzgo7jVF8g8dxbl245e', // This is your app's application id
        'X-Parse-REST-API-Key': 'l2cZa5ij4wJio7VXQLYZSgolUaSUb1rau3qBc9OC', // This is your app's REST API key
      }
    }
    );
  const data = await response.json(); // Here you have the data that you need
  localStorage.setItem("data", JSON.stringify(data));
  var restaurantData = JSON.parse(localStorage.getItem("data")) || {results:[]};
  // console.log(restaurantData.results[1].Stars);

  for (let i = 0; i < restaurantData.results.length; i++) {
    var card = document.createElement("div");
    card.setAttribute("class", 'card cell small-4');
    card.setAttribute('style', 'width:300px;');

    var cell = document.createElement("div");
    cell.setAttribute("class","cell");

    var stars = document.createElement("div");
    stars.setAttribute("class", "card-divider");
    stars.setAttribute("id","restaurantStars");
    console.log(restaurantData.results[i].Stars);
    stars.textContent = restaurantData.results[i].Stars;
    cell.appendChild(stars);

    var searchResultDiv = document.createElement("div");
    searchResultDiv.setAttribute("class","card-section");

    var restaurantName = document.createElement("div");
    restaurantName.setAttribute("id", "restaurantName");
    restaurantName.textContent = restaurantData.results[i].name;
    searchResultDiv.appendChild(restaurantName);

    var restaurantLocation = document.createElement("div");
    restaurantLocation.setAttribute("id", "restaurantLocation");
    restaurantLocation.textContent = restaurantData.results[i].city + ", " + restaurantData.results[i].region;
    searchResultDiv.appendChild(restaurantLocation);

    var restaurantCoordinates = document.createElement("div");
    restaurantCoordinates.setAttribute("id", "restaurantCoordinates");
    restaurantCoordinates.textContent = restaurantData.results[i].Location.latitude + ", " + restaurantData.results[i].Location.longitude;
    searchResultDiv.appendChild(restaurantCoordinates);

    var pricePoint = document.createElement("div");
    restaurantLocation.setAttribute("id", "restaurantPrice");
    pricePoint.textContent = restaurantData.results[i].price;
    searchResultDiv.appendChild(pricePoint);

    cell.appendChild(stars);
    cell.appendChild(searchResultDiv);
    card.appendChild(cell);
    document.querySelector("#resultsContainer").appendChild(card);
}

inputToGeocode();

  })();
}

document.querySelector("#search").addEventListener("click", function(event) {
  document.querySelector("#resultsContainer").innerHTML = "";

  editURLGivenInput();

  fetchRestaurants();
});


function inputToGeocode() {
  localStorage.removeItem("originLat");
  localStorage.removeItem("originLon");
  localStorage.removeItem("cityInput");

  cityInput = $("input").val();
  localStorage.setItem("cityInput", cityInput);
  console.log(cityInput);

  var geocodeApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=AIzaSyDLVE-nNKtlYdWbiVu1akeeGNtZ9fZKTAw";
  fetch(geocodeApiUrl).then(function (response) {
      response.json().then(function (data) {
          console.log(data);
          localStorage.setItem("originLat", data.results[0].geometry.location.lat);
          localStorage.setItem("originLon", data.results[0].geometry.location.lng);
      });
    });

  // distanceBetween(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, )
};

function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;  // in metres

  return d;
};

function initMap(){
  var options = {
    zoom: 13,
    center:{lat:34.0522,lng:-118.2437}
  }

  var map = new 
  google.maps.Map(document.getElementById('map'), options);

  fetchRestaurants();
  var data = JSON.parse(localStorage.getItem("data"));
for (let i = 0; i <= data.results.length; i++) {
  var latitude = data.results[i].Location.latitude;
  var longitude = data.results[i].Location.longitude;
  var restaurantName = data.results[i].name;
  console.log[latitude];

  new google.maps.InfoWindow({
    content: restaurantName,
  })
  
  addMarker({lat:latitude,lng:longitude});

  function addMarker(coords){
    var marker = new google.maps.Marker({
      position:coords,
      map,
    })
  }
    marker.addEventListener('click', function(){
      InfoWindow.open(map,marker);
    })
} 
}
