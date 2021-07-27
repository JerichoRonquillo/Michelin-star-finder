(async () => {
    const response = await fetch(
        'https://parseapi.back4app.com/classes/MichelinGuide_Restaurants?limit=1000&order=-Stars',
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

document.querySelector("#search").addEventListener("click", function(event) {
    targetButton = event.target;

    var data = JSON.parse(localStorage.getItem("data"));
    console.log(data.results.length)

    var searchResultDiv = document.createElement("div");
    searchResultDiv.setAttribute("id","searchResultDiv");

    for (let i = 0; i <= data.results.length; i++) {
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

        var restaurantStars = document.createElement("h1");
        restaurantStars.textContent = data.results[i].Stars;
        searchResultDiv.appendChild(restaurantStars);

        document.querySelector("#resultContainer").appendChild(searchResultDiv);       
}
})