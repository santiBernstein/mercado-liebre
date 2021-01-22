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
			data : {}, errors: {}
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
		let content = JSON.parse(fs.readFileSync(productFilePath, {encoding: 'utf-8'}));
		let ids = Number(req.params.id) - 1;
		content[ids].name = req.body.name;
		content[ids].category = req.body.category;
		content[ids].price = req.body.price;
		content[ids].discount = req.body.discount; 
        content[ids].description = req.body.desciption;
        content[ids].image = req.files[0].filename;
		fs.writeFileSync(productFilePath, JSON.stringify(content))
		res.redirect('/')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const content = JSON.parse(fs.readFileSync(productJsonFilePath, 'utf-8'));
		const imagePath = path.join(__dirname,"../public/images",content[(Number(req.params.id)-1)].image);
        
        fs.unlink(imagePath, function (err) {
			if (err) throw err;
			
		})
		content.splice((Number(req.params.id)-1),1)
		let i=1;
		content.forEach(product=>product.id = i++)
		fs.writeFileSync(productJsonFilePath,JSON.stringify(content))
		res.redirect('/')
		
	}
};

module.exports = controller;