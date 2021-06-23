const mongoose = require('mongoose');

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    const uri = "mongodb://localhost:27017/JestDB";

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };
    await mongoose.disconnect();
    await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};