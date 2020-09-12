var apikey = "596f364d353432589b50b3b909cdcca6"

var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#searchInput");
var cityInput = document.querySelector("#city-list")




function cityName(event) {
    event.preventDefault();
    // get value from input element
    var city = searchInput.value.trim();
    console.log(city);
    cityHistory();
    renderWeather(city);
}

function cityHistory() {
    // create list item for each city
    var cityListItemEl = document.createElement("li")

    cityListItemEl.classList = "list-group-item"
    cityListItemEl.textContent = searchInput.value;
    cityListItemEl.setAttribute("id", "list-btn")


    cityInput.appendChild(cityListItemEl);
}

function renderWeather(city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apikey;
    fetch(forecastURL)
        .then(function(response) {
                if (response !== 200) {
                    console.log("Error with API Key")
                } else {
                    response.json()
                });

            .then(function(data) {
                console.log(data)
                var latitude = data.city.coord.lat
                var longitude = data.city.coord.lon
                return fetch('https://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + '&appid=' + apikey)
                    .then(function(uvResponse) {
                        uvResponse.json()
                            .then(function(uvData) {
                                console.log(uvData)
                                displayWeather(data, city, uvData)
                            });
                    });
            })
        })




};



function displayWeather(data, city, uvData) {

    //Removes the previous inputs so they dont just stack information
    document.querySelector(".weather-data").textContent = "";
    document.querySelector(".card-deck").innerHTML = "";

    //Double check to make sure the city 
    console.log(city)

    var conditions = data.list[0];
    console.log(conditions)

    var currentTemp = data.list[0].main.temp;
    console.log(currentTemp)

    var currentHumid = data.list[0].main.humidity;
    console.log(currentHumid)

    var currentWind = data.list[0].wind.speed;
    console.log(currentWind)

    var currentUv = uvData.value;
    console.log(currentUv)

    var currentDate = moment().format("M/D/YYYY")

    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />"
        // console.log(iconDisplay)
        // console.log(currentDate)
    var cityLocation = document.createElement("h2")
    cityLocation.classList = "bold-city"
    cityLocation.innerHTML = city + ": " + currentDate + iconDisplay

    var cityTemp = document.querySelector(".weather-data")
    var showConditions = document.createElement("p")
    showConditions.classList = "temp"
    showConditions.innerHTML = "<span> Temprature: " + currentTemp + "</span>";

    var showHumidity = document.createElement("p")
    showHumidity.classList = "humid"
    showHumidity.innerHTML = "<span> Humidity: " + currentHumid + "% </span>";

    var showWind = document.createElement("p")
    showWind.classList = "wind"
    showWind.innerHTML = "<span> Wind Speed: " + currentWind + " MPH <span>";

    var uvIndex = document.createElement("p")
    uvIndex.classList = "uvi"
    uvIndex.innerHTML = "<span> <strong> UV Index: " + currentUv + " </strong> </span>"

    cityTemp.appendChild(cityLocation)
    cityTemp.appendChild(showConditions)
    cityTemp.appendChild(showHumidity)
    cityTemp.appendChild(showWind)
    cityTemp.appendChild(uvIndex)

    var cardDeck = document.querySelector(".card-deck")


    for (var i = 0; i < data.list.length; i += 8) {
        var fiveDay = (data.list[i])

        var dayDate = moment.unix(fiveDay.dt).format("M/D/YYYY")

        var card = document.createElement("div")
        card.classList = "card bg-primary"

        var cardBody = document.createElement("div")
        cardBody.classList = "card-body"

        var dateDisplay = "<p>" + dayDate + "</p>"

        var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + fiveDay.weather[0].icon + "@2x.png' />"

        // console.log(iconDisplay)
        var tempDisplay = "<p> Temp: " + Math.floor(fiveDay.main.temp) + "</p>"
        var humidityDisplay = "<p> Humidity: " + fiveDay.main.humidity + "</p>"
        cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay

        card.appendChild(cardBody)
        cardDeck.appendChild(card)


    }
}

searchBtn.addEventListener("click", cityName);

$(searchInput).keyup(function(event) {
    if (event.keyCode === 13) {
        $(searchBtn).click();
    }
});

$(list - btn).addEventListener("click", cityName);
$(searchInput).keyup(function(event) {
    if (event.keyCode === 13) {
        $(list - btn).click();
    }
});