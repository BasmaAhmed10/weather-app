

const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const countryText = document.querySelector('.country-text');
const currentDate = document.querySelector('.current-data');
const weatherIcon = document.querySelector('.weather-icon');
const tempText = document.querySelector('.temp-text');
const conditionText = document.querySelector('.condition-text');
const humidityValue = document.querySelector('.humidity-value');
const windSpeedValue = document.querySelector('.wind-speed-value');
const forecastItems = document.querySelectorAll('.forecast-item');


const apiKey = "d503a5e6644f2ee428ce316e78102a94";


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        updateWeatherInfo(city);
        cityInput.value = ''; 
    }
});


cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = ''; 
        cityInput.blur();  
    }
});


async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`; // إضافة units=metric للحصول على درجات الحرارة بالـ مئوية
    const response = await fetch(apiUrl);

    
    if (!response.ok) {
        throw new Error(`City not found: ${city}`);
    }

    return response.json();
}


async function updateWeatherInfo(city) {
    try {
   
        const weatherData = await getFetchData('weather', city);
       
        const forecastData = await getFetchData('forecast', city);

       
        const { name, weather, main, wind } = weatherData;
        const temp = main.temp;
        const humidity = main.humidity;
        const condition = weather[0].description;
        const icon = weather[0].icon;
        const windSpeed = wind.speed;

       
        countryText.textContent = name;
        currentDate.textContent = new Date().toLocaleDateString(); 
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
        tempText.textContent = Math.round(temp) + '℃'; 
        conditionText.textContent = condition.charAt(0).toUpperCase() + condition.slice(1); 
        humidityValue.textContent = humidity + '%'; 
        windSpeedValue.textContent = `${windSpeed} m/s`;


        
        forecastItems.forEach((item, index) => {
            const forecast = forecastData.list[index * 8];
            if (forecast) {
                
              
                const forecastDate = new Date(forecast.dt * 1000);
                const options = { day: '2-digit', month: 'short' };
                const formattedDate = forecastDate.toLocaleDateString('en-US', options); 

                item.querySelector('.forecast-data').textContent = formattedDate;
                item.querySelector('img').src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`; 
                item.querySelector('.forecast-temp').textContent = `${forecast.main.temp} ℃`; 
            }
        });

       
        weatherInfoSection.classList.remove('d-none');

       
        const searchCitySection = document.querySelector('.search-city');
        searchCitySection.style.display = 'none';  

    } catch (error) {
       
        alert(`Error: ${error.message}`);
        weatherInfoSection.classList.add('d-none'); 
    }
}



