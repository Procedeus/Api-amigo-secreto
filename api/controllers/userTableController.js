const usersTable = require('../models/userTable');

module.exports = {
  
    async userCreate(request, response){
        const { id, name, email } = request.body;
        if(!id){
            return response.status(400).json({error: "Tabela não encontrada"})
        } else if(!name || !email){
            return response.status(400).json({error: "Nome/Email não informado."})
        }

        const userCreated = await usersTable.create({
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
        const userUpdated = await usersTable.findOne({ _id: user});
        if(userUpdated){
            userUpdated.name = name;
            userUpdated.email = email;
            await userUpdated.save();
        }

        return response.json(userUpdated);
    },

    async userDelete(request, response){
        const { user } = request.body;
        if(!user){
            return response.status(400).json('Usuário não encontrado');
        }
        const userDeleted = await usersTable.findOneAndDelete({ _id: user});
        if(!userDeleted){
            return response.status(400).json({error: "Usuário não encontrado"});
        }
        return response.json(userDeleted);
    },

    async userShuffle(request, response) {
        try {
            const { tableId } = request.body;
            if(!tableId){
                return response.status(400).json('Tabela de Usuários não encontrada');
            }
            const userList = await usersTable.find({ tableId });
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
    }
}