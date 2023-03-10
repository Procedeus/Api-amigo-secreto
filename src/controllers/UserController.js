const Users = require('../models/UserData');
const Accounts = require('../models/AccountData');

module.exports = {

    async signin(request, response){
        const {username, password} = request.body;
        const account = await Accounts.find({username: username, password: password});
        return response.json(account);
    },

    async signup(request, response){
        const { username, password } = request.body;
        const account = await Accounts.find({username: username});
        if(!username || !password){
            return response.status(402).json({error: "Usuário/Senha não informado."})
        }
        else if(account.length)
            return response.status(403).json({error: "Usuário existente."})
        const accountCreated = await Accounts.create({
            username,
            password,
        });
        return response.json(accountCreated);
    },
    async read(request, response){
        const userList = await Users.find();
        return response.json(userList);
    },

    async create(request, response){
        const { name, email } = request.body;

        if(!name || !email){
            return response.status(400).json({error: "Nome/Email não informado."})
        }

        const userCreated = await Users.create({
            name,
            email,
            gift: ''
        });
        return response.json(userCreated);
    },

    async update(request, response){
        const { id } = request.params;
        const { name, email } = request.body;
        const userUpdated = await Users.findOne({ _id: id});
        if(userUpdated){
            userUpdated.name = name;
            userUpdated.email = email;
            await userUpdated.save();
        }

        return response.json(userUpdated);
    },

    async delete(request, response){
        const { id } = request.params;
        const userDeleted = await Users.findOneAndDelete({ _id: id});
        if(!userDeleted){
            return response.status(401).json({error: "Usuário não encontrado."});
        }
        return response.json(userDeleted);
    },
    async raffle(resquest, response){
        const userList = await Users.find();
        var userModif = userList;
        var objects = [];
        var num, userRuffle;
        for(var i = userModif.length; i > 0; i--){
            num = Math.floor(Math.random() * i);
            userRuffle = userModif.at(num);
            userModif = userModif.filter(item => item.name !== userRuffle.name);
            objects.push(userRuffle);
        }
        for(var i = 0; i < userList.length; i++){
            if(objects[i].name == userList[i].name){
                if(i < userList.length - 1){
                    userModif = objects[i + 1];
                    objects[i + 1]  = objects[i];
                    objects[i] = userModif; 
                }
                else if(i == userList.length - 1){
                    userModif = objects[i - 1];
                    objects[i - 1]  = objects[i];
                    objects[i] = userModif;
                }
            }
        }
        for(var i = 0; i < userList.length; i++){
            const userUpdated = userList[i];
            userUpdated.gift = objects[i].name;
            userUpdated.save();
        }
        return response.json(userList);
    }
}