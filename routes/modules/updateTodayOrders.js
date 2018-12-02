var {Order} = require('../models/order');
var Cart = require('../models/cart');
var {wordMonth} = require('./wordMonth');

var updateTodayOrders = function(res) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Order.find({completedOrder: false, createdAt: {$gte: startOfToday}}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.send(orders);
    });
}

module.exports = {updateTodayOrders};