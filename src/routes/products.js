// ************ Require's ************
const express = require('express');
const router = express.Router();
var checkIp = require('../middlewares/checkIp');

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', checkIp, productsController.create); 
router.post('/', productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', productsController.edit); 
router.put('/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
