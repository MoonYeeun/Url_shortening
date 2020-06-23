const mongoURI = "mongodb://localhost:27017/Url";
var MongoClient = require('mongodb').MongoClient;
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
};

module.exports = {
    find: async(query) => {
        try {
            let db = await MongoClient.connect(mongoURI, {useUnifiedTopology:true});
            db = db.db('Url');
            const result = await db.collection('shortUrl').findOne(query);
            return result;

        } catch(err) {
            return err;
        }
    },
    insert: async(query) => {
        try {
            let db = await MongoClient.connect(mongoURI, {useUnifiedTopology:true});
            db = db.db('Url');
            const result = await db.collection('shortUrl').insertOne(query);

            return result;

        } catch(err) {
            return err;
        }
    },
    update: async(query) => {
        try {
            let db = await MongoClient.connect(mongoURI, {useUnifiedTopology:true});
            db = db.db('Url');
            const result = await db.collection('shortUrl').updateOne(query[0],query[1]);

            return result;

        } catch(err) {
            return err;
        }
    }
}