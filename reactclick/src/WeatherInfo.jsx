import { useEffect, useState } from 'react'
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  Search,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'

function getWeatherDescription(weatherCode) {
  if (weatherCode === 0) {
    return { description: 'Ciel dégagé', Icon: Sun }
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return { description: 'Partiellement nuageux / couvert', Icon: Cloud }
  }

  if ([45, 48].includes(weatherCode)) {
    return { description: 'Brouillard', Icon: CloudFog }
  }

  if (weatherCode >= 51 && weatherCode <= 67) {
    return { description: 'Pluie / bruine', Icon: CloudRain }
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return { description: 'Neige', Icon: CloudSnow }
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return { description: 'Averses', Icon: CloudRain }
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return { description: 'Orage', Icon: CloudLightning }
  }

  return { description: 'Météo inconnue', Icon: Cloud }
}

export default function WeatherInfo() {
  const [weather, setWeather] = useState(null)
  const [cityName, setCityName] = useState('Genève')
  const [searchCity, setSearchCity] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function getWeather(latitude, longitude, name) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`

    fetch(weatherUrl)
      .then(response => response.json())
      .then(result => {
        setWeather(result.current)
        setCityName(name)
      })
  }

  useEffect(() => {
    getWeather(46.2044, 6.1432, 'Genève')
  }, [])

  function searchWeather() {
    if (searchCity.trim() === '') {
      setErrorMessage('Écris le nom d’une ville.')
      return
    }

    setErrorMessage('')

    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=fr&format=json`

    fetch(geocodingUrl)
      .then(response => response.json())
      .then(result => {
        if (!result.results || result.results.length === 0) {
          setErrorMessage('Aucune ville trouvée.')
          return
        }

        const city = result.results[0]
        getWeather(city.latitude, city.longitude, city.name)
      })
  }

  const weatherInfo = weather ? getWeatherDescription(weather.weather_code) : null
  const WeatherIcon = weatherInfo ? weatherInfo.Icon : Cloud

  return (
    <section className="weather-card">
      <div className="weather-search">
        <input
          type="text"
          value={searchCity}
          onChange={(event) => setSearchCity(event.target.value)}
          placeholder="Chercher une ville"
        />
        <button type="button" onClick={searchWeather} className="search-button">
          <Search size={18} />
          Rechercher
        </button>
      </div>

      {errorMessage && <p className="weather-error">{errorMessage}</p>}

      {weather ? (
        <div className="weather-content">
          <h2>
            <MapPin size={22} />
            {cityName}
          </h2>

          <div className="weather-sky">
            <WeatherIcon size={42} />
            <p>{weatherInfo.description}</p>
            <div className="weather-main-temperature">
              {weather.temperature_2m} °C
            </div>
          </div>

          <div className="weather-grid">
            <p>
              <Thermometer size={18} />
              Ressenti : {weather.apparent_temperature} °C
            </p>
            <p>
              <Droplets size={18} />
              Humidité : {weather.relative_humidity_2m} %
            </p>
            <p>
              <Wind size={18} />
              Vent : {weather.wind_speed_10m} km/h
            </p>
          </div>
        </div>
      ) : (
        <p>Pas de données disponibles</p>
      )}
    </section>
  )
}
