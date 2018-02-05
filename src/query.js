/* eslint no-underscore-dangle: "off" */

const nodeDb = require('nano')('http://node_user:reallysecure@localhost:5984/node_db');

function queryData(qry) {
  return new Promise((resolve, reject) => {
    nodeDb.fetch(qry, (err, body) => {
      if (err) reject(new Error(`There was a problem querying the database.\nQuery: ${qry}\nError: ${err}`));
      resolve(body);
    });
  });
}

function getAllData() {
  return new Promise((resolve, reject) => {
    nodeDb.list({ include_docs: true }, (err, body) => {
      if (err) reject(new Error(`There was a problem querying the database.\n${err}`));
      resolve(body);
    });
  });
}

function insertOrUpdate(data) {
  return new Promise((resolve, reject) => {
    const toDb = data;
    if (!toDb._id) toDb._id = toDb.name.toLowerCase;
    nodeDb.insert(toDb, (err, body) => {
      if (err) reject(new Error(`There was a problem inserting data into the database.\n${err}`));
      resolve(body);
    });
  });
}

module.exports = {
  queryData,
  getAllData,
  insertOrUpdate,
};
