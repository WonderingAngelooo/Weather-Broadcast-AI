// Typing effect function
function typeEffect(element, speed) {
  const text = element.innerHTML;
  element.innerHTML = '';

  let i = 0;
  const typing = setInterval(function() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
}

// Call the typing effect function
const weatherInfo = document.getElementById('weather-info');



// Check if the screen width is greater than a certain threshold (e.g., 768 pixels)
if (window.innerWidth > 768) {
  // Call the typeEffect function for non-mobile view
  const element = document.getElementById('weather-info');
  typeEffect(element, 30);
}

// Function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

function formatTime(time) {
  var hours = ('0' + time.getHours()).slice(-2); // Ensure two-digit format for hours
  var minutes = ('0' + time.getMinutes()).slice(-2); // Ensure two-digit format for minutes

  return hours + ':' + minutes; // Return formatted time string
}

function speakWeatherInfo(city, country, description, temperature, place, sunrise, sunset,humidity,windSpeed) {
  var message = "The weather in " + city + country + " is currently " + description + " and the temperature is " + temperature + " degrees Celsius. ";
  message += "The sunrise is at " + sunrise + " the sunset is at " + sunset + " the humidity percentage is " + humidity + "percent "+ " and the wind speed is "+ windSpeed + " kilometers per hour "+ ".";
  
  var speech = new SpeechSynthesisUtterance(message);
  speech.lang = 'en-US';

  // Get list of available voices
  var voices = window.speechSynthesis.getVoices();

  // Find a female voice
  var femaleVoice = voices.find(voice => voice.name === 'Google UK English Female');

  
  window.speechSynthesis.speak(speech);
}

// Function to change background based on weather description and time
function changeBackground(weatherDescription) {
  const body = document.getElementById('body');
 

  // Map weather descriptions to background styles
  const backgroundStyles = {
    'clear sky': 'url("https://images.unsplash.com/photo-1467740100611-36858db27485?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'few clouds': 'url("https://images.unsplash.com/photo-1495490311930-678c8ecdd120?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'scattered clouds': 'url("https://images.unsplash.com/photo-1642447733831-2cdd9f5efae7?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'broken clouds': 'url("https://images.unsplash.com/photo-1642447733831-2cdd9f5efae7?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'shower rain': 'url("https://images.unsplash.com/photo-1438449805896-28a666819a20?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'rain': 'url("https://images.unsplash.com/photo-1438449805896-28a666819a20?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'thunderstorm': 'url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'snow': 'url("https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1808&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'mist': 'url("https://images.unsplash.com/photo-1560996025-95b43d543770?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
  };

  // Set background style based on weather description
  if (backgroundStyles.hasOwnProperty(weatherDescription)) {
    body.style.backgroundImage = backgroundStyles[weatherDescription];
    body.style.backgroundSize = 'auto'; // Set background size to auto
  } else {
    // Set default background if description doesn't match
    body.style.backgroundImage = backgroundImage;
  }
}

document.getElementById("voice-search-button").addEventListener("click", function() {
  recognizeSpeech();
});

function recognizeSpeech() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  // Add text indicating that the mic is on
  const micStatus = document.createElement('p');
  micStatus.textContent = 'Microphone is ON. You can speak now.';
  micStatus.id = 'mic-status';
  document.getElementById('search-container').appendChild(micStatus);

  recognition.onresult = function(event) {
    const speechToText = event.results[0][0].transcript;
    document.getElementById("city-input").value = speechToText;
    searchWeather(); // Trigger search after setting the input field value
  }

  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
  }

  // Remove mic status text when the mic is turned off
  recognition.onend = function() {
    const micStatus = document.getElementById('mic-status');
    if (micStatus) {
      micStatus.parentNode.removeChild(micStatus);
    }
  }
}


// Function to trigger weather search when Enter key is pressed
document.getElementById("city-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Prevent the default action of the Enter key (e.g., form submission)
    event.preventDefault();
    // Trigger weather search
    searchWeather();
  }
});

// Function to trigger weather search
function searchWeather() {
  var city = document.getElementById("city-input").value;
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=efa343dc4e8b491453855c6c6d106bab")
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      const temperature = kelvinToCelsius(data.main.temp);
      const place = data.name;
      const country = data.sys.country;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;
      const sunrise = formatTime(new Date(data.sys.sunrise * 1000));
      const sunset = formatTime(new Date(data.sys.sunset * 1000));
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      // Change background based on weather description
      changeBackground(description);

    if (description.toLowerCase() === 'mist') {
        // Set text color to white for specific elements
        document.getElementById("city-time").style.color = 'white';
        document.getElementById("place").style.color = 'white';
        document.getElementById("description").style.color = 'white';
        document.getElementById("temperature").style.color = 'white';
        document.getElementById("sunrise").style.color = 'white';
        document.getElementById("sunset").style.color = 'white';
        document.getElementById("humidity").style.color = 'white';
        document.getElementById("windSpeed").style.color = 'white';
      }

      if (description.toLowerCase() === 'thunderstorm') {
        // Set text color to white for specific elements
        document.getElementById("city-time").style.color = 'white';
        document.getElementById("place").style.color = 'white';
        document.getElementById("description").style.color = 'white';
        document.getElementById("temperature").style.color = 'white';
        document.getElementById("sunrise").style.color = 'white';
        document.getElementById("sunset").style.color = 'white';
        document.getElementById("humidity").style.color = 'white';
        document.getElementById("windSpeed").style.color = 'white';
      }

       // Check if temperature is below 5 degrees
    if (parseFloat(temperature) < 5) {
      // Change background image
      document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1418985991508-e47386d96a71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")';

      // Check if display is in mobile view
      if (window.innerWidth <= 768) {
        // Set text color to white for specific elements
        document.getElementById("city-time").style.color = 'white';
        document.getElementById("place").style.color = 'white';
        document.getElementById("description").style.color = 'white';
        document.getElementById("temperature").style.color = 'white';
        document.getElementById("sunrise").style.color = 'white';
        document.getElementById("sunset").style.color = 'white';
        document.getElementById("humidity").style.color = 'white';
        document.getElementById("windSpeed").style.color = 'white';
      }
    } else {
      // Temperature is not below 5 degrees, change background based on weather description
      changeBackground(description);
    }

      document.getElementById("place").innerHTML = place +" "+ country;
      document.getElementById("temperature").innerHTML = "Temp: " + temperature + "°C";
      document.getElementById("icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      document.getElementById("icon").style.width = "150px"; // Adjust the width as needed
      document.getElementById("icon").style.height = "150px"; // Adjust the height as needed
      document.getElementById("description").innerHTML = "Description: " + description.charAt(0).toUpperCase() + description.slice(1);
      document.getElementById("sunrise").innerHTML = "Sunrise: " + sunrise;
      document.getElementById("sunset").innerHTML = "Sunset: " + sunset;
      document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";
      document.getElementById("windSpeed").innerHTML = "Wind: " + windSpeed + "<small>Kph</small>";

      speakWeatherInfo(city, country, description, temperature, place, sunrise, sunset, humidity, windSpeed);
    })
    .catch(error => {
      console.error("Error:", error);
      // Display message for city not found
      alert("City not found. Please enter a valid city name.");
    });
}

// Add event listener for clicking the search button
document.getElementById("search-button").addEventListener("click", searchWeather);
