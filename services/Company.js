const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

class Company {
    constructor (name, email, password, cnpj, phoneNumber, logo) {
        if(!this.id) {
            this.id = uuid();
        }
        this.email = email;
        this.name = name;
        this.password = password;
        this.cnpj = cnpj;
        this.phoneNumber = phoneNumber;
        this.typeOfUser = "company";
        this.logo = logo
    }

    async generateCompany() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificação de senha != "", e HASH da mesma
        if(this.password) {
            const hashedPassWord = await bcrypt.hash(this.password, 8) 

            this.password = hashedPassWord
        }

        //Verificação da existência de um usuário com o mesmo EMAIL ou CNPJ

        const rowsEmailCompanyTable = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${this.email}"`);
        const rowsEmailUserTable = await db.all(`SELECT * \ FROM users \ WHERE email = "${this.email}"`);

        const rowsCNPJ = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE cnpj = "${this.cnpj}"`);

        if (rowsEmailCompanyTable[0] != undefined || rowsEmailUserTable[0] != undefined) {
            const error = {
                type: 'error',
                message: 'Email already in use'
            }
            return error
        }

        if (rowsCNPJ[0] != undefined) {
            const error = {
                type: 'error',
                message: 'Company Already Registered With This CNPJ'
            }
            return error
        }

        //Validação se nenhum dado passado foi igual a ""

        if (!this.email) {
            const error = {
                type: 'error',
                message: 'Incorrect Email'
            }
            return error
        }

        if (!this.name) {
            const error = {
                type: 'error',
                message: 'Incorrect Name'
            }
            return error
        }

        if (!this.password) {
            const error = {
                type: 'error',
                message: 'Incorrect Password'
            }
            return error
        }

        if (!this.cnpj) {
            const error = {
                type: 'error',
                message: 'Incorrect CNPJ'
            }
            return error
        }

        if (!this.phoneNumber) {
            const error = {
                type: 'error',
                message: 'Incorrect Phone Number'
            }
            return error
        }

        //Inserção das informações dentro do DB
        const inserction = await db.run("INSERT INTO TB_COMPANY (id, name, email, password, cnpj, phoneNumber, typeOfUser, logo, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.email , this.password, this.cnpj, this.phoneNumber, this.typeOfUser, this.logo])
        
        //Verifica se a inserção foi bem sucedido e assim retorna SUCESSO ou ERRO ao usuário
        if (inserction.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        const sucess = {
            type: 'success',
            message: {
                id: this.id,
                name: this.name,
                email: this.email
            }
        }
        return sucess
    }

async updateCompany(idCompany, name, email, password, cnpj, phoneNumber, logo) {

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idCompany) {
            const error = {
                type: 'error',
                message: 'Any ID of company (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${idCompany}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Company not found'
            }
            return error
        }

        //Verificar qual ou quais informação que o usuário deseja atualizar
        if(name) {
            queryComponent.push(`name="${name}"`)
        }
        if(email) {
            queryComponent.push(`email="${email}"`)
        }
        if(password) {
            const passwordHashed = await bcrypt.hash(password, 8)
            queryComponent.push(`password="${passwordHashed}"`)
        }
        if(cnpj) {
            queryComponent.push(`cpf="${cnpj}"`)
        }
        if(phoneNumber) {
            queryComponent.push(`phoneNumber="${phoneNumber}"`)
        }
        if(logo) {
            queryComponent.push(`logo="${logo}"`)
        }

        //Validar se nenhuma informação foi enviada ao servidor
        if (!name && !email && !password && !cnpj && !phoneNumber && !logo) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }

        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE TB_COMPANY SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idCompany}"`)
        if (Update.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Informa a atualização
        const sucess = {
            type: 'sucess',
            message: 'Informations Updated',
        }

        return sucess
    }

    async deleteCompany(id) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se a empresa passada é válida
        if (!id) {
            const error = {
                type: 'error',
                message: 'Any ID of company (to delete) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${id}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Company not found'
            }
            return error
        }

        //Efetua a deleção
        const deletedCompany = await db.run(`DELETE FROM TB_COMPANY WHERE id="${id}"`)

        //Verifica se a chamada para o DB ocorreu sem problemas
        if (deletedCompany.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Mostra a validação de que o usuário foi deletado
        const sucess = {
            type: 'sucess',
            message: 'Informations Deleted',
        }

        return sucess
    }

    async getCompany(id) {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega a empresa correspondente ao id passado
        const getCompanies = await db.all(`SELECT * FROM TB_COMPANY WHERE id="${id}"`)

        if (!getCompanies[0]) {
            const error = {
                type: 'error',
                message: 'Empresa não encontrada',
                isCompany: false
            }

            return error
        }

        //Mostra a validação de que o usuário foi deletado
        const sucess = {
            type: 'sucess',
            message: 'Usuário é uma empresa',
            isCompany: true,
            name_company: getCompanies[0].name,
            id_company: getCompanies[0].id
        }
        return sucess
    }

    async getCompanies() {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega do banco de dados todas as empresas cadastradas
        const getCompanies = await db.all("SELECT name, id FROM TB_COMPANY")

        if (getCompanies == '') {
            const error = {
                type: 'error',
                message: 'Não há nenhuma empresa cadastrada'
            }

            return error
        }

        const sucess = {
            type: 'sucess',
            message: getCompanies,
        }

        return sucess
    }
}

module.exports = {
    Company
}