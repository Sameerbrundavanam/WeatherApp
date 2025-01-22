const apiKey = '8fb72206de28de9adca27c157fe4b6c4';

// DOM elements
const cityInput = document.getElementById('city-input');
const daysInput = document.getElementById('days-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const forecastContainer = document.getElementById('forecast');
const forecastTitle = document.getElementById('forecast-title'); // Added reference to the title

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    const days = daysInput.value;

    if (city && days >= 1 && days <= 5) {
        getWeatherData(city);
        getForecast(city, days);

        // Dynamically update the title for the forecast section based on the days entered
        forecastTitle.innerHTML = `${days}-Day Forecast`;

        // Scroll to the top after the search button is clicked
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        displayError('Please enter a valid city name and a number of days (1-5).');
    }
});

function success(Position){
    console.log(Position);
}
function fail(error){
    console.log(error);
}
searchBtn.addEventListener('click', async() =>{
    const currentLocation = navigator.geolocation.getCurrentPosition(success,fail);
})

// Fetch weather data for the given city
async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            displayError('City not found.');
        } else {
            displayWeather(data);
        }
    } catch (error) {
        displayError('An error occurred while fetching the weather data.');
    }
}

// Fetch weather forecast for a given number of days
async function getForecast(city, days) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            displayError('City not found.');
        } else {
            displayForecast(data, days);
        }
    } catch (error) {
        displayError('An error occurred while fetching the forecast data.');
    }
}

// Display weather data
function displayWeather(data) {
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Conditions:</strong> ${data.weather[0].description}</p>
    `;
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Display forecast data for the specified number of days
function displayForecast(data, days) {
    forecastContainer.innerHTML = '';
    const forecastList = data.list.slice(0, days * 8); // Each forecast block is 3 hours, so 8 blocks = 1 day

    for (let i = 0; i < forecastList.length; i += 8) { // Only display one forecast per day
        const forecast = forecastList[i];
        const date = new Date(forecast.dt_txt);
        const day = date.toLocaleDateString();

        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                <h4>${day}</h4>
                <p class="temp">${forecast.main.temp}°C</p>
                <p>${forecast.weather[0].description}</p>
            </div>
        `;
    }
}

// Display error message
function displayError(message) {
    weatherInfo.style.display = 'none';
    forecastContainer.innerHTML = '';
    errorMessage.innerHTML = message;
    errorMessage.style.display = 'block';
}
