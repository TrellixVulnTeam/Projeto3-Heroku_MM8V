const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

const ensureCompany = async ( req, res, next ) => {
    //Instancia o DB
    const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

    //Verifica se é uma empresa
    const { user_id } = req

    //Faz uma requisição no DB, verificando a existência do usuário
    const rowsInUser = await db.all(`SELECT * \ FROM users \ WHERE id = "${user_id}"`);
    const rowsInCompany = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${user_id}"`);

    //Verifica se o usuário encontrado é um admin, se for libera
    if (rowsInUser[0]) {
        if (rowsInUser[0].isAdmin != 1) {
            res.status(401).json({
                "message": "You don't have permission to this action"
            })
            return
        }
        return next();
    }

    //Verifica se é uma empresa, se for libera
    if (rowsInCompany[0]) {
        return next();
    }


    //Qualquer outro problema
    res.status(401).json({
        "message": "Sorry try again later"
    })
    return
}

//Exporta como MIDDLEWARE
module.exports = {ensureCompany}