const accounts = require('../models/account');

module.exports = {
    async login(request, response){
        const { username, password } = request.body;
        if(!username || !password){
            response.status(400).json({error: 'Usuários ou Senha não informados'});
        }
        const account = await accounts.findOne({username: username, password: password});
        if(!account){
            response.status(403).json({error: 'Usuário e/ou senha incorretos'})
        }
        response.json(account);
    },
    async signup(request, response){
        const { username, password } = request.body;
        if(!username || !password){
            response.status(400).json({error: 'Usuários ou Senha não informados'});
        }
        const exist = await accounts.findOne({username: username});
        if(!exist){
            const account = await accounts.create({username: username, password: password});
            response.json(account);
        }
        else{
            response.status(400).json({error: 'Username Existente.'});
        }
    }
}