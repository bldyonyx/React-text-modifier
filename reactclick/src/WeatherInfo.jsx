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
    <section className="w-full max-w-[420px] rounded-lg border border-[#d7dce5] bg-white p-5 shadow-lg">
      <div className="mb-3.5 flex gap-2.5 max-[480px]:flex-col">
        <input
          className="min-w-0 flex-1 rounded-md border border-[#d7dce5] px-3 py-2.5 text-[#1f2937]"
          type="text"
          value={searchCity}
          onChange={(event) => setSearchCity(event.target.value)}
          placeholder="Chercher une ville"
        />
        <button
          type="button"
          onClick={searchWeather}
          className="flex items-center gap-2 rounded-md bg-[#a685b1] px-4 py-2.5 text-white hover:bg-[#d870ba] max-[480px]:justify-center"
        >
          <Search size={18} />
          Rechercher
        </button>
      </div>

      {errorMessage && (
        <p className="mb-3.5 font-semibold text-[#c2416b]">{errorMessage}</p>
      )}

      {weather ? (
        <div className="flex flex-col gap-4">
          <h2 className="m-0 flex items-center justify-center gap-2 text-[#1f2937]">
            <MapPin size={22} />
            {cityName}
          </h2>

          <div className="rounded-lg bg-[#f4f1fb] p-4 text-center text-[#667399]">
            <WeatherIcon size={42} className="mx-auto" />
            <p className="mt-2 font-bold text-[#1f2937]">
              {weatherInfo.description}
            </p>
            <div className="mt-2.5 text-4xl font-extrabold leading-none text-[#667399]">
              {weather.temperature_2m} °C
            </div>
          </div>

          <div className="grid gap-2.5">
            <p className="flex items-center gap-2 rounded-md bg-slate-50 p-2.5 text-[#1f2937]">
              <Thermometer size={18} />
              Ressenti : {weather.apparent_temperature} °C
            </p>
            <p className="flex items-center gap-2 rounded-md bg-slate-50 p-2.5 text-[#1f2937]">
              <Droplets size={18} />
              Humidité : {weather.relative_humidity_2m} %
            </p>
            <p className="flex items-center gap-2 rounded-md bg-slate-50 p-2.5 text-[#1f2937]">
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
