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
                    password: scope.signinForm.password,
                    value: scope.value                      // for csrf
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
                        password: scope.signupForm.password,
                        value: scope.value 
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
                    value: scope.value 
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
                        password: scope.forgotpassForm.password,
                        value: scope.value
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
                        password: scope.signupadminForm.password,
                        value: scope.value
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
                    password: scope.signinadminForm.password,
                    value: scope.value
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
                    location: scope.ftlocationForm.location,
                    value: scope.value
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
                    name: toTitleCase.toTitleCase(scope.deletefoodForm.name),
                    value: scope.value
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
                    quantity: scope.updatequantityForm.quantity,
                    value: scope.value
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
                    date: scope.queryorderForm.date,
                    value: scope.value
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
