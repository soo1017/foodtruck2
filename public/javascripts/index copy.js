

// APP MODULE
var foodtruckApp = angular.module('foodtruckApp', ['ngRoute', 'ngResource', 'ngFileUpload']);

// ROUTE CONFIG
foodtruckApp.config(function($routeProvider, $locationProvider, $httpProvider) {

//    $locationProvider.html5Mode({               // remove hashBang #
//      enabled: true,
//      requireBase: false
//    });
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    
    var homepage = '/';
    var accesstrue = 'true';
    var accessfalse = 'false';
    var checkUserPermission = function(apage, accessstatus) {
        return function(isloginService, $location){   //function to be resolved, accessFac and $location Injected 
                    if(isloginService.getIsLogin() === accessstatus){    //check if the user has permission -- This happens before the page loads
                    } else {
                        $location.path(apage);                //redirect user to home if it does not have permission.
                        alert("You don't have access here");
                    }
        }
    }
    var checkAdminPermission = function(apage, accessstatus) {
        return function(isadminloginService, $location){   //function to be resolved, accessFac and $location Injected
                if(isadminloginService.getIsLogin() === accessstatus && isadminloginService.getIsAdmin() === accessstatus){    //check if the user has permission -- This happens before the page loads
                }else{
                    $location.path(apage);                //redirect user to home if it does not have permission.
                    alert("You don't have access here");
                }
            }
    }
    
    $routeProvider
    .when('/', {
        templateUrl: 'home/home.html',          // Express seems to treat these .html files as static
        controller: 'homeController'
    })
    .when('/shop', {
        templateUrl: 'shop/shop.html',
        controller: 'shopController'
    })
    .when('/checkout', {
        templateUrl: 'shop/checkout.html',
        controller: 'checkoutController'
    })
    .when('/thanks', {
        templateUrl: 'shop/thanks.html',
        controller: 'thanksController'
    })
    .when('/signin', {
        templateUrl: 'user/signin.html',
        controller: 'signinController',
        resolve:{ "check": checkUserPermission(homepage, accessfalse) }
    })
    .when('/signup', {
        templateUrl: 'user/signup.html',
        controller: 'signupController',
        resolve:{ "check": checkUserPermission(homepage, accessfalse) }
    })
    .when('/forgot', {
        templateUrl: 'user/forgot.html',
        controller: 'forgotController',
        resolve:{ "check": checkUserPermission(homepage, accessfalse) }
    })
    .when('/forgotpass/:typeId', {
        templateUrl: 'user/forgotpass.html',
        controller: 'forgotpassController',
        resolve:{ "check": checkUserPermission(homepage, accessfalse) }
    })
    .when('/profile', {
        templateUrl: 'user/profile.html',
        controller: 'profileController',
        resolve:{ "check": checkUserPermission(homepage, accesstrue) }
    })
    .when('/signup-a', {
        templateUrl: 'admin/signup.html',
        controller: 'signupadminController',
        resolve:{ "check": checkAdminPermission(homepage, accessfalse) }
    })
    .when('/signin-a', {
        templateUrl: 'admin/signin.html',
        controller: 'signinadminController',
        resolve:{ "check": checkAdminPermission(homepage, accessfalse) }
    })
    .when('/monitor', {
        templateUrl: 'admin/monitor.html',
        controller: 'monitorController',
        resolve:{ "check": checkAdminPermission(homepage, accesstrue) }
    })
    .when('/stock', {
        templateUrl: 'admin/stock.html',
        controller: 'stockController',
        resolve:{ "check": checkAdminPermission(homepage, accesstrue) }
    })
    .when('/contentsmanage', {
        templateUrl: 'admin/contentsmanage.html',
        controller: 'contentsmanageController',
        resolve:{ "check": checkAdminPermission(homepage, accesstrue) }
    })
    .otherwise({redirectTo: '/'});
});
    
// SERVICES
foodtruckApp.service('mapService', function() {
    this.initMap1 = function(ft_address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': ft_address}, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
            }
            var myLatLng = {lat: latitude, lng: longitude};

            var styledMapType = new google.maps.StyledMapType(
                [
                  {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
                  {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
                  {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
                  {
                    featureType: 'administrative',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#c9b2a6'}]
                  },
                  {
                    featureType: 'administrative.land_parcel',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#dcd2be'}]
                  },
                  {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#ae9e90'}]
                  },
                  {
                    featureType: 'landscape.natural',
                    elementType: 'geometry',
                    stylers: [{color: '#dfd2ae'}]
                  },
                  {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [{color: '#dfd2ae'}]
                  },
                  {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#93817c'}]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'geometry.fill',
                    stylers: [{color: '#a5b076'}]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#447530'}]
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#f5f1e6'}]
                  },
                  {
                    featureType: 'road.arterial',
                    elementType: 'geometry',
                    stylers: [{color: '#fdfcf8'}]
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#f8c967'}]
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#e9bc62'}]
                  },
                  {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry',
                    stylers: [{color: '#e98d58'}]
                  },
                  {
                    featureType: 'road.highway.controlled_access',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#db8555'}]
                  },
                  {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#806b63'}]
                  },
                  {
                    featureType: 'transit.line',
                    elementType: 'geometry',
                    stylers: [{color: '#dfd2ae'}]
                  },
                  {
                    featureType: 'transit.line',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#8f7d77'}]
                  },
                  {
                    featureType: 'transit.line',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#ebe3cd'}]
                  },
                  {
                    featureType: 'transit.station',
                    elementType: 'geometry',
                    stylers: [{color: '#dfd2ae'}]
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{color: '#b9d3c2'}]
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#92998d'}]
                  }
                ],
                {name: 'Styled Map'});

            /****************/
            var map = new google.maps.Map(document.getElementById('id-map'), {
                zoom: 14,
                center: myLatLng,
                mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                        'styled_map']
              }
            });

            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');

            var image1 = '/images/icon/food-truck.png';
            
            var marker = new google.maps.Marker({
                map: map,
    //            icon: iconBase + 'parking_lot_maps.png',
                icon: image1,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: myLatLng
            });
            var toggleBounce = function () {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }
            marker.addListener('click', toggleBounce);
        });
    }
});
// FTPRODUCTSERVICE
foodtruckApp.factory('ftproductService', function($http) {
    var ftproductService = {
        async: function() {
            // $http returns a promise, which has a then function, which also returns a promise
            // The then function here is an opportunity to modify the response
            // The return value gets picked up by the then in the controller.
            // Return the promise to the controller
            var promise = $http.get('/ftlocation-product').then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
    return ftproductService;
});

// PRODUCTSERVICE
foodtruckApp.factory('productService', function($http) {    
    var productService = {
        async: function() {
            var promise = $http.get('/product').then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
    return productService;
});

// PRODUCTSERVICE
foodtruckApp.factory('updateoneproductService', function($http) {
    var sushi_arry = [[],[]];
    var noodle_arry = [[],[]];
    var salad_arry = [[],[]];
    var drink_arry = [[],[]];
    
    var updateOneProduct = function(oneItem, big_array) {
        for(var i = 0; i < big_arry.length; i++) {
            var small = big_arry[i];
            for(var j = 0; j < small.length; j++) {
                if (small[j].name === oneItem.name) {
                    small[j].price = oneItem.price;
                    small[j].description = oneItem.description;
                    small[j].image = oneItem.image;
                    small[j].currentquantity = oneItem.currentquantity;
                }
            }
        }
        return big_arry;
    }
    
    return {
        getInitial: function(products) {
            sushi_arry = products.sushi;
            noodle_arry = products.noodle;
            salad_arry = products.salad;
            drink_arry = products.drink;
        },
        setOneProduct: function(oneProduct) {
            if (oneProduct.category === 'sushi') {
                sushi_arry = updateOneProduct(oneProduct, sushi_arry);
            } else if (oneProduct.category === 'noodle') {
                noodle_arry = updateOneProduct(oneProduct, noodle_arry);    
            } else if (oneProduct.category === 'salad') {
                salad_arry = updateOneProduct(oneProduct, salad_arry);       
            } else {
                drink_arry = updateOneProduct(oneProduct, drink_arry);  
            }
        },
        getOneProduct: function() {
            return {sushi: sushi_arry, noodle: noodle_arry, salad: salad_arry, drink: drink_arry };
        }
    };
});

// ORDERS SERVICE
foodtruckApp.factory('ordersService', function($http) {
    var ordersService = {
        async: function() {
            var promise = $http.get('/user-orders').then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
    return ordersService;
});

// TODAY ORDERS SERVICE
foodtruckApp.factory('todayordersService', function($http) {
    var todayordersService = {
        async: function() {
            var promise = $http.get('/today-orders').then(function (response) {
                return response.data;
            });
            return promise;
        }
    };
    return todayordersService;
});

// COMPLETE ORDER SERVICE
foodtruckApp.factory('completeorderService', function($http) {  
    var completeorderService = {
        async: function(id) {
            var promise = $http.post('/complete-order', {id: id}).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return completeorderService;
});

// ADDCARTSERVICE
foodtruckApp.factory('addcartService', function($http) {  
    var addcartService = {
        async: function(id) {
            var promise = $http.post('/add-to-cart', {id: id}).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return addcartService;
});

// REMOVEONESERVICE
foodtruckApp.factory('removeoneService', function($http) {  
    var removeoneService = {
        async: function(id) {
            var promise = $http.post('/remove-one-fromcart', {id: id}).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return removeoneService;
});

// REMOVEALLSERVICE
foodtruckApp.factory('removeallService', function($http) {  
    var removeallService = {
        async: function() {
            var promise = $http.post('/clear-cart').then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return removeallService;
});

// UPDATECARTSERVICE
foodtruckApp.factory('updatecartService', function($http) {
    var cart = {
        items: {},
        totalQty: 0,
        totalPrice: 0
    }
    return {
        getInitial: function() {
            $http.get('/get-initialcart').then(function(result) {
                cart.items = result.data.cart.items;
                cart.totalQty = result.data.cart.totalQty;
                cart.totalPrice = result.data.cart.totalPrice;
            });
        },
        setCart: function(oldCart) {
            cart.items = oldCart.items;
            cart.totalQty = oldCart.totalQty;
            cart.totalPrice = oldCart.totalPrice;
        },
        getCart: function() {
            return cart;
        }
    };
});

// MENUSERVICE
foodtruckApp.factory('menuService', function () {
    var activeMenu = 'home';
    var menu = {
        home: 'home',
        other: 'other'
    }
    function setMenu(name) {
        activeMenu = name;
    }
    function getActiveMenu() {
        return menu[activeMenu];    
    }
    return {
        setMenu: setMenu,
        getMenu : getActiveMenu
    }
});

// TRACE LAST PAGE SERVICE
foodtruckApp.factory('tracepageService', function ($http) {
    var oldUrl = '';
    function setOldUrl(name) {
        oldUrl = name;
    }
    function getActiveOldUrl() {
        return oldUrl;    
    }
    return {
        setOldUrl: setOldUrl,
        getOldUrl : getActiveOldUrl
    }
});

// TRACE LOGIN INFO SERVICE
foodtruckApp.factory('isloginService', function ($window) {
//    var name = false;
    function setIsLogin(name) {
        $window.localStorage.setItem('islogin', name);
    }
    function setIsAdmin(name) {
        $window.localStorage.setItem('isadmin', name);
    }
    function getIsLogin() {
        return $window.localStorage.getItem('islogin');    
    }
    function getIsAdmin() {
        return $window.localStorage.getItem('isadmin');    
    }
    return {
        setIsLogin: setIsLogin,
        getIsLogin: getIsLogin,
        setIsAdmin: setIsAdmin,
        getIsAdmin: getIsAdmin
    }
});

// CONVERT TITLECASE SERVICE
foodtruckApp.service("toTitleCase", function() {
    this.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
})

// MAKE CHUNK SERVICE
foodtruckApp.service("chunkService", function() {
    this.chunk = function(arr, size) {
       var newArr = [];
          for (var i=0; i<arr.length; i+=size) {
              newArr.push(arr.slice(i, i+size));
          }
       return newArr;
    };
})

// TRACE ADMIN LOGIN INFO SERVICE
foodtruckApp.factory('isadminloginService', function ($window) {
//    var name = false;
    function setIsLogin(name) {
        $window.localStorage.setItem('islogin', name);
    }
    function setIsAdmin(name) {
        $window.localStorage.setItem('isadmin', name);
    }
    function getIsLogin() {
        return $window.localStorage.getItem('islogin');       
    }
    function getIsAdmin() {
        return $window.localStorage.getItem('isadmin');       
    }
    return {
        setIsLogin: setIsLogin,
        getIsLogin: getIsLogin,
        setIsAdmin: setIsAdmin,
        getIsAdmin: getIsAdmin
    }
});

// TRACE ADMIN LOGIN INFO SERVICE
foodtruckApp.factory('wordmonthService', function () {
    function getMonth(number) {
        var month;
        switch (number) {
            case 1:
                month = "Jan";
                break;
            case 2:
                month = "Feb";
                break;
            case 3:
                month = "Mar";
                break;
            case 4:
                month = "Apr";
                break;
            case 5:
                month = "May";
                break;
            case 6:
                month = "Jun";
                break;
            case 7:
                month = "Jul";
                break;
            case 8:
                month = "Aug";
                break;
            case 9:
                month = "Sep";
                break;
            case 10:
                month = "Oct";
                break;
            case 11:
                month = "Nov";
                break;
            case 12:
                month = "Dec";
        }
        return month;   
    }
    return {
        getMonth: getMonth
    }
});


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
foodtruckApp.controller('homeController', ['$scope', '$http', '$filter', 'mapService', 'ftproductService', 'menuService', 'chunkService', function($scope, $http, $filter, mapService, ftproductService, menuService, chunkService) {
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
        var apiKey = '05aee09d1fd4e08af7b5628fdebb4e74';
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
    vm.uptasteForm = {};
    vm.uptasteForm.name = "";
    vm.uptasteForm.email = "";
    vm.uptasteForm.phone = "";
    vm.uptasteForm.address = "";
    vm.uptasteForm.number = "";
    vm.uptasteForm.mm = "";
    vm.uptasteForm.yy = "";
    vm.uptasteForm.cvv = "";
    vm.uptasteForm.zip = "";
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

// DIRECTIVES
///////////////////////////////////////////////////////////

// SIGNIN USER DIRECTIVE
foodtruckApp.directive('signinUser', ['$rootScope', '$http', '$location', 'isloginService', 'tracepageService', function ($rootScope, $http, $location, isloginService, tracepageService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/user/signinuser.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.signinError = "";
            scope.signinForm = {};
            scope.signinForm.email = "";
            scope.signinForm.password = "";
            scope.signinForm.submitForm = function(item, event) {
                var data = {
                    email: scope.signinForm.email,
                    password: scope.signinForm.password
                };
                var responsePromise = $http.post("/signin", data);
                responsePromise.success(function(result1) {
                    if (result1 === 'Ok') {
                        isloginService.setIsLogin(true);
                        isloginService.setIsAdmin(false);
                        $rootScope.islogin = isloginService.getIsLogin();
                        $rootScope.isadmin = isloginService.getIsAdmin();
                        if (tracepageService.getOldUrl() === 'checkout') {
                            tracepageService.setOldUrl('');
                            $location.path('/checkout');
                        } else {
                            $location.path('/profile');
                        }
                    } else {
                        scope.signinError = result1.info;
                    }
                });
                responsePromise.error(function(data1, status1) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// SIGNUP USER DIRECTIVE
foodtruckApp.directive('signupUser', ['$rootScope', '$http', '$location', 'isloginService', 'tracepageService', function ($rootScope, $http, $location, isloginService, tracepageService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/user/signupuser.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.signupError = "";
            scope.signupForm = {};
            scope.signupForm.email = "";
            scope.signupForm.password = "";
            scope.signupForm.confirmpassword = "";
            scope.signupForm.submitForm = function(item, event) {
                if (scope.signupForm.password === scope.signupForm.confirmpassword) {
                    var data = {
                        email: scope.signupForm.email,
                        password: scope.signupForm.password
                    };

                    var responsePromise = $http.post("/signup", data);
                    responsePromise.success(function(result1) {
                        if (result1 === 'Ok') {
                            isloginService.setIsLogin(true);
                            isloginService.setIsAdmin(false);
                            $rootScope.islogin = isloginService.getIsLogin();
                            $rootScope.isadmin = isloginService.getIsAdmin();
                            if (tracepageService.getOldUrl() === 'checkout') {
                                tracepageService.setOldUrl('');
                                $location.path('/checkout');
                            } else {
                                $location.path('/profile');
                            }
                        } else {
                            scope.signupError = result1.info;
                        }
                    });
                    responsePromise.error(function(data1, status1) {
                        alert("Submitting form failed!");
                    });
                } else {
                    scope.signupError = "Password do not match";
                }
            }
        }
    }
}]);

// FORGOT USER DIRECTIVE
foodtruckApp.directive('forgotUser', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/user/forgot.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.forgotmessage = '';
            scope.forgotError = "";
            scope.forgotForm = {};
            scope.forgotForm.email = "";
            scope.forgotForm.submitForm = function(item, event) {
                var data = {
                    email: scope.forgotForm.email,
                };
                var responsePromise = $http.post("/forgot", data)
                responsePromise.success(function(result) {
                    if (result === 'Ok') {
                        scope.forgotmessage = 'Please check your email';
                    } else {
                        scope.forgotError = result.info;
                    }
                });
                responsePromise.error(function(data, status) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// FORGOTPASS USER DIRECTIVE
foodtruckApp.directive('forgotpassUser', ['$rootScope', '$http', '$location', '$routeParams', 'isloginService', 'tracepageService', function ($rootScope, $http, $location, $routeParams, isloginService, tracepageService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/user/forgotpassword.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            var typeId = $routeParams.typeId;
            scope.forgotpassError = "";
            scope.forgotpassForm = {};
            scope.forgotpassForm.password = "";
            scope.forgotpassForm.confirmpassword = "";
            scope.forgotpassForm.submitForm = function(item, event) {
                if (scope.forgotpassForm.password === scope.forgotpassForm.confirmpassword) {
                    var data = {
                        password: scope.forgotpassForm.password
                    };

                    var url = "/forgotpass/" + typeId;
                    var responsePromise = $http.post(url, data);
                        responsePromise.success(function(result) {
                            if (result === 'Ok') {
                                isloginService.setIsLogin(true);
                                isloginService.setIsAdmin(false);
                                $rootScope.islogin = isloginService.getIsLogin();
                                $rootScope.isadmin = isloginService.getIsAdmin();
//                                console.log("tracepageService.getOldUrl(): ", tracepageService.getOldUrl());
                                if (tracepageService.getOldUrl() === 'checkout') {
                                    tracepageService.setOldUrl('');
                                    $location.path('/checkout');
                                } else {
                                    $location.path('/profile');
                                }
                            } else {
                                scope.forgotpassError = result.info;
                            }
                        });
                        responsePromise.error(function(data, status) {
                            alert("Submitting form failed!");
                        });
                } else {
                    scope.forgotpassError = "Password do not match";
                }
            }
        }
    }
    
}]);




///// Admin Ctrl & Directives ///////////////////
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
    
    vm.msg_completeOrder = {};
    vm.msg_completeOrder.info = '';
    vm.closeOrder = function(e) {
        if (confirm("Are you sure to close??")) {
            completeorderService.async($(e.target).data('id')).then(function(result) {
                if (result.length !== 0) {
                    if (result === 'Ok') {
                        vm.msg_completeOrder = {
                            info: "Order completed!!"
                        }
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

// DIRECTIVES
///////////////////////////////////////////////////////////

// SIGNUP ADMIN DIRECTIVE
foodtruckApp.directive('signupAdmin', ['$rootScope', '$http', '$location', 'isadminloginService', 'tracepageService', function ($rootScope, $http, $location, isadminloginService, tracepageService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/admin/signupadmin.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.signupadminError = "";
            scope.signupadminForm = {};
            scope.signupadminForm.email = "";
            scope.signupadminForm.password = "";
            scope.signupadminForm.confirmpassword = "";
            scope.signupadminForm.submitForm = function(item, event) {
                if (scope.signupadminForm.password === scope.signupadminForm.confirmpassword) {
                    var data = {
                        email: scope.signupadminForm.email,
                        password: scope.signupadminForm.password
                    };

                    var responsePromise = $http.post("/signup-a", data);
                    responsePromise.success(function(result1) {
                        if (result1 === 'Ok') {
                            isadminloginService.setIsLogin(true);
                            isadminloginService.setIsAdmin(true);
                            $rootScope.islogin = isadminloginService.getIsLogin();
                            $rootScope.isadmin = isadminloginService.getIsAdmin();
                            if (tracepageService.getOldUrl() === 'checkout') {
                                tracepageService.setOldUrl('');
                                $location.path('/checkout');
                            } else {
                                $location.path('/monitor');
                            }
                        } else {
                            scope.signupadminError = result1.info;
                        }
                    });
                    responsePromise.error(function(data1, status1) {
                        alert("Submitting form failed!");
                    });
                } else {
                    scope.signupadminError = "Password do not match";
                }
            }
        }
    }
}]);

// SIGNIN ADMIN DIRECTIVE
foodtruckApp.directive('signinAdmin', ['$rootScope', '$http', '$location', 'isadminloginService', 'tracepageService', function ($rootScope, $http, $location, isadminloginService, tracepageService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/admin/signinadmin.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.signinadminError = "";
            scope.signinadminForm = {};
            scope.signinadminForm.email = "";
            scope.signinadminForm.password = "";
            scope.signinadminForm.submitForm = function(item, event) {
                var data = {
                    email: scope.signinadminForm.email,
                    password: scope.signinadminForm.password
                };
                var responsePromise = $http.post("/signin-a", data);
                responsePromise.success(function(result1) {
                    if (result1 === 'Ok') {
                        isadminloginService.setIsLogin(true);
                        isadminloginService.setIsAdmin(true);
                        $rootScope.islogin = isadminloginService.getIsLogin();
                        $rootScope.isadmin = isadminloginService.getIsAdmin();
                        if (tracepageService.getOldUrl() === 'checkout') {
                            tracepageService.setOldUrl('');
                            $location.path('/checkout');
                        } else {
                            $location.path('/monitor');
                        }
                    } else {
                        scope.signinadminError = result1.info;
                    }
                });
                responsePromise.error(function(data1, status1) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// MODIFY FT LOCATION DIRECTIVE
foodtruckApp.directive('modifyFtloc', ['$http', '$location', 'toTitleCase', function ($http, $location, toTitleCase) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/contents/modifyftloc.html',
        replace: false,
        link: function(scope, element, attrs) {
            scope.ftlocationadminError = "";
            scope.ftlocationForm = {};
            scope.ftlocationForm.day = "";
            scope.ftlocationForm.location = "";
            scope.ftlocationForm.submitForm = function(item, event) {
                var data = {
                    day: toTitleCase.toTitleCase(scope.ftlocationForm.day),
                    location: scope.ftlocationForm.location
                };
//                console.log("data: ", data);
                var responsePromise = $http.post("/modify-ftloc", data);
                responsePromise.success(function(result) {
//                    console.log("result: ", result);
                    if (result === 'Ok') {
                        scope.ftlocationadminError = 'Successfully Changed';
                        $location.path('/contentsmanage');
                    } else {
                        scope.ftlocationadminError = result.info;
                    }
                });
                responsePromise.error(function(data, status) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// DELETE FOOD DIRECTIVE
foodtruckApp.directive('deleteFood', ['$http', '$location', 'toTitleCase', function ($http, $location, toTitleCase) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/contents/deletefood.html',
        replace: false,
        scope: { },
        link: function(scope, element, attrs) {
            scope.deletefoodadminError = "";
            scope.deletefoodForm = {};
            scope.deletefoodForm.name = "";
            scope.deletefoodForm.submitForm = function(item, event) {
                var data = {
                    name: toTitleCase.toTitleCase(scope.deletefoodForm.name)
                };
                var responsePromise = $http.post("/delete-food", data);
                responsePromise.success(function(result) {
                    if (result === 'Ok') {
                        scope.deletefoodadminError = 'Successfully Deleted';
                        $location.path('/contentsmanage');
                    } else {
                        scope.deletefoodadminError = result.info;
                    }
                });
                responsePromise.error(function(data, status) {
                    alert("Submitting form failed!");
                });
            }
        } 
    }
}]);

// UPDATE QUANTITY DIRECTIVE
foodtruckApp.directive('updateQty', ['$http', '$location', 'toTitleCase', function ($http, $location, toTitleCase) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/contents/updateqty.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.updateqtyadminError = "";
            scope.updatequantityForm = {};
            scope.updatequantityForm.name = "";
            scope.updatequantityForm.quantity = 0;
            scope.updatequantityForm.submitForm = function(item, event) {
                var data = {
                    name: toTitleCase.toTitleCase(scope.updatequantityForm.name),
                    quantity: scope.updatequantityForm.quantity
                };
                var responsePromise = $http.post("/update-qty", data);
                responsePromise.success(function(result) {
                    if (result.status === 'Ok') {
                        scope.updateqtyadminError = 'Successfully Updated';
                        $location.path('/contentsmanage');
                    } else {
                        scope.updateqtyadminError = result.info;
                    }
                });
                responsePromise.error(function(data, status) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// QUERY ORDERS DIRECTIVE
foodtruckApp.directive('queryOrders', ['$http', '$location', 'toTitleCase', 'wordmonthService', function ($http, $location, toTitleCase, wordmonthService) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/contents/queryorders.html',
        replace: false,
        scope: {},
        link: function(scope, element, attrs) {
            scope.queryorders = [];
            scope.queryorderadminError = "";
            scope.queryorderForm = {};
            scope.queryorderForm.date = "";
            scope.queryorderForm.submitForm = function(item, event) {
                var data = {
                    date: scope.queryorderForm.date
                };
                var responsePromise = $http({
                    url: '/query-orders', 
                    method: "GET",
                    params: data
                });
                responsePromise.success(function(result) {
                    if (result.length !== 0 ) {
                        if (result.info !== 'No matched found') {
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
                            scope.queryorderadminError = "";
                            scope.queryorders = return_data;
                        } else {
                            scope.queryorderadminError = result.info;
                            scope.$watch('queryorderadminError', function() {

                            })
                        }
                        $location.path('/contentsmanage');
                    } else {
                        scope.queryorderadminError = result.info;
                        $location.path('/contentsmanage');
                    }
                });
                responsePromise.error(function(data, status) {
                    alert("Submitting form failed!");
                });
            }
        }
    }
}]);

// STOCK LEVEL SUSHI DIRECTIVE
foodtruckApp.directive('stockSushiLevel', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/stock/stocksushilevel.html',
        replace: false,
        scope: {
            sushiarryArray: "="
        }
    }
}]);

// STOCK LEVEL NOODLE DIRECTIVE
foodtruckApp.directive('stockNoodleLevel', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/stock/stocknoodlelevel.html',
        replace: false,
        scope: {
            noodlearryArray: "="
        }
    }
}]);

// STOCK LEVEL SALAD DIRECTIVE
foodtruckApp.directive('stockSaladLevel', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/stock/stocksaladlevel.html',
        replace: false,
        scope: {
            saladarryArray: "="
        }
    }
}]);

// STOCK LEVEL DRINK DIRECTIVE
foodtruckApp.directive('stockDrinkLevel', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: 'directives/stock/stockdrinklevel.html',
        replace: false,
        scope: {
            drinkarryArray: "="
        }
    }
}]);

//foodtruckApp.service('fileUpload', ['$http', function ($http) {
//    this.uploadFileAndFieldsToUrl = function(file, fields, uploadUrl){
//        var fd = new FormData();
//        fd.append('file', file);
//        for(var i = 0; i < fields.length; i++){
//            fd.append(fields[i].name, fields[i].data)
//        }
//        $http.post(uploadUrl, fd, {
//            transformRequest: angular.identity,
//            headers: {'Content-Type': undefined}
//        })
//        .success(function(result){
//            console.log("result: ", result);
//        })
//        .error(function(data, error){
//            console.log('data: ', data);
//        });
//    }
//}]);

//function toTitleCase(str) {
//    return str.replace(/\w\S*/g, function(txt){
//        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//    });
//}

//foodtruckApp.config(function($locationProvider) {
/*
$locationProvider.hashPrefix('');
$locationProvider.html5Mode({
    enabled: false,
    requireBase: true
  });
});*/

//    vm.menu = 'home';
//    console.log("vm.menu-1: ", vm.menu);
//    vm.menu = menuService.getMenu();
//    vm.$watch('menu', function(newValue, oldValue) {
//        vm.menu = menuService.getMenu();
//        if (newValue === oldValue) {
//            vm.menu = menuService.getMenu();
//            console.log("vm.menu: ", vm.menu);
//        }
//    })
//    menuService.setMenu('home');
//    vm.menu = menuService.getMenu();
//    vm.$watch('menu', function (newValue, oldValue) {
//        console.log("vm.menu-home: ", vm.menu);
//        if (newValue === oldValue) {
//            menuService.setMenu('home');
//        }
//    });


//    console.log('vm.login: ', vm.login);
//    vm.$on('islogin', function (event, data) {
//        vm.islogin = data;
//        
//    });
//    vm.$watch('islogin', function() {
//        vm.islogin = isloginService.getIsLogin();
//        console.log("vm.islogin: ", vm.islogin);
//    })
//    
//    var entry = Entry.get(function() {
//        console.log(entry);
//    });

//    vm.menu = '';
//    vm.$watch('menu', function (newValue, oldValue) {
//        console.log("vm.menu-checkout: ", vm.menu);
//        if (newValue === oldValue) menuService.setMenu('other');
//    });

    
//    var original = vm.islogin;
//    var original = vm.islogin;
//    console.log("vm.islogin: ", vm.islogin);
//    console.log("isloginService.getIsLogin(): ", isloginService.getIsLogin());
//    vm.$watch(isloginService.getIsLogin(), function(newVal, oldVal) {
//        console.log("newVal: ", newVal);
////        if (original !== newVal) {
//            
//            vm.islogin = isloginService.getIsLogin();
////        }
//    })

//    menuService.setMenu('shop');
//    vm.menu = menuService.getMenu();
//    vm.$watch('menu', function (newValue, oldValue) {
//        console.log("vm.menu-shop: ", vm.menu);
//        if (newValue === oldValue) menuService.setMenu('other');
//    });


// var order_date = Date(order.createdAt);
//                var order_data_arry = order_date.split(" ");
//                return_data[indexj][0] = "Order(" + order._id + ") - " + order_data_arry[1] + "/" + order_data_arry[2] + "/" + order_data_arry[3];
//                return_data[indexj][1] = order.cart;

    /// ADD A FOOD
//    vm.addfoodForm = {};
//    vm.addfoodForm.submitForm = function(){
//        var file = vm.addfoodForm.myFile;
//        console.log("vm.addfoodForm.myFile: ", vm.addfoodForm.myFile);
//        console.log('file is ' + JSON.stringify(file));
//        var uploadUrl = "/add-food";
//        var fields = [{"name": "name", "data": vm.addfoodForm.name}, 
//                      {"name": "price", "data": vm.addfoodForm.price},
//                      {"name": "description", "data": vm.addfoodForm.description},
//                      {"name": "category", "data": vm.addfoodForm.category},
//                      {"name": "quantity", "data": vm.addfoodForm.quantity}];
//        fileUpload.uploadFileAndFieldsToUrl(file, fields, uploadUrl);
//    };
    // Uploading file
//    vm.uploadFile = function(files) {
//        var fd = new FormData();
//        fd.append("file", files[0]);
//
//        return fd;
////        $http.post(uploadUrl, fd, {
////            withCredentials: true,
////            headers: {'Content-Type': undefined },
////            transformRequest: angular.identity
////        }).success( ...all right!... ).error( ..damn!... );
//
//    };
//    
//    vm.addfoodadminError = "";
//    vm.addfoodForm = {};
//    vm.addfoodForm.name = "";
//    vm.addfoodForm.price = 0;
//    vm.addfoodForm.description = "";
//    vm.addfoodForm.category = "";
//    vm.addfoodForm.quantity = 0;
////    vm.addfoodForm.image = "";
//    vm.addfoodForm.submitForm = function() {
//        var fd = new FormData();
//        fd.append("data", angular.toJson(vm.addfoodForm));
//        for (i=0; i<vm.filesArray.length; i++) {
//            fd.append("file"+i, vm.filesArray[i]);
//        };
//
//        var config = { headers: {'Content-Type': undefined},
//                       transformRequest: angular.identity
//                     }
//        $http.post("/add-food", fd, config).success(function(result) {
//            if (result === 'Ok') {
//                vm.addfoodadminError = 'Successfully Added';
//                $location.path('/contentsmanage');
//            } else {
//                vm.addfoodadminError = result.info;
//            }
//        }).error(function(data, status) {
//            alert("Submitting form failed!");
//        });
//    }
//        var data = {
//            name: vm.toTitleCase(vm.addfoodForm.name),
//            price: vm.addfoodForm.price,
//            description: vm.addfoodForm.description,
//            category: vm.addfoodForm.category,
//            quantity: vm.addfoodForm.quantity,
//            image: vm.addfoodForm.image
//        };
//        console.log("data: ", data);
//        var responsePromise = $http.post("/add-food", data {
//                                         
//        });
//        responsePromise.success(function(result) {
//            if (result === 'Ok') {
//                vm.addfoodadminError = 'Successfully Added';
//                $location.path('/contentsmanage');
//            } else {
//                vm.addfoodadminError = result.info;
//            }
//        });
//        responsePromise.error(function(data, status) {
//            alert("Submitting form failed!");
//        });
//    }
//    
//    $scope.upload = function() {
//    var fd = new FormData();
//    fd.append("data", angular.toJson($scope.fdata));
//    for (i=0; i<$scope.filesArray.length; i++) {
//        fd.append("file"+i, $scope.filesArray[i]);
//    };
//
//    var config = { headers: {'Content-Type': undefined},
//                   transformRequest: angular.identity
//                 }
//    return $http.post(url, fd, config);
//};


// ADD FOOD DIRECTIVE
//foodtruckApp.directive('addFood', ['$http', '$parse', '$location', 'toTitleCase', function ($http, $parse, $location, toTitleCase) {
//    return {
//        restrict: 'AE',
//        templateUrl: 'directives/contents/addfood.html',
//        replace: false,
//        controller: function($scope) {
//            $scope.files = [];
//            
//            $scope.$on("fileSelected", function (event, args) {
//                $scope.$apply(function () {            
//                        //add the file object to the scope's files collection
//                    $scope.files.push(args.file);
//                });
//            });
//        },
//        link: function(scope, element, attrs) {
//                scope.dishcategories = [{
//                    name: 'Sushi',
//                    value: 'SU'
//                }, {
//                    name: 'Noodle',
//                    value: 'NO'
//                }, {
//                    name: 'Salad',
//                    value: 'SA'
//                }, {
//                    name: 'Drink',
//                    value: 'DR'
//                }];
//            
//                scope.addfoodsubmitForm = function() {
//                    var file_input = angular.element(document.getElementById('idfile'));
//                    var name_input = angular.element(document.getElementById('idname'));
//                    var price_input = angular.element(document.getElementById('idprice'));
//                    var description_input = angular.element(document.getElementById('iddescription'));
//                    var category_input = angular.element(document.getElementById('idcategory'));
//                    var quantity_input = angular.element(document.getElementById('idquantity'));
//                    
//                    var fileName = file_input.val();
//                    var nameName = toTitleCase.toTitleCase();
//                    var priceName = price_input.val();
//                    var dsrpName = description_input.val();
//                    var ctgrName = scope.categoryValue.name;
//                    var qtyName = quantity_input.val();
//                    
//                    if (fileName && nameName && priceName && dsrpName && ctgrName && qtyName) {
//                        fileName = fileName.toLowerCase().replace("c:\\fakepath\\", "");
//                        console.log("fileName: ", fileName);
//                        if (fileName.indexOf(".jpg") !== -1 || fileName.indexOf(".jpeg") !== -1 || fileName.indexOf(".png") !== -1) {
//                            var file_type = fileName.split(".")[1];
//                            
//                            var fd = new FormData();
//                            fd.append('file', scope.files, fileName);
////                            fd.append('filetype', file_type);
//                            fd.append('name', nameName);
//                            fd.append('price', priceName);
//                            fd.append('description', dsrpName);
//                            fd.append('category', ctgrName);
//                            fd.append('initialquantity', qtyName);
//                            
//                            $http.post('/add-food', fd, {
//                                // Overriding default headers to enable request content auto detection
//                                transformRequest: angular.identity,
//                                headers: {'Content-Type': undefined}
//                            }).success(function(result) {
//                                console.log("result: ", result);
//                                if (result === 'Ok') {
//                                    scope.addfoodadminError = 'Successfully Added';
//                                    $location.path('/contentsmanage');
//                                } else {
//                                    scope.addfoodadminError = result.info;
//                                }
//                            }).error(function(data, error) {
//                                
//                            })
//                        } else {
//                            scope.addfoodadminError = 'Invalid file';
//                        }
//                    } else {
//                        scope.addfoodadminError = 'Please fill up all fields';
//                    }
//                }
//            }
//    };
//}]);

// FILE UPLOAD DIRECTIVE
//foodtruckApp.directive('fileUpload', ['$http', function ($http) {
//    return {
//        restrict: 'AE',
//        template: '<input type="file" name="file" id="idfile">',
//        replace: true,
//        controller: function ($scope, $element, $attrs) {
//            $element.bind('change', function (event) {
//                $scope.file1 = event.target.files[0];
//                console.log("file1-cont: ", $scope.file1); 
//                $scope.$emit("fileSelected", {file: $scope.file1})
//            });
//        }
//        
//    }
//        
//}]);

// COMBINE DATA SERVICE
//foodtruckApp.factory('combinedataService', function ($q, productService, sharenameandqtysushiService) {
//    return $q.all([productService, sharenameandqtysushiService]);
//    
//});

