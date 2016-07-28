angular.module("analytics", ["googlechart", "ui.checkbox", 'ui.numeric'])
    .directive("datetimepicker", function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                elem.datetimepicker({
                    timepicker: false,
                    format: 'M d, Y',
                    inline: false,
                    lang: 'en',
                    mask: true,
                    timepicker: attrs.timepicker == "false" ? false : true,
                    datepicker: attrs.datepicker == "false" ? false : true,
                    timepickerScrollbar: true,
                    useLocalTimezone: false
                });
            }
        }
    })
    .factory('Request', function ($http) {
        var baseURL = "/analytics/api/";
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
    .factory("Analytics", function (Request, $q) {
        var gender_options = [{
            "name": "All",
            "value": "all"
        }, {
            "name": "Male",
            "value": "M"
        }, {
            "name": "Female",
            "value": "F"
        }, {
            "name": "Unspecified",
            "value": "U"
        }];
        var switch_items = [{
            "name": "Cholesterol",
            "value": true
        }, {
            "name": "Blood Pressure",
            "value": false
        }];
        var new_date_object = new Date();
        var date_object = new Date(new_date_object.getFullYear() - 1, new_date_object.getMonth(), new_date_object.getDate());
        return {
            chart: function (dataPoints) {
                var deferred = $q.defer();

                var cols = [{
                    "id": "month",
                    "label": "Month",
                    "type": "string",
                    "p": {}
                }, {
                    "id": "vital",
                    "label": "Cholesterol",
                    "type": "number",
                    "p": {}
                }, {
                    "id": "visits",
                    "label": "No. of Visits",
                    "type": "number",
                    "p": {}
                }];
                var rows = [];
                var months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
                for (var count = 0; count < 12; count++) {
                    rows.push({
                        "c": [
                            {
                                "v": "\n" + months[count]
                        },
                            {
                                "v": parseInt(Math.random() * 100)
                        },
                            {
                                "v": parseInt(Math.random() * 100)
                        }
                    ]
                    });
                }
                var options = {
                    "height": "420",
                    "isStacked": "true",
                    "legend": "none",
                    "seriesType": "bars",
                    "bar": {
                        "groupWidth": "35%"
                    },
                    "animation": {
                        "duration": 1000,
                        "easing": "out"
                    },
                    "series": {
                        0: {
                            "type": "line",
                            "color": "#0B9C38",
                            "targetAxisIndex": 0
                        },
                        1: {
                            "type": "bars",
                            "color": "#4990E2",
                            "targetAxisIndex": 1
                        }
                    },
                    "vAxes": {
                        0: {
                            "viewWindowMode": "explicit",
                            "viewWindow": {
                                "min": 0
                            },
                            "gridlines": {
                                "color": "#EBEBEB",
                                "count": 5
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "No. of Visits",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false",
                            }
                        },
                        1: {
                            "gridlines": {
                                "color": "transparent",
                                "count": 3
                            },
                            "viewWindow": {
                                "min": 0
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "Cholesterol",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false"
                            }
                        }
                    },
                    "hAxis": {
                        "baselineColor": "#D5D5D5",
                        "textPosition": "out",
                        "gridlines": {
                            "color": "transparent"
                        },
                        "textStyle": {
                            "fontName": "Roboto",
                            "color": "#9EA3A1",
                            "fontSize": "12"
                        }
                    }
                };
                var chartObject = {
                    "type": "ComboChart",
                    "backgroundColor": "transparent",
                    "displayed": true,
                    "data": {
                        "rows": rows,
                        "cols": cols
                    },
                    "options": options,
                    "formatters": {}
                };
                deferred.resolve(chartObject);
                return deferred.promise;
            },
            chartBloodPressure: function (datapoints) {
                var cols = [{
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    }, {
                        "id": "visits",
                        "label": "Visits",
                        "type": "number",
                        "p": {}
                    },
                    {
                        "id": "systolicBP",
                        "label": "Systolic BP",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "diastolicBP",
                        "label": "Diastolic BP",
                        "type": "number",
                        "p": {}
                    }
                    ];
                var rows = datapoints.map(function (ele) {
                    return {
                        "c": [
                            {
                                "v": "\n" + ele.month
                        },
                            {
                                "v": ele.records.Visits
                        },
                            {
                                "v": ele.records.SystolicBP
                        },
                            {

                                "v": ele.records.DiastolicBP
                                }
                    ]
                    }
                });
                var options = {
                    "height": "320",
                    "isStacked": "true",
                    "legend": "none",
                    "seriesType": "bars",
                    "bar": {
                        "groupWidth": "35%"
                    },
                    "animation": {
                        "duration": 1000,
                        "easing": "out"
                    },
                    "series": {
                        0: {
                            "type": "bars",
                            "color": "#4990E2",
                            "targetAxisIndex": 0
                        },
                        1: {
                            "type": "line",
                            "color": "#8DC15E",
                            "targetAxisIndex": 1
                        },
                        2: {
                            "type": "line",
                            "color": "#C22123",
                            "targetAxisIndex": 1
                        }
                    },
                    "vAxes": {
                        0: {
                            "viewWindowMode": "explicit",
                            "viewWindow": {
                                "min": 0
                            },
                            "gridlines": {
                                "color": "#EBEBEB",
                                "count": 5
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "No. of Visits",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false",
                            }
                        },
                        1: {
                            "gridlines": {
                                "color": "transparent",
                                "count": 3
                            },
                            "viewWindow": {
                                "min": 0
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "Blood Pressure",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false"
                            }
                        }
                    },
                    "hAxis": {
                        "baselineColor": "#D5D5D5",
                        "textPosition": "out",
                        "gridlines": {
                            "color": "transparent"
                        },
                        "textStyle": {
                            "fontName": "Roboto",
                            "color": "#9EA3A1",
                            "fontSize": "12"
                        }
                    }
                };
                var chartObject = {
                    "type": "ComboChart",
                    "backgroundColor": "transparent",
                    "displayed": true,
                    "data": {
                        "rows": rows,
                        "cols": cols
                    },
                    "options": options,
                    "formatters": {}
                };
                // console.log(chartObject);
                return chartObject;
            },
            chartCholesterol: function (datapoints) {
                var cols = [{
                        "id": "month",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    }, {
                        "id": "visits",
                        "label": "Visits",
                        "type": "number",
                        "p": {}
                    },
                    {
                        "id": "LDL",
                        "label": "LDL",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "HDL",
                        "label": "HDL",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "Triglyceride",
                        "label": "Triglyceride",
                        "type": "number",
                        "p": {}
                    }
                    ];
                var rows = datapoints.map(function (ele) {
                    return {
                        "c": [
                            {
                                "v": "\n" + ele.month
                        },
                            {
                                "v": ele.records.Visits
                        },
                            {
                                "v": ele.records.LDL
                        },
                            {
                                "v": ele.records.HDL
                            },
                            {
                                "v": ele.records.Triglyceride
                        }
                    ]
                    }
                });
                var options = {
                    "height": "320",
                    "isStacked": "true",
                    "legend": "none",
                    "seriesType": "bars",
                    "bar": {
                        "groupWidth": "35%"
                    },
                    "animation": {
                        "duration": 1000,
                        "easing": "out"
                    },
                    "series": {
                        0: {
                            "type": "bars",
                            "color": "#4990E2",
                            "targetAxisIndex": 0
                        },
                        1: {
                            "type": "line",
                            "color": "#8DC15E",
                            "targetAxisIndex": 1
                        },
                        2: {
                            "type": "line",
                            "color": "#C22123",
                            "targetAxisIndex": 1
                        },
                        3: {
                            "type": "line",
                            "color": "#F79A1B",
                            "targetAxisIndex": 1
                        }
                    },
                    "vAxes": {
                        0: {
                            "viewWindowMode": "explicit",
                            "viewWindow": {
                                "min": 0
                            },
                            "gridlines": {
                                "color": "#EBEBEB",
                                "count": 5
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "No. of Visits",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false",
                            }
                        },
                        1: {
                            "gridlines": {
                                "color": "transparent",
                                "count": 3
                            },
                            "viewWindow": {
                                "min": 0
                            },
                            "textStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12"
                            },
                            "title": "Cholesterol",
                            "titleTextStyle": {
                                "fontName": "Roboto",
                                "color": "#9EA3A1",
                                "fontSize": "12",
                                "italic": "false"
                            }
                        }
                    },
                    "hAxis": {
                        "baselineColor": "#D5D5D5",
                        "textPosition": "out",
                        "gridlines": {
                            "color": "transparent"
                        },
                        "textStyle": {
                            "fontName": "Roboto",
                            "color": "#9EA3A1",
                            "fontSize": "12"
                        }
                    }
                };
                var chartObject = {
                    "type": "ComboChart",
                    "backgroundColor": "transparent",
                    "displayed": true,
                    "data": {
                        "rows": rows,
                        "cols": cols
                    },
                    "options": options,
                    "formatters": {}
                };
                // console.log(chartObject);
                return chartObject;
            },
            switch_items: function () {
                return switch_items;
            },
            gender_options: function () {
                return gender_options;
            },
            clinic_options: function (chapter_name) {
                return Request.get("clinics", {"chapter": chapter_name}).then(function (response) {
                    var data = [];
                    data.push("All");
                    for (var count = 0; count < angular.copy(response)['data']['data'].length; count++) {
                        data.push(angular.copy(response)['data']['data'][count]);
                    }
                    return data;
                });
            },
            chapter_options: function () {
                return Request.get("chapters", {}).then(function (response) {
                    var data = [];
                    data.push("All");
                    for (var count = 0; count < angular.copy(response)['data']['data'].length; count++) {
                        data.push(angular.copy(response)['data']['data'][count]);
                    }
                    return data;
                });
            },
            today: function () {
                return date_object.toLocaleDateString("en-us", {
                    month: "short"
                }) + " " + date_object.getDate().toString() + ", " + date_object.getFullYear().toString();
            },
            nextMonth: function () {
                return new_date_object.toLocaleDateString("en-us", {
                    month: "short"
                }) + " " + new_date_object.getDate().toString() + ", " + new_date_object.getFullYear().toString();
            },
            getCholesterol: function (filter) {
                var submitted_filter = angular.copy(filter);
                submitted_filter.gender = submitted_filter.gender.value;
                return Request.post("cholesterol", submitted_filter).then(function (response) {
                    var data = angular.copy(response);
                    data = data['data'];
                    if (data['success'] == true)
                        return data['data'];
                    else
                        return null;
                });
            },
            program_participants_count: function () {
                return Request.get("program-participants-count", {}).then(function (response) {
                    var data = angular.copy(response);
                    data = data['data'];
                    if (data['success'] == true)
                        return data['data']
                    else
                        return null;
                });
            },
            getBloodPressure: function (filter) {
                var submitted_filter = angular.copy(filter);
                submitted_filter.gender = submitted_filter.gender.value;
                return Request.post("bloodpressure", submitted_filter).then(function (response) {
                    var data = angular.copy(response);
                    data = data['data'];
                    if (data['success'] == true)
                        return data['data'];
                    else
                        return null;
                });
            },
            records: function () {
                return Request.get("records", {}).then(function (response) {
                    var data = angular.copy(response);
                    data = data['data'];
                    if (data['success'] == true)
                        return data['data']
                    else
                        return null;
                })
            }
        }
    })
    .controller("AnalyticsController", function ($scope, Analytics, $timeout) {
        $scope.getQuarter = function (starting_month, ending_month, year) {
            var ending_year = starting_year = year;
            if (ending_month > 8)
                ending_year -= 1;
            if (starting_month > 8)
                starting_year -= 1;
            var starting_date = new Date(starting_year, starting_month - 1, 1);
            var ending_date = new Date(ending_year, ending_month, 0);
            $scope.filter.visit.start = starting_date.toLocaleDateString("en-us", {
                month: "short"
            }) + " " + starting_date.getDate().toString() + ", " + starting_date.getFullYear().toString();
            $scope.filter.visit.end = ending_date.toLocaleDateString("en-us", {
                month: "short"
            }) + " " + ending_date.getDate().toString() + ", " + ending_date.getFullYear().toString();
            get_data();
        }
        var legends_cholesterol = [{
                "swatch": "triglyceride",
                "name": "Triglyceride"
        }, {
                "swatch": "ldl",
                "name": "LDL"
        },
            {
                "swatch": "hdl",
                "name": "HDL"
                          }, {
                "swatch": "visits",
                "name": "Visits"
            }];
        var legends_bloodpressure = [{
            "swatch": "systolicbp",
            "name": "Systolic BP"
        }, {
            "swatch": "dystolicbp",
            "name": "Dystolic BP"
        }, {
            "swatch": "visits",
            "name": "Visits"
            }];
        $scope.todays_date = Analytics.today();
        $scope.next_month_date = Analytics.nextMonth();
        $scope.switch_items = Analytics.switch_items();
        $scope.gender_options = Analytics.gender_options();

        Analytics.chapter_options().then(function (response) {
            $timeout(function () {
                $scope.chapter_options = angular.copy(response).map(function (el) {
                    return {
                        "name": el,
                        "value": el
                    };
                });
                $scope.filter.chapter = $scope.chapter_options[0];
                // console.log($scope.filter)
            }, 0);
        })

        Analytics.clinic_options("All").then(function (response) {
                $timeout(function () {
                    $scope.clinic_options = angular.copy(response).map(function (el) {
                        return {
                            "name": el,
                            "value": el
                        };
                    });
                    $scope.filter.clinic = $scope.clinic_options[0];
                }, 0);
        }) 

        $scope.chapter_change = function(){
            Analytics.clinic_options($scope.filter.chapter.name).then(function (response) {
                $timeout(function () {
                    $scope.clinic_options = angular.copy(response).map(function (el) {
                        return {
                            "name": el,
                            "value": el
                        };
                    });
                    $scope.filter.clinic = $scope.clinic_options[0];
                }, 0);
            })    
        }
        
        

        $scope.switch = function (item) {
            $scope.switch_items = $scope.switch_items.map(function (el) {
                if (el.name == item.name)
                    el.value = true;
                else
                    el.value = false;
                return el;
            });
        };
        Analytics.program_participants_count().then(function (response) {
            $scope.participants = angular.copy(response);
        })
        Analytics.records().then(function (response) {
            $scope.records = angular.copy(response);
        })
        var get_data = function () {
            var selected_filter = $scope.switch_items.filter(function (el) {
                return el.value == true;
            })[0];
            if (selected_filter.name == "Blood Pressure") {
                $scope.legends = legends_bloodpressure;
                Analytics.getBloodPressure($scope.filter).then(function (response) {
                    var data = angular.copy(response);
                    $scope.chartObject = Analytics.chartBloodPressure(data);
                    // console.log(data);
                });
            } else if (selected_filter.name == "Cholesterol") {
                $scope.legends = legends_cholesterol;
                Analytics.getCholesterol($scope.filter).then(function (response) {
                    var data = angular.copy(response);
                    $scope.chartObject = Analytics.chartCholesterol(data);
                });
            }
        }
        $scope.filter_submit = function () {
            get_data();
        }
        $timeout(get_data, 0);
    })