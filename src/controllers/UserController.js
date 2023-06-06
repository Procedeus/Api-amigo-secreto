const Tables = require('../models/Table');

module.exports = {
    async userCreate(request, response){
        const { id, name, email } = request.body;
        if(!id){
            return response.status(400).json({error: "Tabela não encontrada"})
        } else if(!name || !email){
            return response.status(400).json({error: "Nome/Email não informado."})
        }

        const table = await Tables.findById({ _id: id });
        table.users.push({
            name,
            email,
            gift: ''
        });
        table.save((err) => {
            if (err) {
                return response.status(400).json({error: "Erro ao criar usuário."});
            } 
        });
        return response.json(table);
    },

    async userUpdate(request, response){
        const { table, user, name, email } = request.body;

        if(!table || !user){
            return response.status(400).json('Usuário não encontrado');
        } else if(!name || !email){
            return response.status(400).json('Informações vazias');
        }
        Tables.findOneAndUpdate(
            { _id: table, 'users._id': user },
            { $set: { 'users.$.name': name, 'users.$.email': email } },
            { new: true },
            (err, updatedTable) => {
              if (err) {
                return response.status(404).json('Erro ao alterar usuário:', err);
              } else if (!updatedTable) {
                return response.status(400).json('Usuário não encontrado');
              } else{
                return response.json(updatedTable);
              }
            }
          );
    },

    async userDelete(request, response){
        const { table, user } = request.body;
        Tables.findOneAndUpdate(
            { _id: table },
            { $pull: { users: { _id: user } } },
            { new: true }, 
            (err, updatedTable) => {
              if (err) {
                return response.status(404).json('Erro ao excluir usuário:', err);
              } else if (!updatedTable) {
                return response.status(400).json('Usuário não encontrado');
              } else {
                response.json(updatedTable);
              }
            }
          );
    },

    async userShuffle(request, response) {
        try {
            const { tableId } = request.body;
            const table = await Tables.findById(tableId);
            const userList = table.users;
            const userModif = [...userList];
            const objects = [];
            let num, userShuffle;
        
            for (let i = userModif.length; i > 0; i--) {
            num = Math.floor(Math.random() * i);
            userShuffle = userModif[num];
            userModif.splice(num, 1);
            objects.push(userShuffle);
            }
        
            for (let i = 0; i < userList.length; i++) {
                if (objects[i].name === userList[i].name) {
                    if (i < userList.length - 1) {
                    [objects[i], objects[i + 1]] = [objects[i + 1], objects[i]];
                    } else if (i === userList.length - 1) {
                    [objects[i], objects[i - 1]] = [objects[i - 1], objects[i]];
                    }
                }
            }
        
            for (let i = 0; i < userList.length; i++) {
                const user = userList[i];
                user.gift = objects[i].name;
            }
            table.markModified('users');
            await table.save();
            
            return response.json( table );

        } catch (error) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async readTable(request, response){
        const tableList = await Tables.find();
        
        return response.json(tableList);
    },
    async createTable(request, response){
        const { name } = request.body;

        if(!name ){
            return response.status(400).json({error: "Nome não informado."})
        }

        const tableCreated = await Tables.create({
            name
        });
        return response.json(tableCreated);
    },

    async updateTable(request, response){
        const { table, name } = request.body;
        Tables.findOneAndUpdate(
            { _id: table},
            { $set: { name: name} },
            { new: true },
            (err, updatedTable) => {
              if (err) {
                return response.status(404).json('Erro ao alterar tabela:', err);
              } else if (!updatedTable) {
                return response.status(400).json('Tabela não encontrada');
              } else{
                return response.json(updatedTable);
              }
            }
          );
    },
    
    async deleteTable(request, response){
      const { table } = request.body;
      Tables.findOneAndDelete({ _id: table }, (err, deletedTable) => {
        if (err) {
          return response.status(404).json('Erro ao excluir tabela:', err);
        } else if (!deletedTable) {
          return response.status(400).json('Tabela não encontrada');
        } else {
          return response.json(deletedTable);
        }
      });
    }
}