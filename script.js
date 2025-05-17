// script.js
const apiKey = '5d9739dbc9485ad267a3427a5c2f9c50'; // e.g., from OpenWeatherMap

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const weatherDiv = document.getElementById('weatherResult');
  weatherDiv.classList.remove('show'); // Remove animation class before updating
  if (!city) {
    weatherDiv.innerHTML = `<p>Please enter a city name.</p>`;
    setTimeout(() => weatherDiv.classList.add('show'), 10);
    return;
  }
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        weatherDiv.innerHTML = `
          <h2>${data.name}</h2>
          <p>${data.weather[0].description}</p>
          <p>🌡️ ${data.main.temp} °C</p>
        `;
      } else {
        weatherDiv.innerHTML = `<p>City not found</p>`;
      }
      setTimeout(() => weatherDiv.classList.add('show'), 10);
    })
    .catch(() => {
      weatherDiv.innerHTML = `<p>Unable to fetch weather data. Please try again later.</p>`;
      setTimeout(() => weatherDiv.classList.add('show'), 10);
    });
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
