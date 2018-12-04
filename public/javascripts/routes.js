// ROUTE CONFIG
foodtruckApp.config(function($routeProvider, $locationProvider, $httpProvider) {

//    $locationProvider.html5Mode({               // remove hashBang #
//      enabled: true,
//      requireBase: false
//    });
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('XSRFInterceptor');
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
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