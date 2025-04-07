const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb://localhost:27017') //connets to the mongodb server
  database = client.db('online-shop') //connect to the actual database in mongodb
}


function getDb() {
  if (!database) {
    throw new Error();
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
}