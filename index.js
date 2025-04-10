const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const errorSection = document.getElementById("error");
const mainCardSection = document.getElementById("main-weather-info");
const startSection = document.getElementById("start-screen");

const cityTXT = document.getElementById("city");
const currentDate = document.getElementById("today");
const currentWeatherImg = document.getElementById("today-weather-img");
const currentTemperature = document.getElementById("today-temperature");
const weatherName = document.getElementById("weather-name");
const humidityTXT = document.getElementById("humidityText");
const windTXT = document.getElementById("windText");

const bgImg = document.querySelector(".body");

const forcastContainer = document.getElementById("next-five-days")


const apiKey = '7c893640db4e8a42e447e2c483739068';

searchBtn.addEventListener('click', () => {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
});

cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch (apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod != 200) {
        showDisplaySection(errorSection);
    } else {
        showDisplaySection(mainCardSection);
        await nextFiveDays(city);
    }
    console.log(weatherData);
   
    
    //destructuring assignment
    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData;
    
    
    cityTXT.textContent = country;
    currentTemperature.textContent= Math.round(temp) + ' °c';
    weatherName.textContent = main;
    humidityTXT.textContent = humidity + ' %';
    windTXT.textContent = speed + ' M/s';
    
    currentWeatherImg.src = `${getWeatherImg(id)}`;
    updateBackgroundImage(id);

    currentDate.textContent = getCurrentDate();
}

function getWeatherImg(id) {
    if (id <= 321) {
        return 'drizzle.png';
    } else if (id <= 531) {
        return 'rain.png';
    } else if (id <= 622) {
        return 'snow.png';
    } else if (id <= 781) {
        return 'mist.png';
    } else if (id <= 800) {
        return 'clear.png';
    } else {
        return 'clouds.png';
    }
}

function getBgImg(id) {
        
    if (id <= 321) {
        return 'drizzleBG.jpg';
    } else if (id <= 531) {
        return 'rainBG.jpg';
    } else if (id <= 622) {
        return 'snowBG.jpg';
    } else if (id <= 781) {
        return 'mistBG.jpg';
    } else if (id <= 800) {
        return 'clearBG.jpg';
    } else {
        return 'cloudsBG.jpg';
        }
}    

function updateBackgroundImage(id) {
    const bgImgSrc = getBgImg(id);
    bgImg.style.backgroundImage = `url(${bgImgSrc})`;
    
}

function showDisplaySection(section) {
    [errorSection, mainCardSection, startSection].forEach(section => section.style.display = 'none')
    section.style.display = 'block';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short' 
    }
    return currentDate.toLocaleDateString('en-GB', options);
}

async function nextFiveDays(city) {
    const forcastData = await getFetchData('forecast',city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forcastContainer.innerHTML = '';

    forcastData.list.forEach(forcastWeather => {
        if (forcastWeather.dt_txt.includes(timeTaken) && !forcastWeather.dt_txt.includes(todayDate)) {
            updateForcastItems(forcastWeather);
        }
    })


}

function updateForcastItems(weatherData) {
    const {
        dt_txt: date,
        weather:[{id}],
        main: {temp}
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOptions = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOptions);

    const forcastItem = `
    <div class="card">
        <h3 id="date">${dateResult}</h3>
        <img src= "${getWeatherImg(id)}">
        <h4 id="temperature">${Math.round(temp)} °c</h4>
    </div>`

    forcastContainer.insertAdjacentHTML('beforeend', forcastItem)
}

