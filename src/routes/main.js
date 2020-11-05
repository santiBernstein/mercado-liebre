// ************ Require's ************
const express = require('express');
const router = express.Router();


// ************ Controller Require ************
const mainController = require('../controllers/mainController');

//subida de fotos
let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
		destination : function(req,file,cb){
			cb(null, '/public/images')
		},
		filename : function(req,file,cb){
			cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
		 }
})

let upload = multer({storage})


router.get('/', mainController.index); 
router.get('/search', mainController.search); 

router.get('/login', mainController.login);

router.get('/register', mainController.register);
router.post('/register', upload.any(), mainController.store);

module.exports = router;
