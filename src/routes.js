const express = require('express');
const routes = express.Router();

const TableController = require('./controllers/tableController');
const userTableController = require('./controllers/userTableController');

routes.get('/tables', TableController.readTable);
routes.post('/tables', TableController.createTable);
routes.delete('/tables', TableController.deleteTable);
routes.post('/tablesU', TableController.updateTable);

routes.post('/users', userTableController.userCreate);
routes.delete('/users', userTableController.userDelete);
routes.post('/update', userTableController.userUpdate);
routes.post('/shuffle', userTableController.userShuffle);

module.exports = routes;