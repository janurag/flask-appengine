angular.module("alerts", ['ngRoute', 'ngTagsInput'])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/list", {
                templateUrl: "../static/partials/alerts/list.html",
                controller: "ListController"
            })
            .when("/new", {
                templateUrl: "../static/partials/alerts/new.html",
                controller: "NewAlertController"
            })
            .when("/:id/item", {
                templateUrl: "../static/partials/alerts/item.html",
                controller: "ItemController"
            })
            .when("/:id/edit", {
                templateUrl: "../static/partials/alerts/edit.html",
                controller: "EditAlertController"
            })
            .otherwise({
                redirectTo: "/list"
            })
    }])
    .factory('Request', function ($http) {
        return {
            get: function (requestURL, data) {
                var arr = [];
                var baseURL = "/alerts/api/";
                for (var count = 0; count < Object.keys(data).length; count++) {
                    arr.push(Object.keys(data)[count] + "=" + data[Object.keys(data)[count]])
                }
                var promise = $http({
                    method: 'GET',
                    url: baseURL + requestURL + "?" + arr.join("&"),
                    timeout: 10000
                })
                return promise;
            },
            post: function (requestURL, data) {
                var baseURL = "/alerts/api/";
                var promise = $http({
                    method: 'POST',
                    url: baseURL + requestURL,
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
    .factory('Roles', function($window){
        var roles= JSON.parse(JSON.stringify($window.roles));
        return{
            alert: function(subrole){
                if (roles['pipeline'] >= subrole)
                    return true;
                else
                    return false;
            }
        }
    })
    .factory("Alerts", function (Request) {
        var notification_types = [{
            "value": "email",
            "name": "Email"
        }];
        var status = [{
            "value": "on",
            "name": "ON - Active Policies"
        }, {
            "value": "off",
            "name": "OFF - Deactivated Policies"
        }, {
            "value": "all",
            "name": "ALL - Policies"
        }];
        return {
            status: function () {
                return status;
            },
            notification_types: function () {
                return notification_types;
            },
            raised_when: function () {
                return Request.get("get_alerts", {}).then(function (response) {
                    return angular.copy(response)['data']['data'];
                })
            },
            create: function (policy) {
                return Request.post("create", policy);
            },
            update: function (policy, id) {
                return Request.post("edit/" + id.toString(), policy);
            },
            list: function () {
                return Request.get("list", {});
            },
            get: function (id) {
                return Request.get(id + "/get_alert", {}).then(function (response) {
                    return angular.copy(response)['data']['data'];
                });
            },
            pause: function (id) {
                return Request.get(id + "/pause", {}).then(function (response) {
                    return angular.copy(response)['data']['success'];
                })
            },
            start: function (id) {
                return Request.get(id + "/start", {}).then(function (response) {
                    return angular.copy(response)['data']['success'];
                })
            },
            delete: function (id) {
                return Request.get(id + "/delete", {}).then(function (response) {
                    return angular.copy(response)['data']['success'];
                })
            }
        }
    })
    .controller("ListController", function ($scope, Alerts, $location, Roles) {
        $scope.status = Alerts.status();
        $scope.roles = Roles;
        Alerts.list().then(function (response) {
            $scope.all_alerts = angular.copy(response)['data']['data'];
            $scope.alerts = $scope.all_alerts.filter(function (el) {
                return el.policy.active == 1;
            });
            $scope.active_policies_count = $scope.alerts.filter(function (el) {
                return el.policy.active == 1;
            }).length;
            for (var count = 1; count < $scope.alerts.length; count++) {
                $scope.alerts[count].emails_visibility = true;
            }
        });
        $scope.filter = function (selected_status) {
            if (selected_status.value == "on") {
                $scope.alerts = $scope.all_alerts.filter(function (el) {
                    return el.policy.active == 1;
                });
            } else if (selected_status.value == "off") {
                $scope.alerts = $scope.all_alerts.filter(function (el) {
                    return el.policy.active == 0;
                })
            } else {
                $scope.alerts = $scope.all_alerts;
            }
            for (var count = 1; count < $scope.alerts.length; count++) {
                $scope.alerts[count].emails_visibility = true;
            }
        }
        $scope.getAlert = function (id) {
            $location.path("/" + id.toString() + "/item");
        }
    })
    .controller("NewAlertController", function ($scope, Alerts, $location, Roles) {
        $scope.roles=Roles;
        $scope.notification_types = Alerts.notification_types();
        Alerts.raised_when().then(function (response) {
            $scope.raised_when = angular.copy(response);
            $scope.policy.raised_when = $scope.raised_when[0];
        });
        $scope.submit = function () {
            var adaptedPolicy = angular.copy($scope.policy);
            adaptedPolicy.notification_type = $scope.policy.notification_type.name;
            adaptedPolicy.raised_when = $scope.policy.raised_when.id;
            adaptedPolicy.emails = $scope.emails.map(function (el) {
                return el.text;
            });
            Alerts.create(adaptedPolicy).then(function (response) {
                var data = angular.copy(response);
                data = data['data'];
                if (data['success'] == true) {
                    $location.path("/list");
                }
            });
        }
    })
    .controller("EditAlertController", function ($scope, Alerts, $location, $routeParams, Roles) {
        $scope.roles=Roles;
        $scope.notification_types = Alerts.notification_types();
        Alerts.raised_when().then(function (response) {
            $scope.raised_when = angular.copy(response);
            $scope.policy.raised_when = $scope.raised_when[0];
            Alerts.get($routeParams.id).then(function (response) {
                var data = angular.copy(response);
                $scope.old_policy = angular.copy(data['policy']);
                $scope.policy.name = data['policy']['name'];
                $scope.policy.raised_when = $scope.raised_when.filter(function (el) {
                    return el.name == data['policy']['raised_when']
                })[0];
                $scope.policy.message =data['policy']['message'];
                $scope.emails = data['emails'].map(function (el) {
                    return {
                        "text": el.email
                    };
                });
            });
        });
        $scope.update = function () {
            var adaptedPolicy = angular.copy($scope.policy);
            adaptedPolicy.notification_type = $scope.policy.notification_type.name;
            adaptedPolicy.raised_when = $scope.policy.raised_when.id;
            adaptedPolicy.emails = $scope.emails.map(function (el) {
                return el.text;
            });
            Alerts.update(adaptedPolicy, $routeParams.id).then(function (response) {
                var data = angular.copy(response);
                data = data['data'];
                if (data['success'])
                    $location.path("/list");
            });
        }
    })
    .controller("ItemController", function ($scope, Alerts, $location, $routeParams, Roles) {
        $scope.roles = Roles;
        var get_data = function () {
            Alerts.get($routeParams.id).then(function (response) {
                $scope.alert = angular.copy(response);
            })
        }
        get_data();
        $scope.pause = function () {
            Alerts.pause($routeParams.id).then(function (response) {
                if (angular.copy(response))
                    get_data();
            });
        }
        $scope.delete = function () {
            Alerts.delete($routeParams.id).then(function (response) {
                if (angular.copy(response))
                    $location.path("/list");
            })
        }
        $scope.start = function () {
            Alerts.start($routeParams.id).then(function (response) {
                if (angular.copy(response))
                    get_data();
            });
        }
    })