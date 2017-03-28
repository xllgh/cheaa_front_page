/**
 *  No bugs! God bless!
 *  Created by Jim 9/9/16 4:05 PM.
 */
angular = require('angular');

angular.module('demomvc')
    .controller('HoodsCtrl', function HoodsCtrl($scope, $rootScope, $routeParams, $filter, DeviceService) {
        'use strict';

        $scope.flag = true;

        //$scope.hoods = {
        //    "mode": "1",
        //    "lightLevel": "0",
        //    "windLevel": "0",
        //    "onOffStatus": "true"
        //};
        //
        //$scope.DeviceOnline = "true";

        //$scope.hoods = {"onOffStatus": false};

        DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
            var result=data.data;
            result.data.DeviceAttr.onOffStatus = result.data.DeviceAttr.onOffStatus == "True";
            $scope.hoods = result.data.DeviceAttr;
            $scope.deviceImage = result.data.DeviceInfo.imageUri;
            $scope.deviceName = result.data.DeviceInfo.deviceName;
        });

        $rootScope.hoodsInterval = setInterval(function () {
            DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
                var result=data.data;
                result.data.DeviceAttr.onOffStatus = result.data.DeviceAttr.onOffStatus == "True";
                $scope.hoods = result.data.DeviceAttr;
                $scope.deviceImage = result.data.DeviceInfo.imageUri;
                $scope.deviceName = result.data.DeviceInfo.deviceName;
            });
        }, 5000);

        //$scope.$watch('hoods', function (newValue, oldValue) {
        //    // console.log(newValue);
        //    if (oldValue != null && $scope.flag && newValue.onOffStatus != oldValue.onOffStatus) {
        //        $scope.flag = false;
        //        var post = {
        //            "DeviceID": $routeParams.DeviceID,
        //            "DeviceAttr": {}
        //        };
        //        post.DeviceAttr = {"onOffStatus": newValue.onOffStatus.toString()};
        //        DeviceService.op(post).then(function (result) {
        //            $scope.flag = true;
        //            console.log(result);
        //        });
        //    }
        //}, true); ////检查被监控的对象的每个属性是否发生变化


        //操作(param:0.空 1.减加 2.增加)
        $scope.op = function (type, param) {
            var post = {
                "DeviceID": $routeParams.DeviceID,
                "DeviceAttr": {}
            };

            switch (type) {
                case "onOffStatus":
                    if (param == 0) {
                        $scope.hoods.onOffStatus = false;
                        post.DeviceAttr = {"onOffStatus": "false"};
                    } else {
                        $scope.hoods.onOffStatus = true;
                        post.DeviceAttr = {"onOffStatus": "true"};
                    }
                    break;
                case "lightLevel":
                    var target = parseInt($scope.hoods.lightLevel);
                    if (param == 0) {
                        target = target - 1;
                    } else {
                        target = target + 1;
                    }
                    if (target >= 0 && target <= 3) {
                        $scope.hoods.lightLevel = target.toString();
                        post.DeviceAttr = {"lightLevel": $scope.hoods.lightLevel};
                    }
                    break;
                case "windLevel":
                    var target = parseInt($scope.hoods.windLevel);
                    if (param == 0) {
                        target = target - 1;
                    } else {
                        target = target + 1;
                    }
                    if (target >= 0 && target <= 3) {
                        $scope.hoods.windLevel = target.toString();
                        post.DeviceAttr = {"windLevel": $scope.hoods.windLevel};
                    }
                    break;
                default :
                    break;
            }

            DeviceService.op(post).then(function (result) {
                console.log(result);
            });
        };

        $scope.back=function(){
            window.location.href = "#/"
        };

    });