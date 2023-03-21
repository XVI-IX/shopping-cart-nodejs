var express = require('express');
var router = express.Router();

var {body, validationResult} = require('express-validator');

var Product = require('../models/product');
var csrf = require('@dr.pogodin/csurf');
var Cart = require('../models/cart');


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

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId)
  .then(
    function(product) {
      if (product) {
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');

      }
    },

    function (err) {
      return res.redirect("/");
    }
  );
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }

  var cart = new Cart(req.session.cart);

  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

module.exports = router;
