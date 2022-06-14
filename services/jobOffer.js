const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

class jobOffer {

    constructor(name, type, local, description, requirements, hardSkills, name_company, id_company) {
        if(!this.id) {
            this.id = uuid();
        }
        this.name = name,
        this.type = type,
        this.local = local,
        this.description = description,
        this.requirements = requirements,
        this.hardSkills = hardSkills,
        this.nameCompany = name_company,
        this.idCompany = id_company
    }

    async createOffer() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });
        
        //Validação de que todos os dados passados são != de ""
        if(!this.name) {
            const error = {
                type: 'error',
                message: 'Incorrect Name'
            }
            return error
        }
        if(!this.type) {
            const error = {
                type: 'error',
                message: 'Incorrect Type'
            }
            return error
        }
        if(!this.local) {
            const error = {
                type: 'error',
                message: 'Incorrect Local'
            }
            return error
        }
        if(!this.description) {
            const error = {
                type: 'error',
                message: 'Incorrect Description'
            }
            return error
        }
        if(!this.requirements) {
            const error = {
                type: 'error',
                message: 'Incorrect Requirements'
            }
            return error
        }
        if(!this.hardSkills) {
            const error = {
                type: 'error',
                message: 'Incorrect HardSkills'
            }
            return error
        }
        if(!this.nameCompany) {
            const error = {
                type: 'error',
                message: 'Incorrect Company Name'
            }
            return error
        }
        if(!this.idCompany) {
            const error = {
                type: 'error',
                message: 'Incorrect Company ID'
            }
            return error
        }

        //Validação da existência de outra vaga que possua a mesmo ID dessa que está sendo criada
        const rowsID = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${this.id}"`);

        if(rowsID[0]) {
            const error = {
                type: 'error',
                message: 'Another JobOffer already have this ID. Please try again.'
            }
            return error
        }
        
        //Inserção de infos passadas no DB
        const inserction = await db.run("INSERT INTO TB_JOBOFFER (id, name, type, location, description, requirements, hardSkills, name_company, id_company, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.type , this.local, this.description, this.requirements, this.hardSkills, this.nameCompany, this.idCompany]);

        if (inserction.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Informa a adição
        const sucess = {
            type: 'sucess',
            message: 'Informations Added',
            id_offer: this.id
        }
        return sucess
    }

    async updateOffer(idOffer, name, type, location, description, requirements, hardSkills, softSkills, nameCompany, idCompany) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Criação variavel query
        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idOffer) {
            const error = {
                type: 'error',
                message: 'Any ID of offer (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${idOffer}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Offer not found'
            }
            return error
        }
        //Verificação quais informações foram solicitada a alteração
        if(name) {
            queryComponent.push(`name="${name}"`)
        }
        if(type) {
            queryComponent.push(`type="${type}"`)
        }
        if(location) {
            queryComponent.push(`location="${location}"`)
        }
        if(description) {
            queryComponent.push(`description="${description}"`)
        }
        if(requirements) {
            queryComponent.push(`requirements="${requirements}"`)
        }
        if(hardSkills) {
            queryComponent.push(`hardSkills="${hardSkills}"`)
        }
        if(softSkills) {
            queryComponent.push(`softSkills="${softSkills}"`)
        }
        if(nameCompany) {
            queryComponent.push(`name_company="${nameCompany}"`)
        }

        if(idCompany) {
            queryComponent.push(`id_company="${idCompany}"`)
        }
        //Validação se nenhum dado foi passado
        if (!name && !type && !location && !description && !requirements && !hardSkills && !softSkills && !nameCompany && !idCompany) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }
        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE TB_JOBOFFER SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idOffer}"`)

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

    async deleteOffer(idOffer) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica se o ID da vaga foi passado
        if(!idOffer) {
            const error = {
                type: 'error',
                message: 'ID is needed to delete the offer'
            }
            return error
        }
        //Verifica se o ID da vaga passado realmente existe
        const rowsIdDelete = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${idOffer}"`);

        if(!rowsIdDelete[0]) {
            if(!idOffer) {
                const error = {
                    type: 'error',
                    message: 'Any offer was found with this ID'
                }
                return error
            }
        }
        //Efetua a deleção
        const deleteOffer = await await db.run(`DELETE FROM TB_JOBOFFER WHERE id="${idOffer}"`);

        if (deleteOffer.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Informa a deleção

        const sucess = {
            type: 'sucess',
            message: 'Offer deleted',
        }

        return sucess
    }

    async applyOffer(idUser, idVaga) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Validação dos dados passados
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'ID of an user is needed'
            }
            return error
        }
        if (!idVaga) {
            const error = {
                type: 'error',
                message: 'ID of an vaga is needed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${idUser}"`);

        if(rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Companies cannot apply'
            }
            return error
        }

        //Criação de ID para identificar a aplicação
        const idApplicant = uuid();

        //Verifica se o ID criado já existe ou não
        const rowsIdApplicant = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id = "${idApplicant}"`);

        if(rowsIdApplicant[0]) {
            const error = {
                type: 'error',
                message: 'Internal Server Error'
            }
            return error
        }

        //Verifica do ID da empresa
        const forId = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${idVaga}"`)

        if (!forId[0]) {
            const error = {
                type: 'error',
                message: 'Any Offer was found with this ID'
            }
            return error
        }

        //Valida se o usuário já aplicou para essa vaga
        const alreadyExists = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id_vaga = "${idVaga}" AND id_users = "${idUser}"`)

        if (alreadyExists != "") {
            const error = {
                type: 'error',
                message: 'User already applied to that Offer'
            }
            return error
        }

        const idCompany = forId[0].id_company

        //Adiciona a aplicação
        const insertApllicant = await db.run("INSERT INTO TB_JOBOFFER_USERS (id, id_vaga, id_users, id_company) VALUES (?,?,?,?)", [idApplicant, idVaga, idUser, idCompany]);

        if (insertApllicant.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Informa a adição da aplicação
        const sucess = {
            type: 'sucess',
            message: 'Applicant Added',
        }

        return sucess
    }

    async removeApply(idUser, idVaga) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Validar se informações passadas != nula
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'ID of user is needed to this action'
            }
            return error
        }

        if (!idVaga) {
            const error = {
                type: 'error',
                message: 'ID of offer is needed to this action'
            }
            return error
        }

        //Valida se o usuário está aplicado para a vaga
        const isApplied = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id_vaga = "${idVaga}" AND id_users = "${idUser}"`)

        if (isApplied == "") {
            const error = {
                type: 'error',
                message: 'User are not aplied to that offer'
            }
            return error
        }

        //Efetua a remoção da aplicação
        const delecao = await db.run(`DELETE FROM TB_JOBOFFER_USERS WHERE id_vaga = "${idVaga}" AND id_users = "${idUser}"`)

        if (delecao.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Confirma a deleção
        const sucess = {
            type: 'sucess',
            message: 'Applicant Removed',
        }

        return sucess
    }

    async verifyApply(idUser, idVaga) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Valida se informações passadas são != null
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'ID of user is needed to this action'
            }
            return error
        }

        if (!idVaga) {
            const error = {
                type: 'error',
                message: 'ID of offer is needed to this action'
            }
            return error
        }

        //Verifica se o usuário está candidatado ou não
        const verificacao = await db.all(`SELECT * FROM TB_JOBOFFER_USERS WHERE id_vaga = "${idVaga}" AND id_users = "${idUser}"`)

        if(verificacao == '') {
            //Confirma a informação
            const sucess = {
                type: 'sucess',
                message: 'User not applied',
                applied: false,
            }

            return sucess
        } else {
            //Confirma a informação
            const sucess = {
                type: 'sucess',
                message: 'User applied',
                applied: true,
            }

            return sucess
        }
    }

    async getOffer(id) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica se o ID foi passado
        if (!id) {
            const error = {
                type: 'error',
                message: "ID was not passed"
            }
            return error
        }

        //Verifica em quais vagas o usuário está
        const query = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS WHERE id_users="${id}"`)

        if (!query) {
            const error = {
                type: 'error',
                message: "User don't have any apply"
            }
            return error
        }

        let vagas = []

        let count = 0
        while (count < query.length) {
            await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${query[count].id_vaga}"`).then((res) => {
                res[0].status = query[0].status
                vagas.push(res[0])
            })
            count++
        }

        const sucess = {
            type: 'sucess',
            vagas: vagas
        }

        return sucess

    }

    async getOfferCompany(id) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica se o ID foi passado
        if (!id) {
            const error = {
                type: 'error',
                message: "ID was not passed"
            }
            return error
        }

        //Verifica em quais vagas o usuário está
        const query = await db.all(`SELECT * \ FROM TB_JOBOFFER WHERE id_company="${id}"`)

        if (!query) {
            const error = {
                type: 'error',
                message: "User don't have any apply"
            }
            return error
        }

        // let vagas = []

        // let count = 0
        // while (count < query.length) {
        //     await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${query[count].id_vaga}"`).then((res) => {
        //         console.log(vagas)
        //         //res[0].status = query[0].status
        //         vagas.push(res[0])
        //     })
        //     count++
        // }

        const sucess = {
            type: 'sucess',
            vagas: query
        }

        return sucess

    }

    async getOffers() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Retorna todas as informações do DB
        const query = await db.all("SELECT * \ FROM TB_JOBOFFER")

        //Retorna as infos pro usuário
        const sucess = {
            type: 'sucess',
            offers: query
        }

        return sucess

    }

    async offerExpanded(idVaga) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Valida se existe um ID da vaga
        if(!idVaga) {
            const error = {
                type: 'error',
                message: "Offer ID is nedded to this action"
            }
            return error
        }

        //Recupera as infos da vaga
        const vaga = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id="${idVaga}"`);

        //Valida a existência de uma vaga
        if(!vaga) {
            const error = {
                type: 'error',
                message: "Offer was not found with this ID"
            }
            return error
        }

        //Retorna a vaga para o usuário

        const sucess = {
            type: 'sucess',
            offer: vaga
        }

        return sucess

    }

    async getUsersApplied(idUser, idOffer) {
        console.log(idUser)
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Valida se o ID foi passado
        if (!idOffer) {
            const error = {
                type: 'error',
                message: "Offer ID is needed to this action"
            }
            return error
        }

        //Valida se existe uma vaga com o ID passado
        const existsOffer = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id="${idOffer}"`);
        if (!existsOffer) {
            const error = {
                type: 'error',
                message: "Offer with this ID really doesn't exists. SORRY :("
            }
            return error
        }

        var cont = 0
        while (cont < existsOffer.length) {
            var id = existsOffer[cont].id_company
            if (id != String(idUser)) {
                const error = {
                    type: 'error',
                    message: "Don't try to snoop into your competitor's stuff"
                }
                return error
            }
            cont++
        }


        

        //Verifica quais usuários estão aplicados para a vaga
        const whichOffers = await db.all(`SELECT id_users \ FROM TB_JOBOFFER_USERS \ WHERE id_vaga="${idOffer}"`);

        let users = []

        let count = 0
        while (count < whichOffers.length) {
            await db.all(`SELECT * \ FROM users \ WHERE id = "${whichOffers[count].id_users}"`).then((res) => {
                users.push(res[0])
            })
            count++
        }

        //Retorna a vaga para o usuário
        const sucess = {
            type: 'sucess',
            users: users
        }

        return sucess
    }
}

module.exports = { jobOffer }