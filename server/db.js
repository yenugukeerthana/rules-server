var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'openchs',
  user: 'amol',
  password: ''
};
var db = pgp(connectionString);
export default db;