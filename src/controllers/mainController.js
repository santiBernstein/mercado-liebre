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
	processLogin: (req, res) => {

		let user = userData.findByEmail(req.body.email)

		if(!user){

			return res.send('Email incorrecto')
		}
		else if(bcryptjs.compareSync(req.body.password, user.password)){

			req.session.user = user.email
			if(req.body.recordame){
				res.cookie('recordame', user.email, {maxAge: 120 * 1000})
			}
			return res.redirect('/products')
		}
			else { return res.send('Password Incorrrecto')}

		
	},
	logout: (req, res) => {
		req.session.destroy()
		res.cookie('recordame', null, {maxAge: 0})
	    res.redirect('login')
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
