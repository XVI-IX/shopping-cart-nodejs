var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Video Game',
    description: "Awesome Game!!!",
    price: 100
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
    title: 'Minecraft',
    description: "Builds your creativity",
    price: 7.99
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Dark_Souls_Cover_Art.jpg',
    title: 'Dark Souls',
    description: "The best game",
    price: 12.99
  })
];

// let done = 1;
for (var i = 0; i < products.length; i++) {
  products[i].save();

  // done++;
  // if (done === products.length) {
  //   mongoose.disconnect();
  // }
}


// mongoose.disconnect();

