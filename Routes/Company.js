const express = require('express');
const router = express.Router();

//Importações necessárias
const companyController = require('../controllers/Company')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

//ROUTAS com seus respectivos controlers e middlewares
router.post('/Register', companyController.createCompany)
router.put('/Update', userAuth.unsureAuthenticated, companyController.updateCompany)
router.delete('/Delete', userAuth.unsureAuthenticated, companyController.deleteCompany)
router.get('/Companies', userAuth.unsureAuthenticated, companyController.getCompanies)
router.get('/', userAuth.unsureAuthenticated, companyController.getCompany)

//Exporta o ROUTER
module.exports = router