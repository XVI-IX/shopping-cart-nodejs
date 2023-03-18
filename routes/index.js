var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('@dr.pogodin/csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

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

router.get('/user/signup', function(req, res, next) {
  res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('/user/signup', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;