const express = require('express');
const routes = express.Router();

const accountController = require('./controllers/accountController');
const tableController = require('./controllers/tableController');
const userTableController = require('./controllers/userTableController');

routes.post('/login', accountController.login);
routes.post('/signup', accountController.signup);

routes.get('/tables', tableController.readTable);
routes.post('/tables', tableController.createTable);
routes.delete('/tables', tableController.deleteTable);
routes.post('/tablesU', tableController.updateTable);

routes.post('/users', userTableController.userCreate);
routes.delete('/users', userTableController.userDelete);
routes.post('/update', userTableController.userUpdate);
routes.post('/shuffle', userTableController.userShuffle);

module.exports = routes;