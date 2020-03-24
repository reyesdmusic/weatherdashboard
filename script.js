
$(document).ready(function(data) {

    // userCity will be equal to the city the user searches for, which is then put into the API.

    var userCity;

    // storedUserHistory will contain the user's previous search history as well as new searches. 

    var storedUserHistory = [];

     // forecastDays contains numbers used in the Forecast API call. Each number other than zero represents the arrays containing weather info at noon for each of the next five days

    var forecastDays = [0, 3, 11, 19, 27, 35];

    // thisIcon will be equal to the icon code pulled from the API.

    var thisIcon;

    // the following is each animated icon, for smaller ones for the forecast and then larger ones for the main info div.

    var sunny = '<div class="icon sunny" style="font-size: 7px">' +
                '<div class="sun">' +
                '<div class="rays"></div>' +
                '</div>' +
                '</div>';
    var cloudy = '<div class="icon cloudy" style="font-size: 7px">' +
                '<div class="cloud"></div>' +
                '<div class="cloud"></div>' +
                '</div>';
    var showers = '<div class="icon rainy" style="font-size: 7px">' +
                '<div class="cloud"></div>' +
                '<div class="rain"></div>' +
                '</div>';
    var sunShowers = '<div class="icon sun-shower" style="font-size: 7px">' +
                '<div class="cloud"></div>' +
                '<div class="sun">' +
                '<div class="rays"></div>' +
                '</div>' +
                '<div class="rain"></div>' +
                '</div>';
    var thunderstorm = '<div class="icon thunder-storm" style="font-size: 7px">' +
                '<div class="cloud"></div>' +
                '<div class="lightning">' +
                '<div class="bolt"></div>' +
                '<div class="bolt"></div>' +
                '</div>' +
                '</div>';
    var snowy = '<div class="icon flurries" style="font-size: 7px">' +
                '<div class="cloud"></div>' +
                '<div class="snow">' +
                '<div class="flake"></div>' +
                '<div class="flake"></div>' +
                '</div>' +
                '</div>';

    // large icons
    
    var sunny1 = '<div class="icon sunny" style="font-size: 15px">' +
    '<div class="sun">' +
    '<div class="rays"></div>' +
    '</div>' +
    '</div>';
    var cloudy1 = '<div class="icon cloudy" style="font-size: 15px">' +
    '<div class="cloud"></div>' +
    '<div class="cloud"></div>' +
    '</div>';
    var showers1 = '<div class="icon rainy" style="font-size: 15px">' +
    '<div class="cloud"></div>' +
    '<div class="rain"></div>' +
    '</div>';
    var sunShowers1 = '<div class="icon sun-shower" style="font-size: 15px">' +
    '<div class="cloud"></div>' +
    '<div class="sun">' +
    '<div class="rays"></div>' +
    '</div>' +
    '<div class="rain"></div>' +
    '</div>';
    var thunderstorm1 = '<div class="icon thunder-storm" style="font-size: 15px">' +
    '<div class="cloud"></div>' +
    '<div class="lightning">' +
    '<div class="bolt"></div>' +
    '<div class="bolt"></div>' +
    '</div>' +
    '</div>';
    var snowy1 = '<div class="icon flurries" style="font-size: 15px">' +
    '<div class="cloud"></div>' +
    '<div class="snow">' +
    '<div class="flake"></div>' +
    '<div class="flake"></div>' +
    '</div>' +
    '</div>';


    pullUpSearchHistory();
    renderSearchHistory();
    renderDate();
    renderLastSearched();

    $("#clear-history").hide();
    
    //Render weather info and forecast from API search as well user's previously searched history along with the new search entry.

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

        whichMainIcons(icon);
        $("#main-icon").html("");
        $("#main-icon").append(thisIcon);

        getLatLon();
        renderForecast();
        
        });

    }

    // The UVI index information can only be pulled from an API search using lat and lon. So this pulls the info from that API call (in renderMain function) then determines severity level and creates an li with appropriate info and class.

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
    
        if (uvi <= 10 && uvi > 7) {
            $("#uvi-li").attr("class", "very-high");
        } 
        
        if (uvi > 10) {
            $("#uvi-li").attr("class", "extreme"); 
        }
        });
    }

    // Render the current date, pulling info from moment.js.

    function renderDate() {
        let m = moment().format("HH");
        let day = moment().format("dddd");
        let date = moment().format("LL");
        $("#date").html(day + ", " + date);
    }
  
    // As long as storedUserHistory is not null, search to see if x, the newly searched city, is already in there. If so, remove it. Either way, add the newly searched entry to the front of the array. Then clear localStorage and save the new storedUserHistory array which inclueds the previously searched entries and this new one.

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

    // If nothing in localStorage, stop function. If there are more than ten entries in there only pull up the most recent 10. If there are less than ten, pull up all of them.

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
    }}

    // Render user's search history and show clear button.

    function renderSearchHistory() {
        var allUserCities = JSON.parse(localStorage.getItem("userCityHistory"));

        $("#user-history-list").html("");

        if (allUserCities === null) {
            return;
        }

        else if (allUserCities.length >= 10) {
            for (i=0; i < 10; i++) {
                $("#user-history-list").append("<li><button class=city-li>" + allUserCities[i] + "</button></li>");
                $("#clear-history").show();
        }}

        else {
            for (i=0; i < allUserCities.length; i++) {
                $("#user-history-list").append("<li><button class=city-li>" + allUserCities[i] + "</button></li>"); 
                $("#clear-history").show();       
            }

    }}

    // Render the info and forecast for city last searched for by the user.

    function renderLastSearched() {
    
        var allUserCities = JSON.parse(localStorage.getItem("userCityHistory"));

        if (allUserCities === null) {
        renderNoHistory();
        }

        else {
        userCity = allUserCities[0];
        renderMain();
        }
    }

    // Create 5 divs with the appropriate classes and display in li's the forecast info from the API.

    function renderForecast() {

        $("#forecast-info-panel").html("");

        $.getJSON("https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=ff3af498ead27371a1dcb730a1c7e5a7&units=imperial", function(data) {
                

        for (i=1; i <= 5; i++) {
            var x = forecastDays[i];

            var day1temp = data.list[x].main.temp;
            var day1humidity = data.list[x].main.humidity;
            var day1icon = data.list[x].weather[0].icon;
            let dayPlus1  = moment().add(i,'days').format("l");

            whichIcons(day1icon);
    
            $("#forecast-info-panel").append('<div class="left left-align col l2 m12 s12" id="day-1-card">' + thisIcon + dayPlus1 + '<li> Temp: ' + day1temp + ' F </li> <li> Humidity: ' + day1humidity + '% </li>' + '</div>');
        }
        
    });

    }

    // Determine which icons to render based on icon code from API.

    function whichIcons(x) {
        if (x === "01d" || x === "01n") {
            thisIcon = sunny;
        }
        else if (x === "03d" || x === "03n" || x === "04d" || x === "04n" || x === "50d" || x === "50n" || x === "02d" || x === "02n") {
            thisIcon = cloudy;
        }
        else if (x === "09d" || x === "09n") {
        thisIcon = showers;
        }

        else if (x === "10d" || x === "10n") {
            thisIcon = sunShowers;
        }
        else if (x === "11d" || x === "11n") {
            thisIcon = thunderstorm;
        }
        else  {
            thisIcon = snowy;
        }
    }

    // Determine which icons to render for the Main Info div.

    function whichMainIcons(x) {
        if (x === "01d" || x === "01n") {
            thisIcon = sunny1;
        }
        else if (x === "03d" || x === "03n" || x === "04d" || x === "04n" || x === "50d" || x === "50n" || x === "02d" || x === "02n") {
            thisIcon = cloudy1;
        }
        else if (x === "09d" || x === "09n") {
        thisIcon = showers1;
        }

        else if (x === "10d" || x === "10n") {
            thisIcon = sunShowers1;
        }
        else if (x === "11d" || x === "11n") {
            thisIcon = thunderstorm1;
        }
        else  {
            thisIcon = snowy1;
        }
    }

    // If there is no previously searched history, render this basic format.

    function renderNoHistory() {
        $("#temperature-li").html("Temp: " );

        $("#wind-li").html("Wind: " );

        $("#humidity-li").html("Humidity: " );

        $("#city-name").html("City");

        $("#main-icon").html(sunny1);

        $("#uvi-li").attr("class", "mild").html("UV Index: ");

        $("#forecast-info-panel").html("");

        for (i=1; i <= 5; i++) {
            var x = forecastDays[i];

            let dayPlus1  = moment().add(i,'days').format("l");

            $("#forecast-info-panel").append('<div class="left left-align col l2 m12 s12" id="day-1-card">' + thunderstorm + dayPlus1 + '<li> Temp: ' + '</li> <li> Humidity: ' + ' </li>' + '</div>');    
        }

    }

    // Upon clicking search, if something was typed in the input, render the information and clear the search input.

    $("#search-button").on("click", function(event){
        event.preventDefault();
        userCity = $("#user-search").val().trim();
        if (userCity == null) {
            return;
        }
        else {

        renderMain();
        $("#user-search").val("");

        }
    })

    // Upon clicking a previously searched city in the search history div, remove the city from the storedUserHistory div and place it at the top, clear local storage and save the search history with the new order, then render the info for that city.

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

    // Clear storedUserHistory, localStorage, search history div and hide clear button.

    $("#clear-history").on("click", function() {
        localStorage.clear();
        $("#user-history-list").html("");
        storedUserHistory = [];
        $("#clear-history").hide();   
    })

  
});

  