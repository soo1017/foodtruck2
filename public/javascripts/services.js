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

// MAKE CHUNK SERVICE
foodtruckApp.service("weatherapikeyService", function() {
    this.getApiKey = function() {
        return "openweatherapikey";
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

