const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');

routes.post('/tables', UserController.createTable);
routes.get('/tables', UserController.readTable);

routes.post('/users', UserController.userCreate);
routes.delete('/users', UserController.userDelete);

routes.post('/update', UserController.userUpdate);
routes.post('/shuffle', UserController.userShuffle);

module.exports = routes;