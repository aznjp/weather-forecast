var apikey = "596f364d353432589b50b3b909cdcca6"
var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#searchInput");
var cityInput = document.querySelector("#city-list")


var clickForCity = document.querySelector(".list-group-item")

var searchHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = searchInput.value.trim();
    console.log(city);
    clickCity(city);
}

function clickCity(city) {
    if (city) {
        renderWeather(city);
        cityHistory(city);

        searchInput.value = "";
    } else {
        alert("Please select a City")
    }
}

function cityHistory(city) {
    // create list item for each city
    var cityListItemEl = document.createElement("li")

    cityListItemEl.classList = "list-group-item"
    cityListItemEl.textContent = city + "";


    cityInput.appendChild(cityListItemEl)
}

function renderWeather(city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apikey;
    fetch(forecastURL)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    console.log(data)
                });
        });
};


searchBtn.addEventListener("click", searchHandler);