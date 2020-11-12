const fs = require('fs');
const path = require('path');

let productsData = require('../data/productsDataBase.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

let bcryptjs = require('bcryptjs');
var userData = require('../data/user');
var {validationResult} = require('express-validator');


const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		res.render('index', {productsData})
	},
	search: (req, res) => {
		res.render('results')
	},
	login: (req, res) => {
		res.render('login')
	},
	register: (req, res) => {
		res.render('register', { linkToLogin: false})
	},
	store: (req, res) => {
		// let content = fs.readFileSync(usersFilePath, {encoding: 'utf-8'})

        // content = JSON.parse(content)

        // content.push ({

		// 		id: content.length,
		// 		name: req.body.name,
		// 		email : req.body.email,
		// 		password : bcryptjs.hashSync(req.body.password)
        // })

        // content = JSON.stringify(content)

		// fs.writeFileSync(usersFilePath, content)
		let errors = validationResult(req)

		if (errors.isEmpty()){

			userData.create({ 

				email : req.body.email,
				//password : bcryptjs.hashSync(req.body.password)
			})
		
			return res.send('te registraste')

			 }
			
		return res.render('/register', {

			errors : errors.mapped(),
			linkToLogin : true
		})         
		
	},
};

module.exports = controller;
