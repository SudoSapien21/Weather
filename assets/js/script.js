var apiKey = "1532b8b61e80f8271018c25a99baba89";

// Check if API key exists in localStorage
// var storedApiKey = localStorage.getItem('apiKey');
// if (storedApiKey) {
//   apiKey = storedApiKey;
// } else {
//   // Prompt the user to enter the API key and store it in localStorage
//   var userApiKey = prompt('Please enter your API key');
//   localStorage.setItem('apiKey', userApiKey);
//   apiKey = userApiKey;
// }


async function fetchWeatherData(city) {
 
  var locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    var locationResponse = await fetch(locationUrl);
    if (!locationResponse.ok) {
      throw new Error('City not found.');
    }
    var locationData = await locationResponse.json();
    var { lat, lon } = locationData.coord;

    // Fetch weather data using latitude and longitude
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error('Weather data not found.');
    }
    var data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
// Function to display current weather for a city
function displayCurrentWeather(weather) {
  var { name } = weather.city;
  var { dt, temp, humidity } = weather.list[0].main;
  var { speed } = weather.list[0].wind; 
  var { icon } = weather.list[0].weather[0];

  document.getElementById('city-name').textContent = name;
  document.getElementById('current-date').textContent = formatDate(dt);
  document.getElementById('current-temp').textContent = convertKelvinToCelsius(temp);
  document.getElementById('current-humidity').textContent = humidity;
  document.getElementById('current-wind-speed').textContent = speed + ' m/s'; 
  document.getElementById('weather-icon').setAttribute('src', `http://openweathermap.org/img/w/${icon}.png`);
}

// Function to display the 5-day forecast for a city
function displayForecast(weather) {
  var forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';

  for (let i = 1; i < 6; i++) {
    var { dt, temp, humidity, wind_speed } = weather.list[i].main;
    var { icon } = weather.list[i].weather[0];

    var forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    forecastItem.innerHTML = `
      <p>Date: ${formatDate(dt)}</p>
      <p>Temperature: ${convertKelvinToCelsius(temp)}</p>
      <p>Humidity: ${humidity}</p>
      <p>Wind Speed: ${wind_speed}</p>
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="">
    `;

    forecastDiv.appendChild(forecastItem);
  }
}


// Function to format the date
function formatDate(timestamp) {
  var date = new Date(timestamp);
  var options = { month: 'numeric', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to convert temperature from Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15) + '°C';
}

// Function to handle the form submission
async function handleFormSubmit(event, city) {
  event.preventDefault();
  var cityInput = document.getElementById('city-input');

  if (!city) {
    city = cityInput.value.trim();
  }

  if (city) { // This block should be inside the if (city) condition
    var weatherData = await fetchWeatherData(city);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);

      // Add city to search history
      var searchHistory = document.getElementById('search-history');
      var searchItem = document.createElement('li');
      // searchItem.textContent = city;
      searchItem.addEventListener('click', () => {
        handleFormSubmit(event, city);
      });
      searchHistory.prepend(searchItem);
    }
  }

  cityInput.value = '';
}


// Attach event listener to the form submit event
var searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleFormSubmit);
