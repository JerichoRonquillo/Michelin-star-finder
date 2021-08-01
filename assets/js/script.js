var baseApiUrl

function editURLGivenInput() {
  baseApiUrl = 'https://parseapi.back4app.com/classes/MichelinGuide_Restaurants?limit=1000';

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
    })();
}

document.querySelector("#search").addEventListener("click", function(event) {
    document.querySelector("#resultsContainer").innerHTML = "";

    editURLGivenInput();

    fetchRestaurants();

    var data = JSON.parse(localStorage.getItem("data"));
    console.log(data.results.length)

    for (let i = 0; i <= data.results.length; i++) {
        var index = "Index" + i.toString();
        var searchResultDiv = document.createElement("div");
        searchResultDiv.setAttribute("id","searchResultDiv");
        searchResultDiv.setAttribute("id", index);

        var restaurantName = document.createElement("h2");
        restaurantName.textContent = data.results[i].name;
        searchResultDiv.appendChild(restaurantName);

        var restaurantLocation = document.createElement("h3");
        restaurantLocation.textContent = data.results[i].city + ", " + data.results[i].region;
        searchResultDiv.appendChild(restaurantLocation);

        var restaurantCoordinates = document.createElement("h3");
        restaurantCoordinates.textContent = data.results[i].Location.latitude + ", " + data.results[i].Location.longitude;
        searchResultDiv.appendChild(restaurantCoordinates);

        var pricePoint = document.createElement("h3");
        pricePoint.textContent = data.results[i].price;
        searchResultDiv.appendChild(pricePoint);

        var restaurantStars = document.createElement("h2");
        restaurantStars.textContent = data.results[i].Stars;
        searchResultDiv.appendChild(restaurantStars);

        document.querySelector("#resultsContainer").appendChild(searchResultDiv);
        
}
})

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