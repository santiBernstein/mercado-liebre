const {body} = require('express-validator')
const userData = require('../data/user')
module.exports = [

    body('email').custom(function(value){

          let user =  userData.findByEmail(value)

            if (user) {

                  throw new Error('ya existe')

            }

            return (true)
    })
]