const {check} = require('express-validator');

module.exports = [check('name')
.isLength({min:3, max:30})
.withMessage('Minimo 3, maximo 50 caracteres'),
check('price')
.isInt({gt:1, lt:100000})
.withMessage('debe ser entre 1 y 100000')
]