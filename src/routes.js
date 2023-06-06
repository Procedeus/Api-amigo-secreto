const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');

routes.get('/tables', UserController.readTable);
routes.post('/tables', UserController.createTable);
routes.delete('/tables', UserController.deleteTable);

routes.post('/users', UserController.userCreate);
routes.delete('/users', UserController.userDelete);
routes.post('/update', UserController.userUpdate);
routes.post('/shuffle', UserController.userShuffle);

module.exports = routes;