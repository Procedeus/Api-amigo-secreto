const Tables = require('../models/Table');
const TableUsers = require('../models/TableUser');

module.exports = {
    async userCreate(request, response){
        const { id, name, email } = request.body;
        if(!id){
            return response.status(400).json({error: "Tabela não encontrada"})
        } else if(!name || !email){
            return response.status(400).json({error: "Nome/Email não informado."})
        }

        const userCreated = await TableUsers.create({
          tableId: id,
          name,
          email,
          gift: ''
        });
        userCreated.save((err) => {
            if (err) {
                return response.status(400).json({error: "Erro ao criar usuário."});
            } 
        });
        return response.json(userCreated);
    },

    async userUpdate(request, response){
        const { user, name, email } = request.body;

        if(!user){
            return response.status(400).json('Usuário não encontrado');
        } else if(!name || !email){
            return response.status(400).json('Informações vazias');
        }
        const userUpdated = await TableUsers.findOne({ _id: user});
        if(userUpdated){
            userUpdated.name = name;
            userUpdated.email = email;
            await userUpdated.save();
        }

        return response.json(userUpdated);
    },

    async userDelete(request, response){
        const { user } = request.body;
        const userDeleted = await TableUsers.findOneAndDelete({ _id: user});
        if(!userDeleted){
            return response.status(400).json({error: "Usuário não encontrado"});
        }
        return response.json(userDeleted);
    },

    async userShuffle(request, response) {
        try {
            const { tableId } = request.body;
            const userList = await TableUsers.find({ tableId });
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
                user.save();
            }
            
            
            return response.json(userList);

        } catch (error) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async readTable(request, response) {
      try {
        const tableList = await Tables.find();
    
        const userListPromises = tableList.map(async table => {
          const userList = await TableUsers.find({ tableId: table._id });
          table.users = userList;
        });
    
        await Promise.all(userListPromises);
    
        return response.json(tableList);
      } catch (error) {
        return response.status(500).json({ error: 'Internal server error' });
      }
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

        if(!table){
          return response.status(400).json({error: "Tabela não encontrada"})
        } else if(!name){
          return response.status(400).json({error: "Nome não informado."})
        }

        const tableUpdated = await Users.findOne({ _id: table});
        if(tableUpdated){
          tableUpdated.name = name;
          tableUpdated.save();
        }
        return tableUpdated;
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