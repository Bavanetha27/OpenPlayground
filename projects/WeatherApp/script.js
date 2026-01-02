const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherData = document.getElementById('weatherData');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loader');

// Elements to update
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) getCityCoordinates(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city) getCityCoordinates(city);
    }
});

async function getCityCoordinates(city) {
    // UI Reset
    weatherData.classList.add('hidden');
    errorMsg.style.display = 'none';
    loader.style.display = 'block';

    try {
        // Step 1: Geocoding (Get Lat/Lon from City Name)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Step 2: Fetch Weather Data using Lat/Lon
        getWeather(latitude, longitude, name, country);

    } catch (error) {
        loader.style.display = 'none';
        errorMsg.style.display = 'block';
    }
}

async function getWeather(lat, lon, name, country) {
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        // Get current hour index for humidity (since Open-Meteo puts humidity in hourly array)
        const currentHour = new Date().toISOString().slice(0, 13) + ":00";
        const hourIndex = data.hourly.time.indexOf(currentHour);
        const currentHumidity = data.hourly.relativehumidity_2m[hourIndex !== -1 ? hourIndex : 0];

        // Update UI
        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = Math.round(data.current_weather.temperature);
        windSpeed.textContent = `${data.current_weather.windspeed} km/h`;
        humidity.textContent = `${currentHumidity}%`;
        
        // Convert WMO Weather Code to Text/Icon
        const code = data.current_weather.weathercode;
        condition.textContent = getWeatherDescription(code);

        loader.style.display = 'none';
        weatherData.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        loader.style.display = 'none';
        errorMsg.textContent = "Error fetching weather data.";
        errorMsg.style.display = 'block';
    }
}

// Helper to map WMO codes to descriptions
function getWeatherDescription(code) {
    // WMO Weather interpretation codes (WW)
    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤", 2: "Partly Cloudy ⛅", 3: "Overcast ☁️",
        45: "Fog 🌫", 48: "Depositing Rime Fog 🌫",
        51: "Light Drizzle 🌧", 53: "Moderate Drizzle 🌧", 55: "Dense Drizzle 🌧",
        61: "Slight Rain ☔", 63: "Moderate Rain ☔", 65: "Heavy Rain ☔",
        71: "Slight Snow ❄️", 73: "Moderate Snow ❄️", 75: "Heavy Snow ❄️",
        80: "Slight Rain Showers 🌦", 81: "Moderate Rain Showers 🌦", 82: "Violent Rain Showers ⛈",
        95: "Thunderstorm ⚡", 96: "Thunderstorm with Hail ⛈", 99: "Heavy Hail Thunderstorm ⛈"
    };
    return weatherCodes[code] || "Unknown Weather";
}