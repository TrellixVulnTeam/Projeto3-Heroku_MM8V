const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

const ensureAdmin = async (req, res, next) => {
    //Instancia o DB
    const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

    //Verificar se o usuário é um administrador
    const { user_id } = req

    const rowsAdmin = await db.all(`SELECT * \ FROM users \ WHERE id = "${user_id}"`);

    //Usuário existe mas não é um Admin
    if(rowsAdmin[0].isAdmin != 1) {
        res.status(401).json({
            message: "You don't have permission to this action"
        })
        return
    }

    return next()
}

//Exporta como MIDDLEWARE
module.exports = {ensureAdmin}