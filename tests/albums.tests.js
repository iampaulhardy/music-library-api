/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
    let artist;

    before(async () => {
        try {
            await Artist.sequelize.sync();
            await Album.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Artist.destroy({ where: {} });
            await Album.destroy({ where: {} });
            artist = await Artist.create({
                name: 'Tame Impala',
                genre: 'Rock',
            });
        } catch (err) {
            console.log(err);
        }
    });

    describe('POST /albums', () => {
        it('creates a new album for a given artist', (done) => {
            request(app)
                .post(`/artists/${artist.id}/albums`)
                .send({
                    name: 'InnerSpeaker',
                    year: 2010,
                })
                .then((res) => {
                    expect(res.status).to.equal(201);

                    Album.findByPk(res.body.id, { raw: true }).then((album) => {
                        expect(album.name).to.equal('InnerSpeaker');
                        expect(album.year).to.equal(2010);
                        expect(album.artistId).to.equal(artist.id);
                        done();
                    });
                });
        });

        it('returns a 404 and does not create an album if the artist does not exist', (done) => {
            request(app)
                .post('/artists/1234/albums')
                .send({
                    name: 'InnerSpeaker',
                    year: 2010,
                })
                .then((res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('The artist could not be found.');

                    Album.findAll().then((albums) => {
                        expect(albums.length).to.equal(0);
                        done();
                    });
                });
        });
    });
    
    describe('with albums in the database', () => {
        let albums;
        beforeEach((done) => {
            Promise.all([
                Album.create({ name: 'Definately Maybe', year: 1994 }),
                Album.create({ name: 'Nevermind', year: 1991 }),
                Album.create({ name: 'OK Computer', year: 1997 }),
            ]).then((documents) => {
                albums = documents;
                done();
            });
        });

        describe('GET /albums', () => {
            it('gets all albums records', (done) => {
                request(app)
                    .get('/artists/albums')
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.length).to.equal(3);
                        res.body.forEach((album) => {
                            const expected = albums.find((a) => a.id === album.id);
                            expect(album.name).to.equal(expected.name);
                            expect(album.year).to.equal(expected.year);
                        });
                        done();
                    });
            });
        });

        describe('GET /artists/albums/:albumId', () => {
            it('gets album by id', (done) => {
                const album = albums[0];
                request(app)
                    .get(`/artists/albums/${album.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal(album.name);
                        expect(res.body.year).to.equal(album.year);
                        done();
                    });
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .get('/artists/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    });
            })
        });

        describe('PATCH /artists/albums/:id', () => {
            it('updates album year by id', (done) => {
                const album = albums[0];
                request(app)
                    .patch(`/artists/albums/${album.id}`)
                    .send({ year: 2021 })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum.year).to.equal(2021);
                            done();
                        });
                    });
            });

            it('updates album name by id', (done) => {
                const album = albums[0];
                request(app)
                    .patch(`/artists/albums/${album.id}`)
                    .send({ name: 'The Stone Roses' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum.name).to.equal('The Stone Roses');
                            done();
                        });
                    });
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .patch('/artists/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    });
            });
        });

        describe('DELETE /artists/albums/:albumID', () => {
            it('deletes album by id', (done) => {
                const album = albums[0];
                request(app)
                    .delete(`/artists/albums/${album.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum).to.equal(null);
                            done();
                        });
                    });
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .get('/artists/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    });
            })
        });
    });
});