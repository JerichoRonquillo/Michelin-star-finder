/// fuelApiUrl 
var maxresults = "&maxresults=10";
var sortkey = "&sortkey=price";
var sortorder = "&sortorder=asc";
/// fuelApiUrl prox = latitude, longitude, radius in meters
var prox = "&prox=" + userProxInput;
/// fuelApiUrl imagedimensions = w32-h32 (size of brand icon)
var imagedimensions = "&imagedimensions=";
/// fuelApiUrl fueltype(s): 1 = Diesel, 2 = Regular, 3 = Mid-grade, 4 = Premium
var fueltype = "";

var fuelApiUrl = "https://fuel-v2.cc.api.here.com/fuel/stations.json?app_id={}&app_code={}" + maxresults + sortkey + sortorder + prox + fueltype; 