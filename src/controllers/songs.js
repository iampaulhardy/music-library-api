// const { Album } = require('../models');
const { Artist, Album, Song } = require('../models');
const { deleteArtistById } = require('./artists');

exports.create = (req, res) => {
    const { albumId } = req.params
    Album.findByPk(albumId, {
        include: [{
            model: Artist,
            as: 'artist' ,
        }]
    })
    .then((album) => {
        console.log(album)
            if (!album) {
                res.status(404).json({ error: 'The album could not be found.' })
            } else {
                Song.create({
                    name: req.body.name,
                    albumId: album.id,
                    artistId: album.artist.id
                })
                    //.then(song => console.log(song))
                    .then(song => res.status(201).json(song))
            }
         })
    .catch(console.error);
}