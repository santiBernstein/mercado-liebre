const fs = require('fs');
const path = require('path');
let productsData = require('../data/productsDataBase.json');


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
};

module.exports = controller;
