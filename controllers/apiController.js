const axios = require('axios');
const owm = process.env.OPENWEATHERMAP
const wb = process.env.WEATHERBIT
const locIqKey = process.env.LOCATIONIQ
const ds = process.env.DARKSKY

const owmWeather = axios.create({
  baseURL: 'https://api.openweathermap.org',
})

const wbWeather = axios.create({
  baseURL: 'https://api.weatherbit.io',
})

const locIqBase = axios.create({
  baseURL: 'https://us1.locationiq.com',
})

const darkSkyBase = axios.create({
  baseURL: 'https://api.darksky.net',
})

const openWeather = (token, lat, lon, type) => {
  const url = `/data/2.5/${type}?appid=${token}&units=metric&lat=${lat}&lon=${lon}`
  return owmWeather.get(url)
}

const weatherBit = (token, lat, lon, type) => {
  const url = `/v2.0/${type}?&lat=${lat}&lon=${lon}&key=${token}`
  return wbWeather.get(url)
}

const locIq = (key, city) => {
  const url = `/v1/search.php?format=json&key=${key}&q=${city}`
  return locIqBase.get(url)
}

const darkSky = (token, lat, lon, exclude) => {
  if (!exclude) exclude = '[minutely,hourly,daily,alerts,flags]'
  const geo = `${lat},${lon}`
  const url = `/forecast/${token}/${geo}?units=si&exclude=${exclude}`
  return darkSkyBase.get(url)
}

module.exports = {
  currentWeather(req, res) {
    const city = req.params.city
    locIq(locIqKey, city)
      .then(data => {
        const locDetail = data.data[0]
        const lat = data.data[0].lat
        const lon = data.data[0].lon
        const weather1 = openWeather(owm, lat, lon, 'weather')
        const weather2 = weatherBit(wb, lat, lon, 'current')
        const weather3 = darkSky(ds, lat, lon)
        const weather4 = darkSky(ds, lat, lon, '[minutely,hourly,currently,alerts,flags]')

        Promise.all([weather1, weather2, weather3, weather4])
          .then(values => {
            const value1 = values[0].data
            const value2 = values[1].data.data[0]
            const value3 = values[2].data.currently
            const value4 = values[3].data.daily.data
            // console.log(value4)
            const currentResults = {
              icon: value3.icon,
              city: value2.city_name,
              display_name: locDetail.display_name,
              country_code: value2.country_code,
              weather: value1.weather[0].main,
              summary: value3.summary,
              description: value1.weather[0].description,
              temp: value1.main.temp,
              feels_like: value1.main.feels_like,
              humidity: value1.main.humidity,
              wind_speed: value1.wind.speed,
              wind_dir: value1.wind.deg,
              clouds: value1.clouds.all,
              solar_rad: value2.solar_rad,
              uv: value2.uv
            }

            let weeklyResults = {}
            for (let i = 0; i < value4.length; i++) {
              weeklyResults.day[i] = value4[i]
            }
            console.log(weeklyResults)

            res.send(currentResults)
          })
          .catch(err => res.status(500).json(err))
      })
      .catch(err => res.status(404).json({ msg: "Not Found" }))
  },

  // weeklyWeather(req, res) {
  //   currentWeather(req, res) {
  //     const city = req.params.city
  //     locIq(locIqKey, city)
  //       .then(data => {
  //         const lat = data.data[0].lat
  //         const lon = data.data[0].lon
  //         darkSky(ds, lat, lon,)
  //       })
  //       .catch(err => res.send(err))
  //   }
  // }
}