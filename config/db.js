// require('dotenv').config();
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost/wheathertest', { useNewUrlParser: true, useUnifiedTopology: true });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        // we're connected!
        console.log('Connect mongo')
    });
}