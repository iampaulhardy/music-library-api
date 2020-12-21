const express = require('express');
const artistControllers = require('./controllers/artists');
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/artists', artistControllers.create);

module.exports = app