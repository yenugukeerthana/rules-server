var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = {
  host: 'localhost',
  port: 5432,
  database: process.env.OPENCHS_DATABASE || 'openchs',
  user: process.env.OPENCHS_DATABASE_USER || 'openchs',
  password: process.env.OPENCHS_DATABASE_PASSWORD || 'password',
};
var db = pgp(connectionString);
export default db;
