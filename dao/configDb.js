const sqlite3 = require('sqlite3').verbose();

const openDB = () => {
//     var db = new sqlite3.Database('../database/dbMatchgas.db')
//     return db
    let db = new sqlite3.Database("./database/matchagas.db", (err) => { 
    if (err) { 
        console.log('MENÓ deu erro quando foi criar o DB tá. Esse é o erro:', err) 
    } else { 
        console.log('Conexão com o DB criada com sucesso. CHAMA') 
        const createTable = () => {
            db.run("CREATE TABLE IF NOT EXISTS users(id VARCHAR(255) NOT NULL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME , updated_at DATETIME )");
        }
        createTable()
    }
})
}

module.exports = {
    openDB
}