import React, { useState, useEffect } from 'react'
import './WeatherApp.css'
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import humidity_icon from '../Assets/humidity.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import darkClouds from '../Assets/darkcloud.png'

export const WeatherApp = () => {
    let api_key = process.env.REACT_APP_WEATHER_API_KEY;

    const [wicon,setwicon] = useState(cloud_icon)
    const [location,setLocation] = useState(null)
    const [suggestions, setSuggestions] = useState([]);
    // const [inputValue, setInputValue] = useState('');

    const handleInputChange = async (e) => {
        const query = e.target.value;
        if (query.length > 0) {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${api_key}`;
            const res = await fetch(url);
            const data = await res.json();
            setSuggestions(data.map(city => `${city.name}, ${city.country}`));
        } else {
            setSuggestions([]);
        }
    };
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        });
    }, []);

    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
            let res = await fetch(url)
            if (!res.ok) { 
                alert('City not found');
                // throw new Error(`HTTP error! status: ${res.status}`);
            }else{
            let data = await res.json()
            console.log(data,'aaaaaaaaaa')
            const temperature = document.getElementsByClassName('weather-temp')
            const humidity = document.getElementsByClassName('humidity-percent')
            const wind = document.getElementsByClassName('wind-speed')
            const location = document.getElementsByClassName('weather-loc')
            temperature[0].innerHTML = (+data.list[0].main.temp.toFixed(1)) + '°С'
            humidity[0].innerHTML = data.list[0].main.humidity + '%'
            wind[0].innerHTML = data.list[0].wind.speed + 'km/h'
            location[0].innerHTML = data.city.name + `(${data.city.country})`}
        }
        if (location) {
            fetchWeatherData(location.lat, location.lon);
        }
    }, [location,api_key]);

    
    const search = async (e) =>{
        e.preventDefault(); 
        const element = document.getElementsByClassName('cityInput')
        if(element[0].value === ''){
            return 0;
        }
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${element[0].value}&lat=57&lon=-2.15&units=metric&appid=${api_key}`
        let res = await fetch(url)
        if (!res.ok) {
            alert('City not found');
            // throw new Error(`HTTP error! status: ${res.status}`);
        }else{
        let data = await res.json()
        console.log(data,'raghav')
        let weatherIcon = (data.list[0]?.weather || [])[0]?.icon;
        if(weatherIcon === '01d' || weatherIcon === '01n'){
            setwicon(clear_icon)
        }else if(weatherIcon === '02d' || weatherIcon === '02n'){
            setwicon(cloud_icon)
        }else if(weatherIcon === '03d' || weatherIcon === '03n'){
            setwicon(drizzle_icon)
        }else if(weatherIcon === '04d' || weatherIcon === '04n'){
            setwicon(darkClouds)
        }else if(weatherIcon === '09d' || weatherIcon === '09n'){
            setwicon(rain_icon)
        }else if(weatherIcon === '10d' || weatherIcon === '10n'){
            setwicon(rain_icon)
        }else if(weatherIcon === '13d' || weatherIcon === '13n'){
            setwicon(snow_icon)
        }else{
            setwicon(clear_icon)
        }
        const wimage = document.getElementsByClassName('wimage')
        if(weatherIcon === '04d' || weatherIcon === '04n'){
            wimage[0].style.height = '220px'
        }else{
            wimage[0].style.height = 'auto'
        }
        const temperature = document.getElementsByClassName('weather-temp')
        const humidity = document.getElementsByClassName('humidity-percent')
        const wind = document.getElementsByClassName('wind-speed')
        const location = document.getElementsByClassName('weather-loc')
        temperature[0].innerHTML = (+data.list[0].main.temp.toFixed(1)) + '°С'
        humidity[0].innerHTML = data.list[0].main.humidity + '%'
        wind[0].innerHTML = data.list[0].wind.speed + 'km/h'
        location[0].innerHTML = data.city.name + `(${data.city.country})`
    }
    }
    console.log(suggestions,'bbbbbbbbbb')
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(e);
        }
    }
    return (
        <div className='container'>
            <div className="top-bar">
            <div className="search-container">
                <input type="text" className="cityInput" onKeyDown={handleKeyDown} onChange={handleInputChange} placeholder='Enter City Name Here' />
                <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} onClick={(e) => {
                            e.persist()
                            e.target.value = suggestion;
                            search(e);
                            setSuggestions([]); 
                        }}>{suggestion}</div>
                    ))}
                </div>
            </div>
                <div className="search-icon" onClick={search}>
                    <img src={search_icon} alt="" />
                </div>
                {/* due to unique key issue */}
                {/* {suggestions.map(suggestion => (
                    <div key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}`}>{suggestion}</div>
                ))} */} 
            </div> 
            <div className="weather-img">
                <img src={wicon} className='wimage' alt="" />
            </div>   
            <div className="weather-temp">24°C</div>
            <div className="weather-loc">Dummy</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" />
                    <div className="data">
                        <div className="humidity-percent">64%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="" />
                    <div className="data">
                        <div className="wind-speed">18 km/h</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
