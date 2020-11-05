const fs = require('fs');
const path = require('path');
let productsData = require('../data/productsDataBase.json');
const {validationResult} = require('express-validator');
//let repository = require('../repositories/productsRepository.js')


const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		//data = repository.search(req)

		res.render('products', {productsData})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let resultado = productsData.find(function(product){
			return product.id == req.params.id
		})
		if (resultado){
			return res.render('detail', {resultado})
		}
		res.send('No existe')
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form',{
			data : {}
		})
	},
	
	// Create -  Method to store
	store: (req, res) => {
		
		let errors = validationResult(req)

		if(!errors.isEmpty()){

			return res.render('product-create-form', { 
				
				errors : errors.mapped(),
				data : req.body
				
				})
		}

		let content = fs.readFileSync(productsFilePath, {encoding: 'utf-8'})

        content = JSON.parse(content)

        content.push ({
            ...req.body,
            id: content[content.length-1].id+1
        })

        content = JSON.stringify(content)

        fs.writeFileSync(productsFilePath, content)

       res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let resultado = productsData.find(function(product){
			return product.id == req.params.id
		})
		if (resultado){
			return res.render('product-edit-form', {resultado})
		}
		res.send('No existe')
		
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		res.send('anda')
	}
};

module.exports = controller;