const express = require('express');
const router = express.Router();

//Importações necessárias
const userController = require('../controllers/User')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

//ROUTAS com seus respectivos controlers e middlewares
router.post('/Register', userController.createUser)
router.post('/Login', userController.AuthUser)
router.put('/Update', userAuth.unsureAuthenticated, userController.UpdateUser)
router.delete('/Delete', userAuth.unsureAuthenticated, userController.deleteUser)
router.get('/Verify/Curriculum', userAuth.unsureAuthenticated, userController.verifyCurriculum)
router.post('/User', userAuth.unsureAuthenticated, userController.getUser)
router.get('/Users', userAuth.unsureAuthenticated, userController.getUsers)
router.get('/Verify/Infos', userAuth.unsureAuthenticated, userController.getInfos)
router.put('/Update/Permission', userAuth.unsureAuthenticated, adminAuth.ensureAdmin, userController.updatePermission)
router.post('/Reset/Password', userController.resetPassWord)
router.put('/Redefine/Password', userController.redefinePassWord)

//Exporta o ROUTER
module.exports = router