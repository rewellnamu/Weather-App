const apiKey = '5d9739dbc9485ad267a3427a5c2f9c50'; // OpenWeatherMap API Key

// Fetch and display current weather
function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  // const weatherDiv = document.getElementById('weatherResult');
  // const forecastDiv = document.getElementById('forecastContainer');
  // weatherDiv.classList.remove('show'); // Reset animation class

  // Clear previous forecast
  // if (forecastDiv) forecastDiv.innerHTML = '';

  if (!city) {
    // Optionally show a message or shake input
    return;
  }
  showSpinner();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        // Main card
        document.getElementById('mainDate').textContent = new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
        document.getElementById('mainLocationText').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('mainTemp').textContent = `${Math.round(data.main.temp)} °C`;
        document.getElementById('mainDesc').textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

        // Weather icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const mainIcon = document.getElementById('mainIcon');
        mainIcon.src = iconUrl;
        mainIcon.alt = data.weather[0].description;
        mainIcon.style.display = 'inline-block';

        // Details
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${Math.round(data.wind.speed)} km/h`;
        // Precipitation: try to get rain or snow, else 0%
        let precipitation = '0%';
        if (data.rain && data.rain['1h']) precipitation = `${data.rain['1h']} mm`;
        else if (data.snow && data.snow['1h']) precipitation = `${data.snow['1h']} mm`;
        document.getElementById('precipitation').textContent = precipitation;

        // Forecast
        getForecast(city, iconCode);
      } else {
        // Optionally show error
        hideSpinner();
      }
    })
    .catch(() => {
      // Optionally show error
      hideSpinner();
    });
}

// Fetch and display 5-day forecast
function getForecast(city, todayIcon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "200") {
        const forecastRow = document.getElementById('forecastRow');
        forecastRow.innerHTML = '';
        const dailyForecasts = [];
        const usedDates = new Set();

        // Pick one forecast per day (12:00:00 or first of day)
        data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!usedDates.has(date) && (item.dt_txt.includes('12:00:00') || dailyForecasts.length === 0)) {
            dailyForecasts.push(item);
            usedDates.add(date);
          }
        });

        dailyForecasts.slice(0, 4).forEach((forecast, idx) => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toLocaleDateString(undefined, { weekday: 'short' });
          const temp = Math.round(forecast.main.temp);
          const icon = forecast.weather[0].icon;
          const desc = forecast.weather[0].main;

          const selected = idx === 0 ? 'selected' : '';
          forecastRow.innerHTML += `
            <div class="weather-forecast-card ${selected}">
              <div class="forecast-day">${day}</div>
              <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
              <div class="forecast-temp">${temp} °C</div>
            </div>
          `;
        });
      }
      hideSpinner();
    })
    .catch(() => {
      hideSpinner();
    });
}

// Debounce input to reduce API calls
let debounceTimer;
function debounceGetWeather() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(getWeather, 600);
}

// Initialize input listener
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cityInput');
  if (input) {
    input.addEventListener('input', debounceGetWeather);
  }
});

// Show loading spinner
function showSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.classList.remove('hidden');
}

// Hide loading spinner
function hideSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.classList.add('hidden');
}
