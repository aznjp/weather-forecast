var apikey = "596f364d353432589b50b3b909cdcca6"

var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#searchInput");
var cityInput = document.querySelector("#city-list");
var cityId = document.querySelector(".list-group");

var cityList = JSON.parse(localStorage.getItem("List")) || [];
// This variable pulls the information from the local storage otherwise it will create an empty array



function capitalWord(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    //function to make input value to have capital as it is inputed
}

function searchHandler(event) {
    event.preventDefault();
    var city = capitalWord(searchInput.value.trim());

    // Removes any empty strings from being inputted,
    // HOWEVER, it does not remove city values that are not real cities (will want to fix in the future)
    if (searchInput.value == "") {
        alert("Please put in valid city")
    } else {
        //push the input(city) into the empty array and then set the items into the local storage with the key List 
        var city = capitalWord(searchInput.value.trim());
        cityList.push(city);
        localStorage.setItem("List", JSON.stringify(cityList));
        // The appending function then starts with the parameter cityList for the array and pull those values out 
        cityListAppend(cityList);
        // The weather information is put into place to both pull all of the data from the weather API and also goes directly to the display function for information
        renderWeather(city);
        //This is to empty out the input HTML once the input is placed in
        searchInput.value = ""
    }
}


function resubmitCity(city) {
    // This is just a repeat of the function for renderWeather for all of the city items from history bar once they are clicked
    renderWeather(city);
    searchInput.value = "";
}


function cityListAppend() {
    // empties out the list group div which will hold all of the city input once they are finished
    $(cityInput).empty();
    // once empty the list items will then be pulled out from the local storage and then plugged into the list item as they are made
    for (var i = 0; i < cityList.length; i++) {

        var cityListItemEl = document.createElement("li")
        cityListItemEl.classList = "list-group-item mt-2"
        cityListItemEl.textContent = (cityList[i]);

        cityInput.prepend(cityListItemEl);
    }
}

async function renderWeather(city) {
    //The information is pulled from the input from earlier and goes through the openweathermap API 
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apikey;
    var weatherResponse = await fetch(forecastURL)
        // Once it has verified that the response is valid it will pull out the information 
    if (weatherResponse.status === 200) {
        var weatherData = await weatherResponse.json()

        // This data pulls out everything BUT the uv index which must be pulled from another apiURL using the latitude and longitude values pulled from original object
        var lat = weatherData.city.coord.lat
        var lon = weatherData.city.coord.lon

        var uvResponse = await fetch('https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apikey)

        var UVdata = await uvResponse.json()
            //Once finished they data will be pulled out from the UV value and then will be utilized in the displayWeather function to display all of the information from the array
        displayWeather(city, weatherData, UVdata);
    } else {
        throw new Error("The value inputed is not valid");
    }
}


function displayWeather(city, weatherData, UVdata) {
    //to ensure that the information deck isnt stacking on top of each other the divs are cleared prior to appending the new information
    document.querySelector(".weather-data").textContent = "";
    document.querySelector(".card-deck").innerHTML = "";

    var weatherArray = weatherData.list;
    console.log(weatherArray)

    var mainTemp = weatherData.list[0].main.temp;
    var mainHumid = weatherData.list[0].main.humidity;
    var windSpeed = weatherData.list[0].wind.speed;
    var uvIndex = UVdata.value;

    //moment.js is utilized to match the current days with the values inside of the API
    var Date = moment().format("MM/DD/YYYY")
    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + weatherData.list[0].weather[0].icon + "@2x.png' />"

    //The data is then appended to the current date weather block 
    var cityTemp = document.querySelector(".weather-data")

    var cityLocation = document.createElement("h2")
    cityLocation.innerHTML = city + ": " + Date + iconDisplay

    var dailyTemp = document.createElement("h3")
    dailyTemp.innerHTML =
        "<strong> Temperature: " + mainTemp +
        " &#8457 </br>" +
        "Humidity: " + mainHumid + "%" +
        "</br>" +
        "Wind Speed: " + windSpeed + " MPH" +
        "</br>" +
        "UV Index: <span id ='uvNumber'>" + uvIndex + "</span> </strong>"

    cityTemp.appendChild(cityLocation)
    cityTemp.appendChild(dailyTemp)

    //The UV value is then utilized to state whether the number values are severe, moderate or favourable by changing the color background of the span 
    if (uvIndex >= 8.6) {
        $('#uvNumber').addClass('severe')
    } else if (uvIndex >= 4 && uvIndex < 8.6) {
        $('#uvNumber').addClass('moderate')
    } else {
        $('#uvNumber').addClass('favourable')
    }

    var cardDeckEl = document.querySelector(".card-deck")


    //The for loop is utilized to append all of the cards into the card deck
    //The array holds 40 objects which holds information for every 3 hours for 5 days (Thus i+=8 for the same time every day)
    for (var i = 0; i < weatherArray.length; i += 8) {
        var dayIndex = (weatherArray[i])
        var dateOutput = moment.unix(dayIndex.dt).format("MM/DD/YYYY")

        var card = document.createElement("div")
        card.classList = "card bg-primary col-sm-12"

        var cardBody = document.createElement("div")
        cardBody.classList = "card-text col-12 text-center"

        var dateDisplay = "<h3>" + dateOutput + "</h3>"
        var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + dayIndex.weather[0].icon + "@2x.png' />"
        var tempDisplay = "<p> Temp: " + Math.floor(dayIndex.main.temp) + "</p>"
        var humidityDisplay = "<p> Humidity: " + dayIndex.main.humidity + "% </p>"
        cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay

        card.appendChild(cardBody)
        cardDeckEl.appendChild(card)
    }
}

// The information is cleared from the storage (however it is not removed from the list that is appended. This should be resolved in the future)
function clearCities() {
    localStorage.removeItem("List");
}


// Utilized the click function and the keyup function to activate the application once the search button is pressed
searchBtn.addEventListener("click", searchHandler);

$(searchInput).keyup(function(event) {
    if (event.keyCode === 13) {
        $(searchBtn).click();
    }
});

// Utilizes the click function to make the list items in the search history to redo the renderweather function based on the city value inside of the actual list item
cityId.addEventListener("click", function(e) {
    resubmitCity(e.target.innerHTML)
})

// onclick even for the clear cities function
document.getElementById("clear").onclick = clearCities;