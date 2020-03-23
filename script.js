
$(document).ready(function(data) {

   
    
    var userCity;
    var storedUserHistory = [];

    
    pullUpSearchHistory();
    renderSearchHistory();
    renderDate();
    renderLastSearched();
    hideIcons();
   
    

    function renderMain() {

    $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=ff3af498ead27371a1dcb730a1c7e5a7&units=imperial", function(data) {
 
    var icon = data.weather[0].icon;

    var temp = data.main.temp;

    $("#temperature-li").html("Temp: " + temp + " F");

    var wind = data.wind.speed;

    $("#wind-li").html("Wind: " + wind + " mph");

    var humidity = data.main.humidity;

    $("#humidity-li").html("Humidity: " + humidity + "%");

    var lon = data.coord.lon;

    var lat = data.coord.lat;

    var name = data.name;

    $("#city-name").html(name);

    storeUserInfo(name);
    

    latLonApi = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=ff3af498ead27371a1dcb730a1c7e5a7&lat=" + lat + "&lon=" + lon;

  getLatLon();
  renderForecast();
 

    
});

}

function getLatLon() {
    $.getJSON(latLonApi, function(data) {
    
        var uvi = data[0].value;
    
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
        
        
        renderMain();
        $("#user-search").val("");

        }
    })

  

    $(document).on('click', '.city-li' , function(event){
        event.preventDefault();
        userCity = this.innerText;
        for (i=0; i < storedUserHistory.length; i++) {
            if (storedUserHistory[i] == userCity) {
                storedUserHistory.splice(i, 1);
            }}
        storedUserHistory.unshift(userCity);
        localStorage.clear();
        localStorage.setItem('userCityHistory', JSON.stringify(storedUserHistory));
        renderSearchHistory();
        renderMain();
    })

    function renderDate() {
    let m = moment().format("HH");
    let day = moment().format("dddd");
    let date = moment().format("LL");
    $("#date").html(day + ", " + date);
    }

    function storeUserInfo(x) {
        if (storedUserHistory !== null) {
        for (i=0; i < storedUserHistory.length; i++) {
        if (storedUserHistory[i] == x) {
            storedUserHistory.splice(i, 1);
        
        }}
        storedUserHistory.unshift(x);
        localStorage.clear();
        localStorage.setItem('userCityHistory', JSON.stringify(storedUserHistory));
        renderSearchHistory();
     }}

 
function pullUpSearchHistory() {
    var allUserCities = JSON.parse(localStorage.getItem("userCityHistory"));
    if (allUserCities === null) {
        return;
}
    else if (allUserCities.length >= 10) {
         for (i=0; i < 10; i++) {
        storedUserHistory.push(allUserCities[i]);          
        }}

    else {
        for (i=0; i < allUserCities.length; i++) {
        storedUserHistory.push(allUserCities[i]);          
        }

    }
}

function renderSearchHistory() {
    var allUserCities = JSON.parse(localStorage.getItem("userCityHistory"));

    $("#user-history-list").html("");

    if (allUserCities === null) {
        return;
}
    else if (allUserCities.length >= 10) {
         for (i=0; i < 10; i++) {
     $("#user-history-list").append("<li class=city-li><button>" + allUserCities[i] + "</button></li>");
        }}

    else {
        for (i=0; i < allUserCities.length; i++) {
            $("#user-history-list").append("<li class=city-li><button>" + allUserCities[i] + "</button></li>");        
        }

    }

}

function renderLastSearched() {
    var allUserCities = JSON.parse(localStorage.getItem("userCityHistory"));
    userCity = allUserCities[0];
    renderMain();
    
}

function renderForecast() {


    $.getJSON("https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=ff3af498ead27371a1dcb730a1c7e5a7&units=imperial", function(data) {


    var day1temp = data.list[3].main.temp;
    var day1humidity = data.list[3].main.humidity;
    var day1icon = data.list[3].weather[0].icon;
    let dayplus1  = moment().add(1,'days').format("l");
    $("#day1info").html("");
    $("#day1info").append(dayplus1);
    $("#day1info").append("<li> Temp: " + day1temp + " F </li>");
    $("#day1info").append("<li> Humidity: " + day1humidity + "% </li>");
    console.log(day1icon);




    var day2temp = data.list[11].main.temp;
    var day2humidity = data.list[11].main.humidity;
    var day2icon = data.list[11].weather[0].icon;
    let dayplus2  = moment().add(2,'days').format("l");
    $("#day2info").html("");
    $("#day2info").append(dayplus2);
    $("#day2info").append("<li> Temp: " + day2temp + " F </li>");
    $("#day2info").append("<li> Humidity: " + day2humidity + "% </li>");

    var day3temp = data.list[19].main.temp;
    var day3humidity = data.list[19].main.humidity;
    var day3icon = data.list[19].weather[0].icon;
    let dayplus3  = moment().add(3,'days').format("l");
    $("#day3info").html("");
    $("#day3info").append(dayplus3);
    $("#day3info").append("<li> Temp: " + day3temp + " F </li>");
    $("#day3info").append("<li> Humidity: " + day3humidity + "% </li>");

    var day4temp = data.list[27].main.temp;
    var day4humidity = data.list[27].main.humidity;
    var day4icon = data.list[27].weather[0].icon;
    let dayplus4  = moment().add(4,'days').format("l");
    $("#day4info").html("");
    $("#day4info").append(dayplus4);
    $("#day4info").append("<li> Temp: " + day4temp + " F </li>");
    $("#day4info").append("<li> Humidity: " + day4humidity + "% </li>");

    var day5temp = data.list[35].main.temp;
    var day5humidity = data.list[35].main.humidity;
    var day5icon = data.list[35].weather[0].icon;
    let dayplus5  = moment().add(5,'days').format("l");
    $("#day5info").html("");
    $("#day5info").append(dayplus5);
    $("#day5info").append("<li> Temp: " + day5temp + " F </li>");
    $("#day5info").append("<li> Humidity: " + day5humidity + "% </li>");
    
});

}

function hideIcons() {
    $("#sun1").hide();
    $("#cloud1").hide();
    $("#bolt1").hide();
    $("#snow1").hide();
    $("#rain1").hide();
}

function showIcons(x) {
    if (x === "01d" || x === "01n" || x === "02d" || x === "02n") {
        hideIcons(); $("#sun1").show();
    }
    else if (x === "03d" || x === "03n" || day1icon === "04d" || day1icon === "04n" || day1icon === "50d" || day1con === "50n") {
        hideIcons(); $("#cloud1").show();
    }
    else if (day1icon === "09d" || day1icon === "09n" || day1icon === "10d" || day1icon === "10n") {
        hideIcons(); $("#rain1").show();
    }
    else if (day1icon === "11d" || day1icon === "11n") {
        hideIcons(); $("#bolt1").show();
    }
    else  {
        hideIcons(); $("#cloud1").show();
    }
}
  
});

  