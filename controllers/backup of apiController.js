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

const openWeather = (token, city, type) => {
  const url = `/data/2.5/${type}?appid=${token}&units=metric&q=${city}`
  return owmWeather.get(url)
}

const weatherBit = (token, city, type) => {
  const url = `/v2.0/${type}?city=${city}&key=${token}`
  return wbWeather.get(url)
}

const locIq = (key, city) => {
  const url = `/v1/search.php?format=json&key=${key}&q=${city}`
  return locIqBase.get(url)
}

const darkSky = (token, geo) => {
  const url = `/forecast/${token}/${geo}?units=si&exclude=[minutely,hourly,daily,alerts,flags]`
  return darkSkyBase.get(url)
}

module.exports = {
  // weather5d(req, res) {
  //   const city = req.params.city
  //   openWeather(owm, city, 'forecast')
  //     .then(data => {
  //       res.status(200).json(data.data)
  //     })
  //     .catch(err => res.status(404).json({ msg: 'Not found' }))
  // },

  currentWeather(req, res) {
    const city = req.params.city
    const weather1 = openWeather(owm, city, 'weather')
    const weather2 = weatherBit(wb, city, 'current')
    const locationlatlon = locIq(locIqKey, city)

    locationlatlon
      .then(data => {
        // return geo = `${data.data[0].lat},${data.data[0].lon}`
        return locDetail = data.data[0]
      })
      .then(locDetail => {
        const geo = `${locDetail.lat},${locDetail.lon}`
        darkSky(ds, geo)
          .then(result => {
            Promise.all([weather1, weather2])
              .then(values => {
                const value1 = values[0].data
                const value2 = values[1].data.data[0]
                const value3 = result.data.currently
                const results = {
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
                res.send(results)
              })
              .catch(err => res.status(500).json(err))
          })
          .catch(err => res.status(500).json(err))
      })
      .catch(err => res.status(500).json(err))
  }
}

  // currentWeather(req, res) {
  //   const url = `/data/2.5/forecast?appid=${owm}&units=metric&q=${req.params.city}`
  //   weather.get(url)
  //     .then(data => {
  //       res.status(200).json(data.data)
  //     })
  //     .catch(err => res.status(404).json({ msg: 'Not found' }))
  // }


      // ini udah jalan
    // Promise.all([weather1, weather2])
    // .then(values => {
    //   const value1 = values[0].data
    //   const value2 = values[1].data.data[0]
    //   const results = {
    //     city: value2.city_name,
    //     country_code: value2.country_code,
    //     weather: value1.weather[0].main,
    //     description: value1.weather[0].description,
    //     temp: value1.main.temp,
    //     feels_like: value1.main.feels_like,
    //     humidity: value1.main.humidity,
    //     wind_speed: value1.wind.speed,
    //     wind_dir: value1.wind.deg,
    //     clouds: value1.clouds.all,
    //     solar_rad: value2.solar_rad,
    //     uv: value2.uv
    //   }
    //   // console.log(values[0].data)
    //   res.send(results)
    // })
    // .catch(err => res.status(500).json(err))