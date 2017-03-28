/**
 *  No bugs! God bless!
 *  Created by Jim 07/11/2016 10:07 AM.
 */
/**
 *  No bugs! God bless!
 *  Created by Jim 9/9/16 4:05 PM.
 */
angular = require('angular');

angular.module('demomvc')
    .controller('FridgeCtrl', function FridgeCtrl($scope, $rootScope, $routeParams, $filter, DeviceService) {
        'use strict';

        $scope.flag = true;

        $scope.platId = $routeParams.PlatId;

        DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
            var result=data.data;
            $scope.deviceImage = result.data.DeviceInfo.imageUri;
            $scope.deviceName = result.data.DeviceInfo.deviceName;
            //if ($scope.platId != '000008') {
            result.data.DeviceAttr.doorStatus = result.data.DeviceAttr.doorStatus == "True";
            result.data.DeviceAttr.quickFreezingMode = result.data.DeviceAttr.quickFreezingMode == "True";
            result.data.DeviceAttr.quickCoolingMode = result.data.DeviceAttr.quickCoolingMode == "True";
            //}

            $scope.fridge = result.data.DeviceAttr;

        });

        $rootScope.fridgeInterval = setInterval(function () {
            DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
                var result=data.data;
                $scope.deviceImage = result.data.DeviceInfo.imageUri;
                $scope.deviceName = result.data.DeviceInfo.deviceName;
                //if ($scope.platId != '000008') {
                result.data.DeviceAttr.doorStatus = result.data.DeviceAttr.doorStatus == "True";
                result.data.DeviceAttr.quickFreezingMode = result.data.DeviceAttr.quickFreezingMode == "True";
                result.data.DeviceAttr.quickCoolingMode = result.data.DeviceAttr.quickCoolingMode == "True";
                //}

                $scope.fridge = result.data.DeviceAttr;
            });
        }, 5000);


        //操作(param: 0.减加 1.增加)
        $scope.op = function (type, param) {
            var post = {
                "DeviceID": $routeParams.DeviceID,
                "DeviceAttr": {}
            };

            switch (type) {
                case "quickFreezingMode":
                    if (param == 0) {
                        $scope.fridge.quickFreezingMode = false;
                        post.DeviceAttr = {"quickFreezingMode": "False"};
                    } else {
                        $scope.fridge.quickFreezingMode = true;
                        post.DeviceAttr = {"quickFreezingMode": "True"};
                    }
                    break;
                case "quickCoolingMode":
                    if (param == 0) {
                        $scope.fridge.quickCoolingMode = false;
                        post.DeviceAttr = {"quickCoolingMode": "False"};
                    } else {
                        $scope.fridge.quickCoolingMode = true;
                        post.DeviceAttr = {"quickCoolingMode": "True"};
                    }
                    break;
                case "freezerTargetTemperature":
                    var target = parseInt($scope.fridge.freezerTargetTemperature);
                    if (param == 0) {
                        target = target - 1;
                    } else {
                        target = target + 1;
                    }

                    if (($scope.platId != '000008' && target >= -25 && target <= -15) || ($scope.platId == '000008' && target >= -24 && target <= -16)) {
                        $scope.fridge.freezerTargetTemperature = target.toString();
                        post.DeviceAttr = {"freezerTargetTemperature": $scope.fridge.freezerTargetTemperature};
                    }
                    break;
                case "refrigeratorTargetTemperature":
                    var target = parseInt($scope.fridge.refrigeratorTargetTemperature);
                    if (param == 0) {
                        target = target - 1;
                    } else {
                        target = target + 1;
                    }
                    if (target >= 2 && target <= 8) {
                        $scope.fridge.refrigeratorTargetTemperature = target.toString();
                        post.DeviceAttr = {"refrigeratorTargetTemperature": $scope.fridge.refrigeratorTargetTemperature};
                    }
                    break;
                default :
                    break;
            }

            DeviceService.op(post).then(function (result) {
                console.log(result);
            });
        };

        $scope.back = function () {
            window.location.href = "#/"
        };


    });