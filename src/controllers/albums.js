// const { Album } = require('../models');
const { Artist, Album } = require('../models');

exports.create = (req, res) => {
  const { artistId } = req.params
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

exports.list = (_, res) => {
  Album.findAll().then(album => { res.status(200).json(album); 
  });
};

exports.getAlbumById = (req, res) => {
  const { id } = req.params;
  Album.findByPk(id).then(album => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(album);
    }
  });
};

exports.patchAlbumById = (req, res) => {
  const { id } = req.params;
  Album.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
      if (!rowsUpdated) {
          res.status(404).json({ error: 'The album could not be found.' });
      } else {
          res.status(200).json(rowsUpdated);
      }
  });
};

exports.deleteAlbumById = (req, res) => {
  const { id } = req.params;
  Album.destroy({ where: { id } }).then(album => {
      if (!album) {
          res.status(404).json({ error: 'The album could not be found.' });
        } else {
          res.status(204).json(album);
        }
  })
};
