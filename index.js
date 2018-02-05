const express = require('express');
const bodyParser = require('body-parser');

const {
  queryData,
  getAllData,
  insertOrUpdate,
} = require('./src/query.js');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    queryData(req.query)
      .then(passedData => res.send(passedData))
      .catch(err => res.status(500).send(`There was a problem querying the data.\n${err}`));
  } else {
    getAllData()
      .then((passedData) => {
        res.send(passedData);
      })
      .catch(err => res.status(500).send(`There was a problem querying the data.\n${err}`));
  }
});

app.post('/', (req, res) => {
  insertOrUpdate(req.body)
    .then(passedData => res.send(passedData))
    .catch(err => res.status(500).send(`There was a problem inserting the data.\n${err}`));
});

app.listen('3000');
