module.exports = function (req,res,next){

   if (req.query.user == 'admin') {

        next()
   }

  
   res.redirect('/')
 }
 