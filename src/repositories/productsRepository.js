let products = require('../data/productsDataBase.json')

module.exports = {

            search (req) {

                let totalParams = Object.keys(req.query).length

                if (totalParams){

                    return products.filter(function(product){

                        let score = 0

                        if (req.query.brand){
                            score += (product.brand == req.query.brand) ? 1 : 0
                        }

                        if (req.query.name){
                            score += (product.name.includes(req.query.name)) ? 1 : 0
                        }

                        if (req.query.stock_min){
                            score += (product.stock >= req.query.stock_min) ? 1 : 0
                        }

                        return score == totalParams

                    })
                }

                return products


            }


}