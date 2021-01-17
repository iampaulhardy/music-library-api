module.exports = (connection, DataTypes) => {
    const schema = {
        name: DataTypes.STRING,
        //artistId: DataTypes.INTEGER,
    };

    const SongModel = connection.define('Song', schema);
    return SongModel;
}