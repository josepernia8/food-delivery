const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.POSTGRES_HOST;

db = pgp(connectionString);
module.exports = {
  db,
  pgp
};