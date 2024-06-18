import { useEffect, useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({value, onChange}) => {
  return (
    <div>
      find countries <input value={value} onChange={onChange} />
    </div>
  )
}

const Weather = ({name, lat, lon}) => {
  const [weather, setWeather] = useState({temp: 0, wind: 0, icon: ''});
  useEffect(() => {
    weatherService
    .get(lat, lon)
    .then(returnedWeather => {
      const weatherObject = {
        temp: returnedWeather.main.temp,
        wind: returnedWeather.wind.speed,
        icon: returnedWeather.weather[0].icon
      }
      setWeather(weatherObject)
    });
  }, []);

  return (
    <div>
      <h2>Weather in {name}</h2>
      <p>temperature {weather.temp} Celcius</p>
      <img alt={name} src={`https://openweathermap.org/img/wn/${weather.icon}.png`} style={{height: "8rem"}}/>
      <p>wind {weather.wind} m/s</p>  
    </div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
      {Object.entries(country.languages).map(entry => <li key={entry[0]}>{entry[1]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
      <Weather name={country.capital[0]} lat={country.capitalInfo.latlng[0]} lon={country.capitalInfo.latlng[1]}/>
    </div>
  )
}

const Display = ({countries, onCountryClick}) => {
  if(countries.length > 10) {
    return "Too many matches, specify another filter"
  }

  if(countries.length <= 10 && countries.length > 1) {
    return (
      <div>
        {
          countries.map(country => 
          <div key={country.name.common}>
            {country.name.common} 
            <button onClick={() => onCountryClick(country)}>show</button>
          </div> )
        }
      </div>
    )
  }

  if (countries.length === 1) {
    return (
      <div>
        <Country country={countries[0]}/>
      </div>
    )
  }

}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const handleCountryClick = (country) => {
    setFilter(country.name.common)
  }

  const queriedCountries = filter.length > 0
    ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()) || country.name.official.toLowerCase().includes(filter.toLowerCase()))
    : countries

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange}/>
      <Display countries={queriedCountries} onCountryClick={handleCountryClick}/>
    </div>
  )
}


export default App
