const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');



const guestMiddleware = require('../middlewares/guest');
const authMiddleware = require('../middlewares/auth');
const validator = require('../middlewares/validator');



const usersController = require('../controllers/usersController');



var storage = multer.diskStorage({
   destination: function (req, file, cb) {
         cb(null, path.resolve(__dirname, '../../public/images/users'))
   },
   filename: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({
   storage,

   
   fileFilter: (req, file, cb) => {
      
      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];

      const ext = path.extname(file.originalname);

      if (!acceptedExtensions.includes(ext)){
            req.file = file;
      }
         
      cb(null, acceptedExtensions.includes(ext));
   }
});



router.get('/', usersController.index); 
router.get('/profile/', authMiddleware, usersController.profile); 
router.get('/profile/sales', authMiddleware, usersController.sales);


router.get('/register/', guestMiddleware , usersController.create); 
router.post('/register/', guestMiddleware, upload.single('image'), validator.register, usersController.store); 


router.get('/login/', guestMiddleware, usersController.showLogin);
router.post('/login/', guestMiddleware, validator.login, usersController.processLogin); 



router.post('/logout/', authMiddleware, usersController.logout); 


router.get('/:id/edit/', usersController.edit); 



router.delete('/:id', usersController.destroy); 

router.get('/cart', authMiddleware, usersController.cart);
router.post('/addToCart', authMiddleware, validator.addToCart, usersController.addToCart);
router.get('/history', authMiddleware, usersController.history);
router.post('/shop', authMiddleware, usersController.shop);
router.post('/deleteFromCart', authMiddleware, usersController.deleteFromCart);
router.get('/buy-detail/:id', authMiddleware, usersController.showBuyDetail);


module.exports = router;
