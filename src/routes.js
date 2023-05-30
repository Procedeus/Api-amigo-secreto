const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');

routes.post('/tables', UserController.createTable);
routes.get('/tables', UserController.readTable);

routes.post('/users', UserController.userCreate);
routes.post('/update', UserController.userUpdate);
routes.delete('/users', UserController.userDelete);
routes.post('/shuffle', UserController.userShuffle);

module.exports = routes;