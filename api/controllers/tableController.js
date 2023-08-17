const tables = require('../models/table');
const usersTable = require('../models/userTable');

module.exports = {

    async readTable(request, response) {
      const accountId = request.accountId;
      try {
        const tableList = await tables.find({accountId: accountId});
    
        const userListPromises = tableList.map(async table => {
          const userList = await usersTable.find({ tableId: table._id });
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
        const accountId = request.accountId;

        if(!name ){
            return response.status(400).json({error: "Nome não informado."})
        }

        const tableCreated = await tables.create({
            name,
            accountId
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

        const tableUpdated = await tables.findOne({ _id: table});
        if(tableUpdated){
          tableUpdated.name = name;
          tableUpdated.save();
        }
        return response.json(tableUpdated);
    },
    
    async deleteTable(request, response){
      const { table } = request.body;
      tables.findOneAndDelete({ _id: table }, (err, deletedTable) => {
        if (err) {
          return response.status(404).json('Erro ao excluir tabela:', err);
        } else if (!deletedTable) {
          return response.status(400).json('Tabela não encontrada');
        } else {
          usersTable.deleteMany({tableId: table})
          .then(() => {
            return response.json(deletedTable);
          })
          .catch(error => {
            return response.status(500).json({error: error});
          });
        }
      });
    }
}