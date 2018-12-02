

///////////////////// CONTROLLER
// HEAD CONTROLLER
/////////////////////////////////
foodtruckApp.controller('headController', ['$rootScope', '$scope', '$http', '$window', '$location', 'updatecartService', 'removeoneService', 'removeallService',  'menuService', 'tracepageService', 'isloginService', 'isadminloginService', function($rootScope, $scope, $http, $window, $location, updatecartService, removeoneService, removeallService, menuService, tracepageService, isloginService, isadminloginService) {
    var vm = $scope;

    vm.menu = 'home';
    vm.$on('menu', function(event, data) {
        vm.menu = data;
    });

    $rootScope.$watch('islogin', function() {
        if (isadminloginService.getIsAdmin() === 'false') {
            $rootScope.islogin = isloginService.getIsLogin();
            vm.islogin = $rootScope.islogin;
            vm.islogin = isloginService.getIsLogin();
        } else {
            $rootScope.islogin = isadminloginService.getIsLogin();
            vm.islogin = $rootScope.islogin;
            vm.islogin = isadminloginService.getIsLogin();
        }
    })
    
    updatecartService.getInitial();
    vm.cartHead = updatecartService.getCart();

    /// Show Cart or not
    vm.showme = false;
    vm.convertShowme = function() {
        if (vm.menu === 'home' || vm.menu === 'shop' || vm.menu === 'profile') {
            if (vm.cartHead.totalQty !== 0) {
                if (vm.showme === true) {
                    vm.showme = false;
                } else {
                    vm.showme = true;
                }
            } else {
                vm.showme = false;
            }
        } else {
            vm.showme = false;
        }
        return vm.showme;
    }
    
    /// Remove One from Cart
    vm.cartHead1 = {};
    vm.removeOneItem = function(e) {
        removeoneService.async($(e.target).data('id')).then(function(result) {
            vm.cartHead1 = result.data.cart;
            vm.$watch('cartHead1', function (newValue, oldValue) {
                if (newValue === oldValue) updatecartService.setCart(newValue);
            });
        })
    }
    
    /// Remove All from Cart
    vm.cartHead2 = {};
    vm.removeAllItem = function() {
        removeallService.async().then(function(result) {
            vm.cartHead2 = result.data.cart;
            vm.$watch('cartHead2', function (newValue, oldValue) {
                if (newValue === oldValue) updatecartService.setCart(newValue);
            });
        })
    }
    
    /// Proceed to Checkout with Login
    vm.proceedToCheckoutToLogin = function() {
        tracepageService.setOldUrl('checkout');
        return vm.showme = false;
    }
    
    /// Proceed to Checkout
    vm.proceedToCheckout = function() {
        return vm.showme = false;
    }
    
    /// Log out 
    vm.logoutSubmit = function() {
        $http.get('/signout')
            .success(function(result) {
                isloginService.setIsLogin(false);
                isadminloginService.setIsLogin(false);
                isadminloginService.setIsAdmin(false);
                $rootScope.islogin = isloginService.getIsLogin();
                $rootScope.islogin = isadminloginService.getIsLogin();
                $rootScope.isadmin = isadminloginService.getIsAdmin();
                vm.islogin = $rootScope.islogin;
                if ($location.path() === '/profile' || $location.path() === '/monitor' || $location.path() === '/contentsmanage' || $location.path() === '/stock') {
                    $location.path('/');
                } 
            })
            .error(function(data, status) {
                alert("Signout Failed" + data);
            })
    }
}]);

// HOME CONTROLLER
foodtruckApp.controller('homeController', ['$scope', '$http', '$filter', 'mapService', 'ftproductService', 'menuService', 'chunkService', 'weatherapikeyService', function($scope, $http, $filter, mapService, ftproductService, menuService, chunkService, weatherapikeyService) {
    var vm = $scope;
    
    vm.$emit('menu', 'home');  // going up!
    
    vm.whatDayIsToday = function() {
        return $filter('date')(new Date(), 'EEEE');
    }
    
    ftproductService.async().then(function(result) {
        vm.ftlocation = result.ftlocation;
        var sushis=[];
        var noodles=[];
        var salads=[];
        var drinks=[];
        for (var j=0; j<result.product.length; j++) {
            if (result.product[j].category === 'sushi') {
                sushis.push(result.product[j]);
            } else if (result.product[j].category === 'noodle') {
                noodles.push(result.product[j]);    
            } else if (result.product[j].category === 'salad') {
                salads.push(result.product[j]);    
            } else {
                drinks.push(result.product[j]);
            }
        }
        vm.sushi_arry = chunkService.chunk(sushis, 3);
        vm.noodle_arry = chunkService.chunk(noodles, 3);
        vm.salad_arry = chunkService.chunk(salads, 3);
        vm.drink_arry = chunkService.chunk(drinks, 3);
            // Weather
        var apiKey = weatherapikeyService.getApiKey();
            // Map
            
        if (vm.whatDayIsToday() === 'Saturday' || vm.whatDayIsToday() === 'Sunday') {
            mapService.initMap1('34009 Alvarado-Niles Road, Union City, CA');
            var openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=Union%20City,us&appid=' + apiKey;
            $http.get(openWeatherURL)
                .success(function(result1) {
                
                    vm.weatherdescription = result1.weather[0].description;
                    vm.temp = (result1.main.temp*(9/5)-459.67).toFixed(1) + "(°F)";
                    vm.icon = "http://openweathermap.org/img/w/" + result1.weather[0].icon + ".png";
                })
                .error(function(data1, status1) {
                    console.log(data1);
                })
        } else {
            for (var i=0; i<result.ftlocation.length; i++) {
                if (result.ftlocation[i].day === vm.whatDayIsToday()) {
                    var cityname = result.ftlocation[i].location.split(',')[1];
                    cityname = cityname.replace(/^\s+|\s+$/gm,'');
                    cityname = cityname.replace(' ', '%20');
                    mapService.initMap1(result.ftlocation[i].location);
                    var openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityname + ',us&appid=' + apiKey;
                    $http.get(openWeatherURL)
                        .success(function(result1) {
                            vm.weatherdescription = result1.weather[0].description;
                            vm.temp = (result1.main.temp*(9/5)-459.67).toFixed(1) + "(°F)";
                            vm.icon = "http://openweathermap.org/img/w/" + result1.weather[0].icon + ".png";
                        })
                        .error(function(data1, status1) {
                            console.log(data1);
                        })
                }
            }
        }
    });
}]);

// SHOP CONTROLLER
foodtruckApp.controller('shopController', ['$scope', 'ftproductService', 'addcartService', 'updatecartService', 'menuService', 'updateoneproductService', 'chunkService', function($scope, ftproductService, addcartService, updatecartService, menuService, updateoneproductService, chunkService) {
    var vm = $scope;
    vm.$emit('menu', 'shop');  // going up!
    
    vm.isQuantityEmpty = function(quantity) {
        if (quantity === 0) {
            return true;
        } else {
            return false;
        }
    }
    
    ftproductService.async().then(function(result) {
        var sushis=[];
        var noodles=[];
        var salads=[];
        var drinks=[];
        for (var j=0; j<result.product.length; j++) {
            if (result.product[j].category === 'sushi') {
                sushis.push(result.product[j]);
            } else if (result.product[j].category === 'noodle') {
                noodles.push(result.product[j]);    
            } else if (result.product[j].category === 'salad') {
                salads.push(result.product[j]);    
            } else {
                drinks.push(result.product[j]);
            }
        }
        vm.sushi_arry = chunkService.chunk(sushis, 3);
        vm.noodle_arry = chunkService.chunk(noodles, 3);
        vm.salad_arry = chunkService.chunk(salads, 3);
        vm.drink_arry = chunkService.chunk(drinks, 3);
    });
    /// Add to cart
    vm.cartShop = {};
    vm.getItemId = function(e) {
        addcartService.async($(e.target).data('id')).then(function(result) {
            if (result.data.cart) {
                vm.cartShop = result.data.cart;
                vm.$watch('cartShop', function (newValue, oldValue) {
                    if (newValue === oldValue) updatecartService.setCart(newValue);
                });
            } else {
                var oneproduct = result.data;
                var products = {sushi: vm.sushi_arry, noodle: vm.noodle_arry, salad: vm.salad_arry, drink: vm.drink_arry}
                updateoneproductService.getInitial(products);
                updateoneproductService.setOneProduct(oneproduct);
                vm.sushi_arry = updateoneproductService.getOneProduct().sushi;
                vm.noodle_arry = updateoneproductService.getOneProduct().noodle;
                vm.salad_arry = updateoneproductService.getOneProduct().salad;
                vm.drink_arry = updateoneproductService.getOneProduct().drink;
            }
        })
    }
}]);

// CHECKOUT CONTROLLER
foodtruckApp.controller('checkoutController', ['$scope', '$http', '$location', 'updatecartService', 'removeoneService', 'removeallService', 'menuService', function($scope, $http, $location, updatecartService, removeoneService, removeallService, menuService) {
    var vm = $scope;
    
    vm.$emit('menu', 'other');  // going up!
    
    updatecartService.getInitial();
    vm.cartCheckout = updatecartService.getCart();
    
    /// Remove One from Cart
    vm.cartCheckout1 = {};
    vm.removeOneItem = function(e) {
        removeoneService.async($(e.target).data('id')).then(function(result) {
            vm.cartCheckout1 = result.data.cart;
            vm.$watch('cartCheckout1', function (newValue, oldValue) {
                if (newValue === oldValue) updatecartService.setCart(newValue);
            });
        })
    }
    
    /// Remove All from Cart
    vm.cartCheckout2 = {};
    vm.removeAllItem = function() {
        removeallService.async().then(function(result) {
            vm.cartCheckout2 = result.data.cart;
            vm.$watch('cartCheckout2', function (newValue, oldValue) {
                if (newValue === oldValue) updatecartService.setCart(newValue);
            });
        })
    }
    
    /// Form Submit
    vm.outofstock = false;
    vm.outofstockItems = [];
    vm.uptasteForm = {
        name: "",
        email: "",
        phone: "",
        address: "",
        number: "",
        mm: "",
        yy: "",
        cvv: "",
        zip: ""
    };
    vm.uptasteForm.submitForm = function(item, event) {
//        console.log("--> Submitting form");
        var data = {
            name: vm.uptasteForm.name,
            email: vm.uptasteForm.email,
            phone: vm.uptasteForm.phone,
            address: vm.uptasteForm.address,
            number: vm.uptasteForm.number,
            mm: vm.uptasteForm.mm,
            yy: vm.uptasteForm.yy,
            cvv: vm.uptasteForm.cvv,
            zip: vm.uptasteForm.zip
        };
        var responsePromise = $http.post("/checkout", data);
        responsePromise.success(function(result) {

            if (result.outofstock === true) {
                vm.outofstock = true;
                vm.outofstockItems = result.outofstockItems;
            } else {
                vm.outofstock = false;
                var cartAfterCheckout = {};
                cartAfterCheckout.items = [];
                cartAfterCheckout.totalQty = 0;
                cartAfterCheckout.totalPrice = 0.00;
                updatecartService.setCart(cartAfterCheckout);
                $location.path('/thanks');
            }
        });
        responsePromise.error(function(data, status) {
            alert("Submitting form failed!");
        });
    }
}]);

// THANKS CONTROLLER
foodtruckApp.controller('thanksController', ['$scope', function($scope) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
}]);

// SIGNIN CONTROLLER
foodtruckApp.controller('signinController', ['$scope', function($scope) {
    /// Form Submit
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!

}]);

// SIGNUP CONTROLLER
foodtruckApp.controller('signupController', ['$scope', function($scope) {
    /// Form Submit
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
    
}]);

// PROFILE CONTROLLER
foodtruckApp.controller('profileController', ['$scope', '$http', 'ordersService', 'wordmonthService', function($scope, $http, ordersService, wordmonthService) {
    var vm = $scope;
    vm.$emit('menu', 'profile');  // going up!
    
    vm.orders;
    ordersService.async().then(function(result) {
        if (result.length !== 0) {
            var return_data = [];
            result.forEach(function(order, indexj, arrayj) {
                var time1 = new Date(order.createdAt);
                var month1 = wordmonthService.getMonth(time1.getMonth()+1);
                var date1 = time1.getDate();
                var hour1 = time1.getHours();
                var minute1 = time1.getMinutes();
                var time2 = month1 + "/" + date1 + " - " + hour1 + ":" + minute1;
                var timestamp = "Order(" + order._id + ") :::: " + time2;
                return_data[indexj] = {
                    timestamp: timestamp,
                    eachorder: order.cart
                }
            })
            vm.orders = return_data;
        } else {
            vm.orders = [];
        }
    })
}]);

// FORGOT CONTROLLER
foodtruckApp.controller('forgotController', ['$scope', function($scope) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!

}]);

// FORGOTPASS CONTROLLER
foodtruckApp.controller('forgotpassController', ['$scope', function($scope) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!

}]);

///// Admin Ctrl  ///////////////////
/////////////////////////////////////////////////

// SIGNUP CONTROLLER
foodtruckApp.controller('signupadminController', ['$scope', function($scope) {
    /// Form Submit
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
    
}]);

// ADMIN SIGNIN CONTROLLER
foodtruckApp.controller('signinadminController', ['$scope', function($scope) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
 
}]);

// MONITOR CONTROLLER
foodtruckApp.controller('monitorController', ['$scope', '$location', 'todayordersService', 'wordmonthService', 'completeorderService', function($scope, $location, todayordersService, wordmonthService, completeorderService) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
    
    vm.todayorders;
    var repeatOrderdata = function() {
        todayordersService.async().then(function(result) {
            if (result.length !== 0) {
                var return_data = [];
                result.forEach(function(order, indexj, arrayj) {
                    var time1 = new Date(order.createdAt);
                    var month1 = wordmonthService.getMonth(time1.getMonth()+1);
                    var date1 = time1.getDate();
                    var hour1 = time1.getHours();
                    var minute1 = time1.getMinutes();
                    var time2 = month1 + "/" + date1 + " - " + hour1 + ":" + minute1;
                    var timestamp = "Order(" + order._id + ") :::: " + time2;
                    return_data[indexj] = {
                        timestamp: timestamp,
                        eachorder: order.cart
                    }
                })
                vm.todayorders = return_data;
                $location.path('/monitor');
            } else {
                vm.todayorders = [];
                $location.path('/monitor');
            }
        });
    }
    repeatOrderdata();
    setInterval(function () {
        vm.$apply(function () {
            repeatOrderdata();
        });
    }, 10000);
    
    vm.msg_completeOrder = '';
    vm.closeOrder = function(e) {
        if (confirm("Are you sure to close??")) {
            var orderId = $(e.target).data('id');
            completeorderService.async($(e.target).data('id')).then(function(result) {
                if (result.length !== 0) {
                    if (result === 'Ok') {
                        for (var m=0; m<vm.todayorders.length; m++) {
                            if (orderId == vm.todayorders[m].timestamp) {
                                vm.todayorders.splice( m, 1 );
                                break;
                            }
                        }
                        
                        vm.msg_completeOrder = "Order completed!!";
                    }
                    $location.path('/monitor');
                } else {
                    alert("Submitting failed!");
                    $location.path('/monitor');
                }
            });
        } else {
            $location.path('/monitor');
        }
    }
}]);

// STOCK CONTROLLER
foodtruckApp.controller('stockController', ['$scope', '$location', 'productService', 'chunkService', function($scope, $location, productService, chunkService) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!
    
    var repeatStockdata = function() {
        productService.async().then(function(result) {
            
            if (result.length !== 0) {
                var sushis=[];
                var noodles=[];
                var salads=[];
                var drinks=[];
                for (var n=0; n<result.product.length; n++) {
                    result.product[n].currentptg = (result.product[n].currentquantity / result.product[n].initialquantity) * 100;
                }
                for (var j=0; j<result.product.length; j++) {
                    if (result.product[j].category === 'sushi') {
                        
                        sushis.push(result.product[j]);
                    } else if (result.product[j].category === 'noodle') {
                        noodles.push(result.product[j]);    
                    } else if (result.product[j].category === 'salad') {
                        salads.push(result.product[j]);    
                    } else {
                        drinks.push(result.product[j]);
                    }
                }
                vm.sushiarry = chunkService.chunk(sushis, 3);
                vm.noodlearry = chunkService.chunk(noodles, 3);
                vm.saladarry = chunkService.chunk(salads, 3);
                vm.drinkarry = chunkService.chunk(drinks, 3);
            } else {
                vm.stockadminError = "No Products Fetched"
                $location.path('/stock');
            }
        });
    }
    repeatStockdata();
    setInterval(function () {
        vm.$apply(function () {
            repeatStockdata();
        });
    }, 600000);
}]);

// CONTENTS MANAGEMENT CONTROLLER
foodtruckApp.controller('contentsmanageController', ['$scope', function($scope) {
    var vm = $scope;
    vm.$emit('menu', 'other');  // going up!

}]);

// CONTENTS MANAGEMENT CONTROLLER
foodtruckApp.controller('addFoodController', ['$scope', '$window', 'Upload', 'toTitleCase', function($scope, $window, Upload, toTitleCase) {
    var vm = this;
    $scope.items = [{
        id: 1,
        label: 'Sushi'
    }, {
        id: 2,
        label: 'Noodle'
    }, {
        id: 3,
        label: 'Salad'
    }, {
        id: 4,
        label: 'Drink'
    }];
    vm.addfoodsubmitForm = function(){                                      //function to call on form submit
        if (vm.add_form.file.$valid && vm.file && vm.name && vm.price && vm.description && vm.selected && vm.quantity) {                                                               //check if from is valid
            vm.upload(vm.file, vm.name, vm.price, vm.description, vm.selected, vm.quantity);    //call upload function
        }
    }
    vm.upload = function(file, name, price, description, selected, quantity) {
        var name1 = toTitleCase.toTitleCase(name);
        Upload.upload({
            url: '/add-food',                       //webAPI exposed to upload the file
            data:{
                file: file,
                name: name1,
                price: price,
                description: description,
                category: selected.label,
                initialquantity: quantity
            }                                       //pass file as data, should be user ng-model
        }).then(function (resp) {                   //upload function returns a promise
//            console.log("response: ", resp);
            if (resp.data === 'Ok') {
                $scope.addfoodadminError = 'Successfully Added';
            }
        }, function (resp) {                        //catch error
//            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
//            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);


