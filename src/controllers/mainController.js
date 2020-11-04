const fs = require('fs');
const path = require('path');
let productsData = require('../data/productsDataBase.json');
let bcryptjs = require('bcryptjs');


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
		res.render('register')
	},
	store: (req, res) => {
		let content = fs.readFileSync('../data/users.json', {encoding: 'utf-8'})

        content = JSON.parse(content)

        content.push ({

				id: content.length,
				email : req.body.email,
				password : bcryptjs.hashSync(req.body.password)
        })

        content = JSON.stringify(content)

        fs.writeFileSync('../data/users.json', content)

       res.send('bien')
		
	},
};

module.exports = controller;
