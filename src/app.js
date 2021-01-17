const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const songControllers = require('./controllers/songs')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/artists', artistControllers.create);
app.post('/artists/:artistId/albums', albumControllers.create);
app.post('/album/:albumId/song', songControllers.create);

app.get('/artists', artistControllers.list);
app.get('/artists/albums', albumControllers.list);

app.get('/artists/:id', artistControllers.getArtistById);
app.get('/artists/albums/:id', albumControllers.getAlbumById);

app.patch('/artists/:id', artistControllers.patchArtistById);
app.patch('/artists/albums/:id', albumControllers.patchAlbumById);

app.delete('/artists/:id', artistControllers.deleteArtistById);
app.delete('/artists/albums/:id', albumControllers.deleteAlbumById);


module.exports = app