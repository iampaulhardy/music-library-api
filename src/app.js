const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/artists', artistControllers.create);
app.post('/artists/:artistId/albums', albumControllers.create);

app.get('/artists', artistControllers.list);
app.get('/artists/:id', artistControllers.getArtistById);
app.patch('/artists/:id', artistControllers.patchArtistById);
app.delete('/artists/:id', artistControllers.deleteArtistById);



module.exports = app