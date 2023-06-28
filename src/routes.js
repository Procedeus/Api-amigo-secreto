const express = require('express');
const routes = express.Router();

const accountController = require('./controllers/accountController');
const tableController = require('./controllers/tableController');
const userTableController = require('./controllers/userTableController');

routes.post('/login', accountController.login);
routes.post('/signup', accountController.signup);

routes.get('/tables', accountController.verifyToken, tableController.readTable);
routes.post('/tables', accountController.verifyToken, tableController.createTable);
routes.delete('/tables',accountController.verifyToken, tableController.deleteTable);
routes.post('/tablesU', accountController.verifyToken, tableController.updateTable);

routes.post('/users', accountController.verifyToken, userTableController.userCreate);
routes.delete('/users', accountController.verifyToken, userTableController.userDelete);
routes.post('/update', accountController.verifyToken, userTableController.userUpdate);
routes.post('/shuffle', accountController.verifyToken, userTableController.userShuffle);

module.exports = routes;