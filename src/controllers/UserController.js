const Users = require('../models/UserData');
const Tables = require('../models/Table');

module.exports = {
    async userCreate(request, response){
        const { id, name, email } = request.body;

        if(!id){
            return response.status(400).json({error: "Tabela não encontrada"})
        } else if(name || !email){
            return response.status(400).json({error: "Nome/Email não informado."})
        }

        const Tables = await Tables.findById({_id: id});
        Tables.users.push({
            name,
            email,
            gift: ''
        });
        Tables.save((err, result) => {
            if (err) {
                return response.status(400).json({error: "Erro ao criar usuário."});
            } 
        });
        return response.json({message: 'Usuário criado com sucesso'});
    },

    async userUpdate(request, response){
        const { table, user, name, email } = request.body;
        Tables.updateOne(
            { _id: table, 'users._id': user },
            { $set: { 'users.$.name': name, 'users.$.email': email } },
            (err, result) => {
              if (err) {
                return response.status(404).json('Erro ao excluir usuário:', err)
              } else if (result.modifiedCount === 0) {
                return response.status(400).json('Usuário não encontrado')
              } else{
                response.json({message: 'Usuário alterado com sucesso'});
              }
            }
          );
    },

    async userDelete(request, response){
        const { table, user } = request.body;
        Tables.updateOne(
            { _id: table },
            { $pull: { users: { _id: user } } },
            (err, result) => {
              if (err) {
                return response.status(404).json('Erro ao excluir usuário:', err)
              } else if (result.modifiedCount === 0) {
                return response.status(400).json('Usuário não encontrado')
              } else{
                response.json({message: 'Usuário excluído com sucesso'});
              }
            }
          );
    },

    async userShuffle(request, response){
        const { id } = request.params;
        const table = await Tables.find({_id: id});
        const userList = table.users;
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
    },

    async createTable(request, response){
        const { name } = request.params;

        if(!name ){
            return response.status(400).json({error: "Nome não informado."})
        }

        const tableCreated = await Tables.create({
            name
        });
        return response.json({message: 'Tabela criada com sucesso'});
    },

    async readTable(request, response){
        const tableList = await Tables.find();
        
        return response.json(tableList);
    }
}