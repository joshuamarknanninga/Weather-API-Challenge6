// scripts.js
const apiKey = '54f49b7f1d8f2cc3907a8ace3e736db7';

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    fetchWeatherData(city);
    saveToHistory(city);
    displayHistory();
});

function fetchWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data));

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data));
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    document.getElementById('temperature').textContent = `Temp: ${data.main.temp}°F`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} MPH`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity} %`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastDay = data.list[i];
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day', 'bg-blue-600', 'text-white', 'p-4', 'm-2', 'rounded', 'flex-1', 'text-center');
        forecastElement.innerHTML = `
            <h3 class="text-lg font-semibold">${new Date(forecastDay.dt_txt).toLocaleDateString()}</h3>
            <p><img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].description}" class="mx-auto"></p>
            <p>Temp: ${forecastDay.main.temp}°F</p>
            <p>Wind: ${forecastDay.wind.speed} MPH</p>
            <p>Humidity: ${forecastDay.main.humidity} %</p>
        `;
        forecastContainer.appendChild(forecastElement);
    }
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', () => fetchWeatherData(city));
        historyList.appendChild(listItem);
    });
}

// Initial display of search history on page load
document.addEventListener('DOMContentLoaded', displayHistory);
