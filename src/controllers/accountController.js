require('dotenv').config();
const accounts = require('../models/account');
const jwt = require('jsonwebtoken');

function createToken(id){
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = {
        userId: id
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
    return token;
}

module.exports = {
    async login(request, response){
        const { username, password } = request.body;
        if(!username || !password){
            return response.status(400).json({error: 'Usuários ou Senha não informados'});
        }
        const account = await accounts.findOne({username: username, password: password});
        if(!account){
            return response.status(403).json({error: 'Usuário e/ou senha incorretos'})
        }
        const token = createToken(account[0]?._id);
        return response.json(token);
    },
    async signup(request, response){
        const { username, password } = request.body;
        if(!username || !password){
            return response.status(400).json({error: 'Usuários ou Senha não informados'});
        }
        const exist = await accounts.findOne({username: username});
        if(!exist){
            const account = await accounts.create({username: username, password: password});
            const token = createToken(account._id);
            return response.json(token);
        }
        else{
            return response.status(400).json({error: 'Username Existente.'});
        }
    },
    
    verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token não encontrado' });
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
          const decodedToken = jwt.verify(token, secretKey);
          req.decodedToken = decodedToken;
          next();
        } catch (error) {
          return res.status(400).json({ error: 'Token Invalido' });
        }
    }
}