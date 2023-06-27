const express = require("express");
const { getTopics, getApiEndPoints } = require('./controllers.js');
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/', getApiEndPoints)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;