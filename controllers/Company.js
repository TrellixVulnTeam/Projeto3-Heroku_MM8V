const companyService = require('../services/Company')
require('express-async-errors')

const createCompany = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, cnpj, phoneNumber, logo } = req.body;

    //Instancia a classe criando uma compania
    const company = new companyService.Company(name, email, password, cnpj, phoneNumber, logo);

    //Tratamento das respostas do método da classe
    company.generateCompany().then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    });

    return company
}

const updateCompany = (req, res) => {
    //Pega as infos da requisição
    const { id, name, email, password, cnpj, phoneNumber, logo } = req.body;

    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.updateCompany(id, name, email, password, cnpj, phoneNumber, logo).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })
}

const deleteCompany = (req, res) => {
    //Pega as infos da requisição
    const { id } = req.body;

    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.deleteCompany(id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
            })
        }
    })
}

const getCompanies = (req, res) => {
    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.getCompanies().then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).send({
                message: resul.message
            })
        }
    })
}

const getCompany = (req, res) => {
    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    const { user_id } = req

    //Tratamento das respostas do método da classe
    company.getCompany(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message,
                isCompany: resul.isCompany
            })
        } else {
            res.status(200).send({
                message: resul.message,
                isCompany: resul.isCompany,
                name_company: resul.name_company,
                id_company: resul.id_company
            })
        }
    })
}


//Exporta as funções do controller para o ROUTER
module.exports = {
    createCompany, updateCompany, deleteCompany, getCompanies, getCompany
}