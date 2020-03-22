
$(document).ready(function(data) {

    $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=Miami,Florida&appid=ff3af498ead27371a1dcb730a1c7e5a7&units=imperial", function(data) {
    
    
    console.log(data);
    
    var icon = data.weather[0].icon;

    console.log(icon);

    var temp = data.main.temp;

    $("#temperature-li").append("Temp: " + temp + " F");

    console.log(temp);

    var wind = data.wind.speed;

    $("#wind-li").append("Wind: " + wind);

    console.log(wind);

    var humidity = data.main.humidity;

    $("#humidity-li").append("Humidity: " + humidity);

    console.log(humidity);

    var lon = data.coord.lon;

    console.log(lon);

    var lat = data.coord.lat;

    console.log(lat);

    var name = data.name;

    $("#city-name").text(name);

    console.log(name);

    latLonApi = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=ff3af498ead27371a1dcb730a1c7e5a7&lat=" + lat + "&lon=" + lon;

    $.getJSON(latLonApi, function(data) {
    
    var uvi = data[0].value;


    console.log(uvi);

    $("#uvi-li").append("UV Index: " + uvi);

    if (uvi <= 2 ) {
        $("#uvi-li").attr("class", "mild");
    }

    if (uvi <= 5 && uvi >2) {
        $("#uvi-li").attr("class", "moderate");
    }

    if (uvi <= 7 && uvi > 5) {
        $("#uvi-li").attr("class", "high");
    }

    if (uvi > 7) {
        $("#uvi-li").attr("class", "extreme");
    }

 
    
});
 
    
});



    $("#search-button").on("click", function(event){
        event.preventDefault();
        var userCity = $("#user-search").val().trim();
        if (userCity == null) {
            return;
        }
        else {
        console.log(userCity);
        }
    })


   
  
});
  