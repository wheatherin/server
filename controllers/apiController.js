const axios = require('axios');
const owm = process.env.OPENWEATHERMAP
const wb = process.env.WEATHERBIT

const owmWeather = axios.create({
  baseURL: 'https://api.openweathermap.org',
})

const wbWeather = axios.create({
  baseURL: 'https://api.weatherbit.io/v2.0',
})

// https://api.weatherbit.io/v2.0/current?city=Raleigh,NC&key=API_KEY

// const openWeather5d = (token, city) => {
//   const url = `/data/2.5/forecast?appid=${token}&units=metric&q=${city}`
//   return weather.get(url)
// }

const openWeather = (token, city, type) => {
  const url = `/data/2.5/${type}?appid=${token}&units=metric&q=${city}`
  return owmWeather.get(url)
}

const weatherBit = (token, city, type) => {
  const url = `/${type}?city=${city}&key=${token}`
  return wbWeather.get(url)
}

module.exports = {
  weather5d(req, res) {
    const city = req.params.city
    openWeather(owm, city, 'forecast')
      .then(data => {
        res.status(200).json(data.data)
      })
      .catch(err => res.status(404).json({ msg: 'Not found' }))
  },

  currentWeather(req, res) {
    const city = req.params.city
    const arr = [];
    const weather1 = openWeather(owm, city, 'weather')
    const weather2 = weatherBit(wb, city, 'current')
    // weather1
    //   .then(data => res.send(data.data))
    //   .catch(err => res.send(err))
    // .then(data => {
    //   // res.status(200).json(data.data)
    //   return data.data
    // })
    // .then(data => {
    //   arr.push(data)
    //   res.send(arr)
    // })
    // .catch(err => res.status(404).json({ msg: 'Not found' }))
    Promise.all([weather1, weather2]).then(values => {
      const value1 = values[0].data
      const value2 = values[1].data.data[0]
      const results = {
        city: value2.city_name,
        country_code: value2.country_code,
        weather: value1.weather[0].main,
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
      // console.log(values[0].data)
      res.send(results)
    });
  }

  // currentWeather(req, res) {
  //   const url = `/data/2.5/forecast?appid=${owm}&units=metric&q=${req.params.city}`
  //   weather.get(url)
  //     .then(data => {
  //       res.status(200).json(data.data)
  //     })
  //     .catch(err => res.status(404).json({ msg: 'Not found' }))
  // }

  // getRepos(req, res) {
  //   repoInstance.get(`/users/${req.params.username}/repos`)
  //     .then(data => {
  //       if (data.data.length >= 1)
  //         res.status(200).json(data.data)
  //       else res.status(404).json({ msg: 'user not found' })
  //     })
  //     .catch(err => res.send(err))
  // },

  // getOwnRepos(req, res) {
  //   repoInstance.get(`/user/repos`)
  //     .then(data => {
  //       if (data.data.length >= 1)
  //         res.status(200).json(data.data)
  //       else res.status(404).json({ msg: 'user not found' })
  //     })
  //     .catch(err => res.send(err))
  // },

  // getOwnStarred(req, res) {
  //   repoInstance.get(`/user/starred`)
  //     .then(data => {
  //       if (data.data.length >= 1) {
  //         const filled = notEmpty(req.query)
  //         if (filled) {
  //           let queryKey;

  //           if (req.query.name) queryKey = 'name';
  //           else {
  //             for (let key in req.query) {
  //               queryKey = key;
  //             }
  //           }

  //           const items = [];
  //           data.data.forEach(item => {
  //             if (item[queryKey] === filled) items.push(item)
  //           });
  //           if (items.length >= 1) res.status(200).json(items)
  //           else res.status(404).json({ msg: `cannot find a repo with attribute '${queryKey} : ${filled}'` })
  //         } else res.status(200).json(data.data)
  //       } else res.status(404).json({ msg: 'no starred repositories found' })
  //     })
  //     .catch(err => res.status(500).json(err))
  // },

  // getStarred(req, res) {
  //   repoInstance.get(`/users/${req.params.username}/starred`)
  //     .then(data => {
  //       if (data.data.length >= 1)
  //         res.status(200).json(data.data)
  //       else res.status(404).json({ msg: 'no starred repositories found' })
  //     })
  //     .catch(err => res.status(404).json({ msg: 'user not found' }))
  // },

  // createRepo(req, res) {
  //   repoInstance.post('/user/repos', { name: req.params.name })
  //     .then(() => res.status(200).json({ msg: 'repo created successfully' }))
  //     .catch(err => res.status(422).json({ msg: `repo '${req.params.name}' already exist, please use another name` }))
  // },

  // showDetail(req, res) {
  //   repoInstance.get(`/repos/${req.params.username}/${req.params.reponame}/contents`)
  //     .then(data => {
  //       if (data.data.length >= 1)
  //         res.status(200).json(data.data)
  //       else res.status(404).json({ msg: 'not found' })
  //     })
  //     .catch(err => res.status(500).json({ msg: 'internal server error' }))
  // }
}

