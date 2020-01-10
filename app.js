require('dotenv').config();

const express = require('express')
const router = require('./routes')
const port = process.env.PORT || 3000
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

var cors = require('cors')

app.use(cors())

// const connectdb = require('./config/db')

// connectdb();

app.use('/', router)

// app.use(function (err, req, res, next) {
//     console.error(err)
//     res.status(500).json({ message: err.errors })
// })

app.listen(port, () => {
    console.log(`running`)
})