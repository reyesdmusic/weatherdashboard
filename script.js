
$(document).ready(function(data) {

    var userCity;
    var storedUserHistory = [];

    renderMain();
    renderDate();
    storeOldUserCity();
  

    function renderMain() {

    $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=ff3af498ead27371a1dcb730a1c7e5a7&units=imperial", function(data) {
    

    console.log(data);
    
    var icon = data.weather[0].icon;

    console.log(icon);

    var temp = data.main.temp;

    $("#temperature-li").html("Temp: " + temp + " F");

    console.log(temp);

    var wind = data.wind.speed;

    $("#wind-li").html("Wind: " + wind + " mph");

    console.log(wind);

    var humidity = data.main.humidity;

    $("#humidity-li").html("Humidity: " + humidity + "%");

    console.log(humidity);

    var lon = data.coord.lon;

    console.log(lon);

    var lat = data.coord.lat;

    console.log(lat);

    var name = data.name;

    $("#city-name").html(name);

    console.log(name);

    storeUserInfo(name);

    latLonApi = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=ff3af498ead27371a1dcb730a1c7e5a7&lat=" + lat + "&lon=" + lon;

  getLatLon();

 

    
});

}

function getLatLon() {
    $.getJSON(latLonApi, function(data) {
    
        var uvi = data[0].value;
    
    
        console.log(uvi);
    
        $("#uvi-li").html("UV Index: " + uvi);
    
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
}

    $("#search-button").on("click", function(event){
        event.preventDefault();
        userCity = $("#user-search").val().trim();
        if (userCity == null) {
            return;
        }
        else {
        console.log(userCity);
        }

        renderMain();
        $("#user-search").val("");
    })

    function renderDate() {
    let m = moment().format("HH");
    let day = moment().format("dddd");
    let date = moment().format("LL");
    $("#date").html(day + ", " + date);
    }

    function storeUserInfo(x) {
        storedUserHistory.unshift(x);
        localStorage.setItem('userCityHistory', JSON.stringify(storedUserHistory));
        storeOldUserCity();
     }

 

function storeOldUserCity() {
    var oldUserCity = JSON.parse(localStorage.getItem("userCityHistory"));
    $("#user-history-list").html("");

    if (oldUserCity.length >= 10) {
        for (i=0; i < 10; i++) {
            storedUserHistory.push(oldUserCity[i]);
            $("#user-history-list").append("<li class=city-li><button>" + storedUserHistory[i] + "</button></li>");
    
        }}
    else {
    for (i=0; i < oldUserCity.length; i++) {
    storedUserHistory.push(oldUserCity[i]);
    $("#user-history-list").append("<li class=city-li><button>" + storedUserHistory[i] + "</button></li>");
}
console.log(storedUserHistory);

    

}}
  
});
  