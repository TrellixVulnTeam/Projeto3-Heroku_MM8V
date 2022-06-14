const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../dao/smtp')

class User {
    constructor (name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser) {
        if(!this.id) {
            this.id = uuid();
        }
        this.email = email;
        this.name = name;
        this.password = password;
        this.bornDate = bornDate;
        this.gender = gender;
        this.cpf = cpf;
        this.phoneNumber = phoneNumber;
        this.typeOfUser = typeOfUser
        this.curriculum = "";
    }

    async generateUser() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificação de senha != "", e HASH da mesma
        if(this.password) {
            const hashedPassWord = await bcrypt.hash(this.password, 8) 

            this.password = hashedPassWord
        }

        //Verificação da existência de um usuário com o mesmo EMAIL ou CPF

        const rowsEmailUserTable = await db.all(`SELECT * \ FROM users \ WHERE email = "${this.email}"`);
        const rowsEmailCompanyTable = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${this.email}"`);

        const rowsCPF = await db.all(`SELECT * \ FROM users \ WHERE cpf = "${this.cpf}"`);

        if (rowsEmailUserTable[0] || rowsEmailCompanyTable[0] ) {
            const error = {
                type: 'error',
                message: 'Email already in use'
            }
            return error
        }

        if (rowsCPF[0] != undefined) {
            const error = {
                type: 'error',
                message: 'User Already Registered With This CPF'
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

        if (!this.bornDate) {
            const error = {
                type: 'error',
                message: 'Incorrect BornDate'
            }
            return error
        }

        if (!this.gender) {
            const error = {
                type: 'error',
                message: 'Incorrect Gender'
            }
            return error
        }

        if (!this.cpf) {
            const error = {
                type: 'error',
                message: 'Incorrect CPF'
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
        const inserction = await db.run("INSERT INTO users (id, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.email , this.password, this.bornDate, this.gender, this.cpf, this.phoneNumber, this.curriculum, this.typeOfUser])
        
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

    async Authentication(emailAuth, passwordAuth) {

        //Validar os dados passados
        if (!emailAuth) {
            const error = {
                type: 'error',
                message: 'Email are required'
            }
            return error
        }

        if (!passwordAuth) {
            const error = {
                type: 'error',
                message: 'Password are required'
            }
            return error
        }

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Requisição de busca na tabela "users" para verificar a existência de um usuário com o email indicado no LOGIN
        const rowsEmailTableUser = await db.all(`SELECT * \ FROM users \ WHERE email = "${emailAuth}"`);
        const rowsEmailTableCompany = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${emailAuth}"`);

        //Verifica se o usuário existe
        if (!rowsEmailTableUser[0] && !rowsEmailTableCompany[0]) {
            const error = {
                type: 'error',
                message: 'Invalid Email or Password'
            }
            return error
        }

        //Verificar se a senha inserida corresponde a do usuário
        let passwordMatch
        if (rowsEmailTableUser[0]) {
            passwordMatch = await bcrypt.compare(passwordAuth, rowsEmailTableUser[0].password);
        } else {
            passwordMatch = await bcrypt.compare(passwordAuth, rowsEmailTableCompany[0].password);
        }
        

        if(!passwordMatch) {
            const error = {
                type: 'error',
                message: 'Invalid Email or Password'
            }
            return error
        }

        //Gera o token de segurança do usuário, que possui tempo de expiração
        let token
        let typeOfUser

        if (rowsEmailTableUser[0]) {
            token = jwt.sign({
                email: rowsEmailTableUser[0].email
            }, "4b0d30a9f642b3bfff67d0b5b28371a9", {
                subject: rowsEmailTableUser[0].id,
                expiresIn: "1h"
            });
            typeOfUser = rowsEmailTableUser[0].typeOfUser
        } else {
            token = jwt.sign({
                email: rowsEmailTableCompany[0].email
            }, "4b0d30a9f642b3bfff67d0b5b28371a9", {
                subject: rowsEmailTableCompany[0].id,
                expiresIn: "1h"
            });
            typeOfUser = rowsEmailTableCompany[0].typeOfUser
        }
        const sucess = {
            type: 'sucess',
            message: 'Validated Credentials. User Logged',
            token: token,
            typeOfUser: typeOfUser
        }

        return sucess
    }

    async updateUser(idUser, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, softSkills, hardSkills) {

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'Any ID of user (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${idUser}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'User not found'
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
        if(bornDate) {
            queryComponent.push(`bornDate="${bornDate}"`)
        }
        if(gender) {
            queryComponent.push(`gender="${gender}"`)
        }
        if(cpf) {
            queryComponent.push(`cpf="${cpf}"`)
        }
        if(phoneNumber) {
            queryComponent.push(`phoneNumber="${phoneNumber}"`)
        }
        if(curriculum) {
            queryComponent.push(`curriculum='${curriculum}'`)
        }
        if(typeOfUser) {
            queryComponent.push(`typeOfUser="${typeOfUser}"`)
        }
        if(softSkills) {
            queryComponent.push(`softSkills="${softSkills}"`)
        }
        if(hardSkills) {
            queryComponent.push(`hardSkills="${hardSkills}"`)
        }
        //Validar se nenhuma informação foi enviada ao servidor
        if (!name && !email && !password && !bornDate && !gender && !cpf && !phoneNumber && !curriculum && !typeOfUser && !softSkills && !hardSkills) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }

        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE users SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idUser}"`)
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

    async deleteUser(id) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se o usuário passado é válido
        if (!id) {
            const error = {
                type: 'error',
                message: 'Any ID of user (to delete) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Efetua a deleção
        const deletedUser = await db.run(`DELETE FROM users WHERE id="${id}"`)
        //Verifica se a chamada para o DB ocorreu sem problemas
        if (deletedUser.changes == 0) {
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

    async verifyCurriculum(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se um ID foi passado
        if (!id) {
            const error = {
                type: 'error',
                message: 'Needed ID to do this check'
            }
            return error
        }

        //Verificar se o ID passado existe
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Any users with this ID'
            }
            return error
        }

        //Verificar se existe currículo cadastrado para aquele ID
        const curriculum = rowsId[0].curriculum
        const softSkills = rowsId[0].softSkills

        let resp = {
            type: 'success',
        }

        if(!curriculum) {
            resp += {
                haveCurriculum: false
            }
        }

        if(!softSkills) {
            resp += {
                haveSoftSkills: false
            }
        }

        if (!curriculum || !softSkills) {
            return resp
        }

        const success = {
            type: 'success',
            message: "User exists, and have a curriculum",
            haveCurriculum: true,
            haveSoftSkills: true,
            curriculum: curriculum,
        }
        return success
    }

    async changeUserPermission(id, isAdmin) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se um ID foi passado e se um isAdmin também
        if (!id) {
            const error = {
                type: 'error',
                message: 'Needed ID to do this check'
            }
            return error
        }

        if (!isAdmin) {
            const error = {
                type: 'error',
                message: 'Needed a permission to user'
            }
            return error
        }

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Any users with this ID'
            }
            return error
        }

        //Altera o tipo de permissão do Usuário
        const isAdminUpdate = await db.run(`UPDATE users SET isAdmin='${isAdmin}', updated_at=DateTime('now','localtime') WHERE id="${id}"`)
        if (isAdminUpdate.changes == 0) {
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

    async getUser(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Validação infos passadas na REQ
        if (!id) {
            const error = {
                type: 'error',
                message: 'ID is needed to this action'
            }
            return error
        }

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            user: rowsId[0]
        }

        return sucess

    }

    async getUsers() {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega do banco de dados todas as empresas cadastradas
        const getUsers = await db.all("SELECT name, id FROM users")

        if (getUsers == '') {
            const error = {
                type: 'error',
                message: 'Não há nenhum usuário cadastrado'
            }

            return error
        }

        const sucess = {
            type: 'sucess',
            message: getUsers,
        }

        return sucess
    }

    //SOMENTE PARA O TOKEN, JAMAIS FAÇA REQUISIÇÃO AQUI
    async getInfosTemp(idUser) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Valida se o ID está preenchido
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'Invalid ID'
            }
            return error
        }

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${idUser}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Captura as informações do DB
        const { id, name, email, isAdmin, hardSkills, softSkills } = rowsId[0]

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            name: name,
            id: idUser,
            email: email,
            isAdmin: isAdmin,
            hardSkills: hardSkills,
            softSkills: softSkills
        }

        return sucess
    }

    async getVagasAplicadas(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Carrega todas as vagas para as quais os usuários se aplicaram
        
    }

    async forgetPassword(email) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o usuário com o EMAIL passado
        const rowsEmail = await db.all(`SELECT * \ FROM users \ WHERE email = "${email}"`);

        if (rowsEmail == "") {
            const error = {
                type: 'success',
                message: 'Email verification was sent',
                trueMessage: false
            }
            return error
        }

        //Gera um código para troca de senha
        var resetCode = Math.floor(1000 + Math.random() * 9000);

        //Envia o email ao usuário
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailSent = await transporter.sendMail({
            text: 'Texto do Email',
            subject: 'Assunto da mensagem',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${email}`,
            html: `
            <!doctype html>
            <html lang="en-US">

            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>

            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                    <a href="https://braziliansintech.com" title="logo" target="_blank">
                                        <img width="160" src="https://braziliansintech.com/static/img/logo.png" title="logo" alt="logo">
                                    </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#F3C42E; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Você esqueceu sua senha?</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Se você não solicitou nenhuma alteração de senha somente ignore está mensagem e se possível nos avise o quando antes para evitarmos tal situação com os demais. Caso a solicitação tenha sido feita, abaixo se encontra o código de verificação que você utilizará na aplicação para redefinição da senha.</p>
                                                <label style="display:inline-block; vertical-align:middle; font-family:'Rubik',sans-serif;color:#455056; font-size:15px;line-height:24px; margin:0;">Código de Redefinição: </label>
                                                    <label href="javascript:void(0);"
                                                        style="background:#530084;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${resetCode}</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.braziliansintech.com</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>

            </html>
            `
        })

        //Salva o código enviado para o usuário no Banco de Dados
        const setResetCode = await db.run(`UPDATE users SET resetPassCode="${resetCode}" WHERE email = "${email}"`);

        if (setResetCode.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            message: "Instruções enviadas por email",
            trueMessage: true
        }

        return sucess
    }

    async resetPasswordByCode(email, resetCode, newPass) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica se nada passado na requisição foi igual a ""
        if(!email) {
            const error = {
                type: 'error',
                message: 'Email is needed to this action'
            }
            return error
        }
        if(!resetCode) {
            const error = {
                type: 'error',
                message: "You don't have permission to this action"
            }
            return error
        }
        if(!newPass) {
            const error = {
                type: 'error',
                message: "You need to pass a new password to this action"
            }
            return error
        }

        //Verifica qual o Código passado para o usuário
        const code = await db.all(`SELECT resetPassCode FROM users WHERE email="${email}"`)
        if(code[0].resetPassCode == '') {
            const error = {
                type: 'error',
                message: "This account didn't solicitated any redifine"
            }
            return error
        }

        if (Number(code[0].resetPassCode) != resetCode) {
            const error = {
                type: 'error',
                message: "Código Inválido"
            }
            return error
        }

        //Redefine a senha
        const hashedPassWord = await bcrypt.hash(newPass, 8)

        const redefinePass = await db.run(`UPDATE users SET password="${hashedPassWord}" WHERE email = "${email}"`);

        if (redefinePass.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Redefine o código de segurança para ""
        await db.run(`UPDATE users SET resetPassCode="" WHERE email = "${email}"`);

        const success = {
            type: 'success',
            message: "Senha alterada com sucesso",
            validation: true
        }
        return success
    }
}

module.exports = {
    User
}