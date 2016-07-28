angular.module("admin", ['ngRoute', "ui.checkbox", 'ui.mask'])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider

            .when("/list", {
                templateUrl: "../static/partials/admin/list.html",
                controller: "ListController"
            })
            .when("/user/create", {
                templateUrl: "../static/partials/admin/new-user.html",
                controller: 'NewUserController'
            })
            .when("/user/:userID/edit", {
                templateUrl: "../static/partials/admin/edit-user.html",
                controller: "EditUserController"
            })
            .when("/user/activity", {
                templateUrl: "../static/partials/admin/logs.html",
                controller: "ActivityLogsController"
            })
            .otherwise({
                redirectTo: "/list"
            })
    }])
    .factory('Request', function ($http) {
        return {
            get: function (requestURL, data) {
                var arr = [];
                var baseURL = "";
                for (var count = 0; count < Object.keys(data).length; count++) {
                    arr.push(Object.keys(data)[count] + "=" + data[Object.keys(data)[count]])
                }
                var promise = $http({
                    method: 'GET',
                    url: requestURL + "?" + arr.join("&"),
                    timeout: 10000
                })
                return promise;
            },
            post: function (requestURL, data) {
                var promise = $http({
                    method: 'POST',
                    url: requestURL,
                    data: {
                        'data': JSON.stringify(data)
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                return promise;
            }
        }
    })
    .factory("Users", function (Request) {
        var model_diff = function (old_model, new_model) {
            var updated_model = {};
            for (var count = 0; count < Object.keys(new_model).length; count++) {
                var browse_key = Object.keys(new_model)[count];
                if (old_model[browse_key] != new_model[browse_key]) {
                    updated_model[browse_key] = new_model[browse_key];
                }
            }
            return updated_model;
        }
        return {
            create: function (user) {
                return Request.post("/admin/api/user/create", user);
            },
            list: function () {
                return Request.get("/admin/api/user/list", {});
            },
            get: function (id) {
                return Request.get("/admin/api/user/get", {
                    "id": id
                });
            },
            update: function (old_user, new_user, id) {
                return Request.post("/admin/api/user/" + id + "/update", model_diff(old_user, new_user));
            },
            activate: function (id) {
                return Request.post("/admin/api/user/activate", {
                    "id": id
                });
            },
            deactivate: function (id) {
                return Request.post("/admin/api/user/deactivate", {
                    "id": id
                });
            },
            activity: function () {
                return Request.get("/admin/api/user/logs", {});
            }
        }
    })
    .factory('Roles', function($window){
        var roles= JSON.parse(JSON.stringify($window.roles));
        return{
            user: function(subrole){
                if (roles['usermanagement'] >= subrole)
                    return true;
                else
                    return false;
            }
        }
    })
    .controller("ListController", function ($scope, $location, Users, Roles) {
        Users.list().then(function (response) {
            $scope.users = angular.copy(response)['data']['data'];
            $scope.activated_users_count = $scope.users.filter(function (user) {
                return user.activated == 1;
            }).length;
        })
        $scope.roles = Roles;
    })
    .controller("NewUserController", function ($scope, $location, Users, $timeout, $filter) {
        $scope.submit = function (user) {
            Users.create(user).then(function (response) {
                var data = angular.copy(response);
                var success = data['data']['success'];
                if (success == true) {
                    $location.path("/list");
                }
            });
        }
        $scope.user = {};
        $timeout(function () {
            $scope.pipeline = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.clinic = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.usermanagement = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.analytical = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
        }, 0);
        $scope.check_pipeline = function () {
            $scope.user.pipeline = $filter('filter')($scope.pipeline, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_pipeline = function () {
            angular.forEach($scope.pipeline, function (item) {
                item.checked = $scope.pipeline_all_checked ? false : true;
            });
            $scope.user.pipeline = $filter('filter')($scope.pipeline, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_clinic = function () {
            $scope.user.clinic = $filter('filter')($scope.clinic, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_clinic = function () {
            angular.forEach($scope.clinic, function (item) {
                item.checked = $scope.clinic_all_checked ? false : true;
            });
            $scope.user.clinic = $filter('filter')($scope.clinic, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_usermanagement = function () {
            $scope.user.usermanagement = $filter('filter')($scope.usermanagement, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_usermanagement = function () {
            angular.forEach($scope.usermanagement, function (item) {
                item.checked = $scope.usermanagement_all_checked ? false : true;
            });
            $scope.user.usermanagement = $filter('filter')($scope.usermanagement, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_analytical = function () {
            $scope.user.analytical = $filter('filter')($scope.analytical, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_analytical = function () {
            angular.forEach($scope.analytical, function (item) {
                item.checked = $scope.analytical_all_checked ? false : true;
            });
            $scope.user.analytical = $filter('filter')($scope.analytical, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
    })
    .controller("EditUserController", function ($scope, $location, Users, $timeout, $filter, $routeParams, Roles) {
        $scope.roles = Roles;
        $scope.submit = function () {
            Users.update($scope.old_user, $scope.user, $routeParams.userID).then(function (response) {
                var data = angular.copy(response);
                var success = data['data']['success'];
                if (success == true) {
                    $location.path("/list");
                }
            });
        }
        $scope.activate = function () {
            Users.activate($routeParams.userID).then(function (response) {
                var data = angular.copy(response);
                var success = data['data']['success'];
                if (success) {
                    $location.path("/list");
                }
            });
        }
        $scope.deactivate = function () {
            Users.deactivate($routeParams.userID).then(function (response) {
                var data = angular.copy(response);
                var success = data['data']['success'];
                if (success)
                    $location.path("/list");
            })
        }
        $timeout(function () {
            $scope.pipeline = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.clinic = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.usermanagement = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            $scope.analytical = [{
                "id": 1
            }, {
                "id": 2
            }, {
                "id": 3
            }, {
                "id": 4
            }];
            Users.get($routeParams.userID).then(function (response) {
                var data = angular.copy(response);
                data = data['data'];
                $scope.user = data['data'];
                $scope.old_user = angular.copy($scope.user);
                angular.forEach($scope.user.pipeline, function (item) {
                    $scope.pipeline.filter(function (el) {
                        return el.id == item;
                    })[0]['checked'] = true;
                });
                angular.forEach($scope.user.usermanagement, function (item) {
                    $scope.usermanagement.filter(function (el) {
                        return el.id == item;
                    })[0]['checked'] = true;
                });
                angular.forEach($scope.user.clinic, function (item) {
                    $scope.clinic.filter(function (el) {
                        return el.id == item;
                    })[0]['checked'] = true;
                });
                angular.forEach($scope.user.analytical, function (item) {
                    $scope.analytical.filter(function (el) {
                        return el.id == item;
                    })[0]['checked'] = true;
                });
            });
        }, 0);
        $scope.user = {};
        $scope.check_pipeline = function () {
            $scope.user.pipeline = $filter('filter')($scope.pipeline, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_pipeline = function () {
            angular.forEach($scope.pipeline, function (item) {
                item.checked = $scope.pipeline_all_checked ? false : true;
            });
            $scope.user.pipeline = $filter('filter')($scope.pipeline, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_clinic = function () {
            $scope.user.clinic = $filter('filter')($scope.clinic, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_clinic = function () {
            angular.forEach($scope.clinic, function (item) {
                item.checked = $scope.clinic_all_checked ? false : true;
            });
            $scope.user.clinic = $filter('filter')($scope.clinic, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_usermanagement = function () {
            $scope.user.usermanagement = $filter('filter')($scope.usermanagement, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_usermanagement = function () {
            angular.forEach($scope.usermanagement, function (item) {
                item.checked = $scope.usermanagement_all_checked ? false : true;
            });
            $scope.user.usermanagement = $filter('filter')($scope.usermanagement, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_analytical = function () {
            $scope.user.analytical = $filter('filter')($scope.analytical, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
        $scope.check_all_analytical = function () {
            angular.forEach($scope.analytical, function (item) {
                item.checked = $scope.analytical_all_checked ? false : true;
            });
            $scope.user.analytical = $filter('filter')($scope.analytical, {
                "checked": true
            }).map(function (el) {
                return el.id;
            });
        }
    })
    .controller("ActivityLogsController", function ($scope, Users) {
        Users.activity().then(function (response) {
            $scope.logs = angular.copy(response)['data']['data']['records'];
            $scope.total = angular.copy(response)['data']['data']['total'];
        });
    })