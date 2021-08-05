var restaurantInfoPlusDistances

function inputToGeocode() {
  localStorage.removeItem("originLat");
  localStorage.removeItem("originLon");
  localStorage.removeItem("cityInput");

  var cityInput = $("input").val();
  localStorage.setItem("cityInput", cityInput); 

  var geocodeApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput + "&key=AIzaSyBQpg6lWd6ZoaQPZcGm-orGfyXu_9vZM-k";
  fetch(geocodeApiUrl).then(function (response) {
      response.json().then(function (data) {
          localStorage.setItem("originLat", data.results[0].geometry.location.lat);
          localStorage.setItem("originLon", data.results[0].geometry.location.lng);
      });
    });
};

function fetchRestaurants() {

  (async () => {
    const response = await fetch(
      "https://parseapi.back4app.com/classes/MichelinGuide_Restaurants?limit=695", // &order=-Stars (desc), &order=Stars (asc), &order=-Price (desc), &order=Price(asc)
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

  restaurantInfoPlusDistances = [];

  for (let i = 0; i < restaurantData.results.length; i++) {

    restaurantInfoPlusDistances.push(
      {
        stars: restaurantData.results[i].Stars,
        name: restaurantData.results[i].name,
        location: restaurantData.results[i].city + ", " + restaurantData.results[i].region,
        distance: distanceBetween(+localStorage.getItem("originLat"), +localStorage.getItem("originLon"), +restaurantData.results[i].Location.latitude, +restaurantData.results[i].Location.longitude),
        price: restaurantData.results[i].price
      }
    )
}

  var sortedRestaurants = restaurantInfoPlusDistances.sort(function(a, b) {
    return a.distance - b.distance;
  })

  var trimmedRestaurants = sortedRestaurants.slice(0,20);

  var sortBy = document.querySelector("select").value;

  if (sortBy == "starsHighLow") {
    trimmedRestaurants = trimmedRestaurants.sort(function(a, b) {
      return b.stars - a.stars;
    });
  } else if (sortBy == "starsLowHigh") {
    trimmedRestaurants = trimmedRestaurants.sort(function(a, b) {
      return a.stars - b.stars;
    });
  } else if (sortBy == "priceHighLow") {
    trimmedRestaurants = trimmedRestaurants.sort(function(a, b) {
      return b.price.length - a.price.length;
    });
  } else if (sortBy == "priceLowHigh") {
    trimmedRestaurants = trimmedRestaurants.sort(function(a, b) {
      return a.price.length - b.price.length;
    });
  }


  for (let i = 0; i < trimmedRestaurants.length; i++) {

    var card = document.createElement("div");
    card.setAttribute("class", 'card cell small-4');
    card.setAttribute('style', 'width:300px;');

    var cell = document.createElement("div");
    cell.setAttribute("class","cell");

    var stars = document.createElement("div");
    stars.setAttribute("class", "card-divider");
    stars.setAttribute("id","restaurantStars");
    stars.textContent = trimmedRestaurants[i].stars;
    cell.appendChild(stars);

    var searchResultDiv = document.createElement("div");
    searchResultDiv.setAttribute("class","card-section");

    var restaurantName = document.createElement("div");
    restaurantName.setAttribute("id", "restaurantName");
    restaurantName.textContent = trimmedRestaurants[i].name;
    searchResultDiv.appendChild(restaurantName);

    var restaurantLocation = document.createElement("div");
    restaurantLocation.setAttribute("id", "restaurantLocation");
    restaurantLocation.textContent = trimmedRestaurants[i].location;
    searchResultDiv.appendChild(restaurantLocation);

    var restaurantCoordinates = document.createElement("div");
    restaurantCoordinates.setAttribute("id", "restaurantCoordinates");
    restaurantCoordinates.textContent = Math.floor(trimmedRestaurants[i].distance / 1609).toString() + " miles away";
    searchResultDiv.appendChild(restaurantCoordinates);

    var pricePoint = document.createElement("div");
    restaurantLocation.setAttribute("id", "restaurantPrice");
    pricePoint.textContent = trimmedRestaurants[i].price;
    searchResultDiv.appendChild(pricePoint);

    cell.appendChild(stars);
    cell.appendChild(searchResultDiv);
    card.appendChild(cell);
    document.querySelector("#resultsContainer").appendChild(card);
  }
})();
}

document.querySelector("#search").addEventListener("click", function(event) {
  document.querySelector("#resultsContainer").innerHTML = "";

  inputToGeocode();

  fetchRestaurants();
});


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

function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:34.0522,lng:-118.2437},
    zoom: 13,
  });

  const input = document.getElementById('location');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls.push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

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
      });
    }
  }
} 