angular.module("Datashop", [])
	.factory('Request', function ($http) {
        var baseURL = "/dashboard/api/";
        return {
            get: function (requestURL, data) {
                var arr = [];
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
	.factory('User', function(Request,$window){
		var user= JSON.parse(JSON.stringify($window.user));
		return {
			getFullName: function(){
				return user.firstname + " " + user.lastname;
			},
			getUser: function(){
				return user;
			},
			getEmail: function(){
				return user.email;
			}
		}
	})
    .factory("Role", function($window){
        var roles= JSON.parse(JSON.stringify($window.roles));
        return {
            clinic: function(){
                if (Object.keys(roles).filter(function(el){
                    return 'clinic' == el;
                }).length > 0){
                    return true;
                }
                else
                    return false;
            },
            user: function(){
                if (Object.keys(roles).filter(function(el){
                    return 'usermanagement' == el;
                }).length > 0)
                    return true;
                else
                    return false;
            },
            analytical: function(){
                if (Object.keys(roles).filter(function(el){
                    return 'analytical' == el;
                }).length > 0)
                    return true;
                else
                    return false;
            },
            alerts: function(){
                if (Object.keys(roles).filter(function(el){
                    return "pipeline" == el;
                }).length > 0)
                    return true;
                else
                    return false;
            }
        }
    })
	.factory("Notification", function(User, Request){
		return {
			get: function(){
				return Request.get("notifications", {"email": User.getEmail()}).then(function(response){
					return angular.copy(response)['data']['data'];
				});
			},
			read: function(id){
				return Request.get("clear-notification/" + id, {
                    "email": User.getEmail()
                }).then(function(response){
                    return angular.copy(response)['data'];
                })
			},
            clear_all_notifications: function(){
                return Request.get("clear-all-notifications",{
                    "email": User.getEmail()
                }).then(function(response){
                    return angular.copy(response)['data'];
                })
            }
		}
	})
    .controller("navbarController", function ($scope, $location, $window, User, Notification, Role) {
        $scope.role = Role;
        $scope.getClass = function (path) {
            if ($window.location.pathname == path)
                return "active"
            else
                return ""
        }
    })
    .controller("UserController", function($scope, User, Notification){
    	$scope.notifications = {};
    	$scope.user = User;
        getNotifications = function(){
            Notification.get().then(function(response){
                var all_notifications = angular.copy(response);
                $scope.notifications.count = all_notifications.count;
                $scope.notifications.data = all_notifications.notification;
            });    
        }
        getNotifications();
        $scope.clear_all_notifications = function(){
            Notification.clear_all_notifications().then(function(response){
                if (angular.copy(response)['success']){
                    getNotifications();
                }
            })
        }
        $scope.read_notification = function(id){
            Notification.read(id).then(function(response){
                if (angular.copy(response)['success']){
                    getNotifications();
                }
            })
        }
    })
