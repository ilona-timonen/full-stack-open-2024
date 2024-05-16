import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries data:', error);
      });
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setWeatherData(null);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowWeather = (capital) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${process.env.REACT_APP_KEY}`
      )
      .then((weatherResponse) => {
        setWeatherData(weatherResponse.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries:{' '}
        <input value={searchTerm} onChange={handleSearchTermChange} />
      </div>
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        filteredCountries.map((country) => (
          <div key={country.name.common}>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
              {Object.values(country.languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              style={{ width: '150px', height: 'auto' }}
            />
            <button onClick={() => handleShowWeather(country.capital)}>
              Show Weather
            </button>
          </div>
        ))
      )}
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>temperature {weatherData.main.temp} Celsius</p>
          {}
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
          />
          <p>wind {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;