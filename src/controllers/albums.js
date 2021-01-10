// const { Album } = require('../models');
const { Artist, Album } = require('../models');

exports.create = (req, res) => {
  const { artistId } = req.params
  console.log(req.params.artistId);
  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' })
    } else {
      Album.create({
        name: req.body.name,
        year: req.body.year,
        artistId: artistId
      })
        .then(album => res.status(201).json(album))
    }
  })
}