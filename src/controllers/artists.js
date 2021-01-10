const { Artist } = require('../models');

exports.create = (req, res) => {
    Artist.create(req.body).then(artist => res.status(201).json(artist));
};

exports.list = (_, res) => {
    Artist.findAll().then(artist => { res.status(200).json(artist); 
    });
};

exports.getArtistById = (req, res) => {
    const { id } = req.params;
    Artist.findByPk(id).then(artist => {
      if (!artist) {
        res.status(404).json({ error: 'The artist could not be found.' });
      } else {
        res.status(200).json(artist);
      }
    });
};

exports.patchArtistById = (req, res) => {
    const { id } = req.params;
    Artist.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
        if (!rowsUpdated) {
            res.status(404).json({ error: 'The artist could not be found.' });
        } else {
            res.status(200).json(rowsUpdated);
        }
    });
};

exports.deleteArtistById = (req, res) => {
    const { id } = req.params;
    Artist.destroy({ where: { id } }).then(artist => {
        if (!artist) {
            res.status(404).json({ error: 'The artist could not be found.' });
          } else {
            res.status(204).json(artist);
          }
    })
};

//exports.patchArtistById = (req, res) => {
//    const { id } = req.params;
//    Artist.findByPk(id).then(artist => {
//        if (!artist) {
//            res.status(404).json({ error: 'The artist could not be found.' });
//        } else {
//            Artist.update({ genre: req.body.genre }, {where: { id: id }}).then(artist => { res.status(200).json(artist)});
//        }
//   })

