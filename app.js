const express = require("express");
const { getTopics } = require('./controllers.js');
const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

require('./errors');

module.exports = app;