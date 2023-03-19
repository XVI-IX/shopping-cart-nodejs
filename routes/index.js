var express = require('express');
var router = express.Router();

var {body, validationResult} = require('express-validator');

var Product = require('../models/product');
var csrf = require('@dr.pogodin/csurf');


/* GET home page. */
router.get('/', async function(req, res, next) {
  var productChunks = [];
  var chunkSize = 3;
  var products = await Product.find().lean();
  for (var i = 0; i < products.length; i += chunkSize) {
    productChunks.push(products.slice(i, i + chunkSize));
  }
  res.render('shop/index', { 
    title: 'Shopping Cart',
    products: productChunks
  });
});


module.exports = router;
