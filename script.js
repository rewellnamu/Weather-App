const apiKey = '5d9739dbc9485ad267a3427a5c2f9c50'; // from OpenWeatherMap

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const weatherDiv = document.getElementById('weatherResult');
  weatherDiv.classList.remove('show'); // Remove animation class before updating

if (!city) {
  weatherDiv.innerHTML = `<p>Please enter a city name.</p>`;
  setTimeout(() => weatherDiv.classList.add('show'), 10);
  return;
  }

  showSpinner();

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
  .then(response => response.json())
  .then(data => {
    if (data.cod === 200) {
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      weatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}" />
        <p>${data.weather[0].description}</p>
        <p>🌡️ ${data.main.temp} °C</p>
      `;
      // Fetch 5-day forecast
      getForecast(city);
    } else {
      weatherDiv.innerHTML = `<p>City not found</p>`;
    }
    setTimeout(() => weatherDiv.classList.add('show'), 10);
  })
  .catch(() => {
    weatherDiv.innerHTML = `<p>Unable to fetch weather data. Please try again later.</p>`;
    setTimeout(() => weatherDiv.classList.add('show'), 10);
  });

function getForecast(city) {
  const forecastDiv = document.getElementById('forecastContainer');
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "200") {
        // Filter one forecast per day around 12:00
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        forecastDiv.innerHTML = `<h3>5-Day Forecast</h3><div class="forecast-cards">`;

        dailyForecasts.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const icon = forecast.weather[0].icon;
          const description = forecast.weather[0].description;
          const temp = forecast.main.temp;

          forecastDiv.innerHTML += `
            <div class="forecast-card">
              <p>${date.toDateString()}</p>
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
              <p>${description}</p>
              <p>🌡️ ${temp} °C</p>
            </div>
          `;
        });

        forecastDiv.innerHTML += `</div>`;
        setTimeout(() => forecastDiv.classList.add('show'), 10);
      }
      hideSpinner();
    });
}
}

// Debounce utility to limit API calls while typing
let debounceTimer;
function debounceGetWeather() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(getWeather, 600);
}

// Attach input event listener after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cityInput');
  if (input) {
    input.addEventListener('input', debounceGetWeather);
  }

});

function showSpinner() {
  document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideSpinner() {
  document.getElementById('loadingSpinner').classList.add('hidden');
}

