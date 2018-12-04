var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var aws = require('aws-sdk');
var _ = require('lodash');
var passport = require('passport');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var fs = require('fs');
var formidable = require('formidable');

var {Product} = require('./models/product');
var {FTLocation} = require('./models/ftlocation');
var {User} = require('./models/user');
var Cart = require('./models/cart');
var {Order} = require('./models/order');
var {wordMonth} = require('./modules/wordMonth');
var {numberMonthAndDate} = require('./modules/numberMonthAndDate');
var {generateToken} = require('./modules/generateToken');
var {findAdminUser} = require('./modules/findAdminUser');
var {emailAdminUser} = require('./modules/emailAdminUser');
var {findAdminUserWithToken} = require('./modules/findAdminUserWithToken');
var {emailAdminUserWithToken} = require('./modules/emailAdminUserWithToken');
var {updateTodayOrders} = require('./modules/updateTodayOrders');

var app = express();

//var csrfProtection = csrf();
//router.use(csrfProtection);             // middleware of adding csrf security
//                                        // same as  "var csrfProtection = csrf({ cookie: true })"
//                                        //       "app.get('/form', csrfProtection, function (req, res) {
//                                        //             // pass the csrfToken to the view
//                                        //             res.render('send', { csrfToken: req.csrfToken() })
//                                        //        })"
//
//app.use(function (req, res, next) {
//    var token = req.csrfToken();      // server genearte token and pass the csrftoken to the view 
//    console.log("token: ", token);
//    res.cookie('XSRF-TOKEN', token);  // servre send it to cookie
//    res.locals.csrfToken = token;
//    next();
//});
//app.use(csrf());

var csrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
  return token;
};

router.use(csrf());

router.use(function (req, res, next) {
    var token = req.csrfToken();      // server genearte token and pass the csrftoken to the view 
    console.log("token: ", token);
//    res.cookie('XSRF-TOKEN', req.session._csrf);  // servre send it to cookie
    res.cookie('XSRF-TOKEN', token);  // servre send it to cookie
    res.locals.csrfToken = token;
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.html', { title: 'UpTaste' });
});

/* GET FoodTruck Location & Product. */
router.get('/ftlocation-product', function(req, res, next) {
    FTLocation.find(function(err, locs) {
        if (err) {
            return res.send(err);
        }
        Product.find(function(err1, pros) {
            if (err1) {
                return res.send(err1);
            }
            var data = {};
            data.ftlocation = locs;
            data.product = pros;
            res.send(data);
//            console.log("data: ", data);
        })
    });
});

/* GET FoodTruck Location & Product. */
router.get('/product', function(req, res, next) {
    Product.find(function(err1, pros) {
        if (err1) {
            return res.send(err1);
        }
        var data = {};
        data.product = pros;
        res.send(data);
    });
});

/* POST ADD-TO-CART. */
router.post('/add-to-cart', function(req, res, next) {
    var productId = req.body.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.send(err);
        }
        if (product.currentquantity === 0) {
            return res.send(product);
        }
        cart.add(product, product._id);
//        console.log("cart: ", cart);
        req.session.cart = cart;
        var temp_cart = {};
        temp_cart.items = cart.generateArray();
        temp_cart.totalQty = cart.totalQty;
        temp_cart.totalPrice = cart.totalPrice;
        res.send({product: product, cart: temp_cart});
    });
});

/* GET ADD-TO-CART. */
router.get('/get-initialcart', function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    req.session.cart = cart;
    var temp_cart = {};
    temp_cart.items = cart.generateArray() || [];
    temp_cart.totalQty = cart.totalQty || 0;
    temp_cart.totalPrice = cart.totalPrice || 0;
    res.send({cart: temp_cart});
});

/* POST Remove One From Cart Overlay. */
router.post('/remove-one-fromcart', function(req, res, next) {
    var productId = req.body.id;
    var matchedProduct = {};
    
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    // Remove one item from cart
    if (!cart.items[productId]) {
        return res.send('Not Matched Item');
    }
    matchedProduct = cart.items[productId].item;
    cart.items[productId].qty--;
    cart.items[productId].price -= matchedProduct.price;
    if (cart.items[productId].qty == 0) {
        delete cart.items[productId];
    }
    cart.totalQty--;
    cart.totalPrice -= matchedProduct.price;
    req.session.cart = cart;
    
    var temp_cart = {};
    temp_cart.items = cart.generateArray() || [];
    temp_cart.totalQty = cart.totalQty || 0;
    temp_cart.totalPrice = cart.totalPrice || 0;
    res.send({cart: temp_cart});

});

/* POST Clear Cart. */
router.post('/clear-cart', function(req, res, next) {
//    concole.log("req.user: ", req.user);
    var cart = new Cart(req.session.cart);
    // Remove Cart
    if (!cart.items) {
        return res.send('No Item');
    }
    cart.items = {};
    cart.totalPrice = 0.00;
    cart.totalQty = 0;
    req.session.cart = cart;
    var temp_cart = {};
    temp_cart.items = [];
    temp_cart.totalQty = 0;
    temp_cart.totalPrice = 0;
    res.send({cart: temp_cart});  
});

/* POST Check Out with Guest. */
router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.send('Empty Cart');
    }
    var cart = new Cart(req.session.cart); 
    var outofstock = {
        outofstock: false,
        outofstockItems: []
    };
    var cartitems = [];
    cartitems = Object.keys(cart.items).map(key => {
        var ar = cart.items[key];   // Apppend key if one exists (optional)
        ar.key = key;
        return ar;
    })
    
    var updateItems = [];
    var count = 0;
    cartitems.forEach(function(it) {
        updateItems[count] = {
            id: it.item._id,
            name: it.item.name,
            numberofitem: it.qty
        }
        count++;
    })
    
    updateItems.forEach(function(itm, itm_index, itm_array) {
        if (itm_index == (itm_array.length - 1)) {                    // last iteration
            Product.findById(itm.id, (err, product) => {
                if (err) {
                    return res.send(err);
                }
                if (product.currentquantity < itm.numberofitem) {
                    outofstock.outofstock = true;
                    var shortItem = {
                        name: product.name,
                        shortAmount: itm.numberofitem - product.currentquantity
                    };
                    outofstock.outofstockItems.push(shortItem);
                }
          
                if (outofstock.outofstock === true) {
                    var temp_outofstock = outofstock;
                    outofstock = {
                        outofstock: false,
                        outofstockItems: []
                    };
                    return res.send(JSON.stringify(temp_outofstock));
                } else {
                    //// New Products are created based on the info
                    updateItems.forEach(function(itm00, itm00_index, itm00_array) {
                        if (itm00_index === (itm00_array.length - 1)) { // last iteration
                            Product.findById(itm00.id, (err00, product00) => {
                                if (err00) {
                                    return res.send(err00);
                                }
                                product00.currentquantity -= itm00.numberofitem;
                                product00.save((err11, product11) => {
                                    if (err11) {
                                        res.send(err11);
                                    }
                                    
                                    var order = new Order({
                                            cart: cart,
                                            address: req.body.address,
                                            name: req.body.name,
                                            userEmail: req.body.email,
                                            phone: req.body.phone,
                                            paymentId: "not available now",        // from Stripe
                                            createdAt: new Date().getTime()
                                        });
                                        if (req.user) {
                                            order.user = req.user;
                                        }
                                
                                        order.save(function(err3, result) {
                                            if (err3) {
                                                return res.send(err);
                                            }
                                            cart.items = {};
                                            cart.totalPrice = 0.00;
                                            cart.totalQty = 0;
                                            req.session.cart = cart;
                                            res.send(result);
                                    });
                                });
                            });
                        } else {
                            Product.findById(itm00.id, (err00, product00) => {
                                if (err00) {
                                    return res.send(err00);
                                }
                           
                                product00.currentquantity -= itm00.numberofitem;
                                product00.save((err11, product11) => {
                                    if (err11) {
                                        res.send(err11);
                                    }                                
                                });
                            });
                        }
                    });
                }
            });
        } else {
            Product.findById(itm.id, (err, product) => {
                if (err) {
                    return res.send(err);
                }
                if (product.currentquantity < itm.numberofitem) {
                    outofstock.outofstock = true;
                    var shortItem = {
                        name: product.name,
                        shortAmount: itm.numberofitem - product.currentquantity
                    };
                    outofstock.outofstockItems.push(shortItem);
                } 
            });
        }
    });
});

/* GET Log Out page. */
router.get('/signout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.send('Log Out');
})

/* GET Profile page. */
router.get('/user-orders', isLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    Order.find({user: req.user}, function(err, orders) {
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
});

///// Admin
/* GET Monitor page. */
router.get('/today-orders', isAdminLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    updateTodayOrders(res);
});

/* POST Complete Order. */
router.post('/complete-order', isAdminLoggedIn, function(req, res, next) {
    var temp_orderId = req.body.id;
    var temp1_orderId = temp_orderId.split(")")[0];
    var orderId = temp1_orderId.split("(")[1];
    var completedTime = new Date().getTime();
    
    Order.findOneAndUpdate({_id: orderId}, {$set:{completedOrder: true, completedAt: completedTime }}, {new: true}, function(err, order) {
        if (err) {
            var error_completeorder ={
                info: err
            }
            return res.send(JSON.stringify(error_completeorder));
        }
        res.send('Ok');
    });
});

/* POST Modify FT Location. */
router.post('/modify-ftloc', isAdminLoggedIn, function(req, res, next) {
    var day = req.body.day;
    var location = req.body.location;
    FTLocation.findOneAndUpdate({day: day}, {$set:{day: day, location: location }}, {new: true}, function(err, location) {
        if (err) {
            return res.send(err);
        }
        if (!location) {
            var missing_loc = {
                info: 'No matched found'
            }
            return res.send(JSON.stringify(missing_loc));
        }
        res.send('Ok');
    });
});

/* POST Delete Food. */
router.post('/delete-food', isAdminLoggedIn, function(req, res, next) {
    var name = req.body.name;
    Product.findOneAndDelete({name: name}, function(err, product) {
        if (err) {
            return res.send(err);
        }
        if (!product) {
            var missing_product = {
                info: 'No matched found'
            }
            return res.send(JSON.stringify(missing_product));
        }
        fs.unlink(product.image, function(fserr) {
            if (fserr) {
                var failing_unlink = {
                    info: 'Ok - Image file not deleted'
                }
                return res.send(JSON.stringify(failing_unlink));
            }
            res.send ('Ok');     
        });
    });
});

/* POST Add Food. */
router.post('/add-food', isAdminLoggedIn, function(req, res, next) {
    var tempproduct = {};
    var form = new formidable.IncomingForm();
    
    form.parse(req).on('field', function(name, value) {
 
        if (name == 'name') {
            tempproduct.name = value;
        } else if (name == 'price') {
            tempproduct.price = value;
        } else if (name == 'description') {
            tempproduct.description = value;
        } else if (name == 'initialquantity') {
            tempproduct.initialquantity = value;
            tempproduct.currentquantity = value;
        } else {
            if (value == 'Sushi') {
                tempproduct.category = "sushi";
            } else if (value == 'Noodle') {
                tempproduct.category = "noodle";
            } else if (value == 'Salad') {
                tempproduct.category = "salad";
            } else {
                tempproduct.category = "drink";
            }
        }
    }).on('fileBegin', function(name, file) {
        file.path = __dirname + '/../public/images/products/' + file.name;
        var imageroute = '/images/products/' + file.name;
        tempproduct.image = imageroute;
    }).on('file', function(name, file) {
        console.log('Uploaded ' + file.name);
    }).on('error', function(err) {
        console.log(err);
    }).on('end', function() {
        var product = new Product(tempproduct);
        product.save(function(err, result) {
            if (err) {
                return res.send(err);
            }
            res.send('Ok');
        });
    });
});

/* POST Update Quantity of Food. */
router.post('/update-qty', isAdminLoggedIn, function(req, res, next) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    Product.findOneAndUpdate({name: name}, {$set:{initialquantity: quantity, currentquantity: quantity }}, {new: true}, function(err, product) {
        if (err) {
            return res.send(err);
        }
        if (!product) {
            var missing_product = {
                info: 'No matched found'
            }
            return res.send(JSON.stringify(missing_product));
        }
        var returned_data = {
            status: 'Ok',
            category: product.category
        }
        res.send(JSON.stringify(returned_data));
    });
});

/* GET Query Orders. */
router.get('/query-orders', isAdminLoggedIn, function(req, res, next) {
    var query_date = numberMonthAndDate(req.query.date);
    var today1 = query_date.year1 + ", " + query_date.month1 + ", " + query_date.date1;
    var tomorrow1 = query_date.year1 + ", " + query_date.month1 + ", " + (query_date.date1 + 1);
    Order.find({createdAt: {$gte: new Date(today1), $lt: new Date(tomorrow1)}}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        if (!orders.length) {
            var err_msg = {
                info: "No matched found"
            }
            return res.send(JSON.stringify(err_msg));
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.send(orders);
    });
});



/* MiddleWare - page without login. */
// ////////////////
router.use('/', notLoggedIn, function(req, res, next) {
    next();
})

/* POST Sign UP page. */
router.post('/signup', function(req, res, next) {
    passport.authenticate('local.signup', function(err, user, info) {
        if (info === undefined) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send('Ok');
            });
        } else {
            return res.send(JSON.stringify({info: info}));
        }
    })(req, res, next);
});

/* POST Sign IN page. */
router.post('/signin', function(req, res, next) {
    passport.authenticate('local.signin', function(err, user, info) {
        if (info === undefined) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send('Ok');
            });
        } else {
            return res.send(JSON.stringify({info: info}));
        }
    })(req, res, next);
});

/* POST Forgot Password page. */
router.post('/forgot', function(req, res, next) {
    async.waterfall([
        generateToken(),
        findAdminUser(req, res, 'user'),
        emailAdminUser(req, res, 'user')
    ], function(err) {
        if (err) return next(err);
        res.send('Ok');
    });
});

/* POST Reset Forgot Password page. */
router.post('/forgotpass/:token', function(req, res, next) {
    async.waterfall([
        findAdminUserWithToken(req, res, 'user'),
        emailAdminUserWithToken(req, res, 'user')
    ], function(err) {
        res.send(err);
    });
});


/// admin
//////////////////
/* POST Admin Sign UP page. */
router.post('/signup-a', function(req, res, next) {
    passport.authenticate('local.adminsignup', function(err, user, info) {
        if (info === undefined) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send('Ok');
            });
        } else {
            return res.send(JSON.stringify({info: info}));
        }
    })(req, res, next);
});

/* POST Sign IN page. */
router.post('/signin-a', function(req, res, next) {
    passport.authenticate('local.adminsignin', function(err, user, info) {
        if (info === undefined) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send('Ok');
            });
        } else {
            return res.send(JSON.stringify({info: info}));
        }
    })(req, res, next);
});


module.exports = router;

/// Middlewares
///////////////////////////////////////////
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isAdminLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == true) {
        return next();
    }
    res.redirect('/');
}

function notAdminLoggedIn(req, res, next) {
    if (!(req.isAuthenticated() && req.user.isAdmin == true)) {
        return next();
    }
    res.redirect('/');
}

function printReqRes(req, res, next) {
    console.log("req: ", req);
    console.log("res: ", res);
    next();
}

function printReq(req, res, next) {
    console.log("req.body: ", req.body);
    next();
}

function printRes(req, res, next) {
    console.log("res::::: ", res);
    next();
}

