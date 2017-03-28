/**
 *  No bugs! God bless!
 *  Created by Jim 9/9/16 4:05 PM.
 */
angular = require('angular');

angular.module('demomvc')
    .controller('AirCtrl', function AirCtrl($scope, $rootScope, $routeParams, $filter, DeviceService) {
        'use strict';

        $scope.flag = true;

        $scope.platId = $routeParams.PlatId;


        DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
            var result = data.data;
            $scope.deviceImage = result.data.DeviceInfo.imageUri;
            $scope.deviceName = result.data.DeviceInfo.deviceName;
            var onOffStatus = result.data.DeviceAttr.onOffStatus == "True";
            //if ($scope.platId == '000008') {
            //    onOffStatus = result.data.DeviceAttr.onOffStatus == "TRUE"
            //}
            result.data.DeviceAttr.onOffStatus = onOffStatus;
            if (result.data.DeviceAttr.windDirectionHorizontal == undefined) {
                result.data.DeviceAttr.windDirectionHorizontal = "0";
            }
            if (result.data.DeviceAttr.windDirectionVertical == undefined) {
                result.data.DeviceAttr.windDirectionVertical = "0";
            }
            $scope.air = result.data.DeviceAttr;

        });

        $rootScope.airInterval = setInterval(function () {
            DeviceService.getDevice($routeParams.DeviceID).then(function (data) {
                var result = data.data;
                $scope.deviceImage = result.data.DeviceInfo.imageUri;
                $scope.deviceName = result.data.DeviceInfo.deviceName;
                var onOffStatus = result.data.DeviceAttr.onOffStatus == "True";
                //if ($scope.platId == '000008') {
                //    onOffStatus = result.data.DeviceAttr.onOffStatus == "TRUE"
                //}
                result.data.DeviceAttr.onOffStatus = onOffStatus;
                if (result.data.DeviceAttr.windDirectionHorizontal == undefined) {
                    result.data.DeviceAttr.windDirectionHorizontal = "0";
                }
                if (result.data.DeviceAttr.windDirectionVertical == undefined) {
                    result.data.DeviceAttr.windDirectionVertical = "0";
                }
                $scope.air = result.data.DeviceAttr;

            });
        }, 5000);


        //操作(param: 0.减加 1.增加)
        $scope.op = function (type, param) {
            var post = {
                "DeviceID": $routeParams.DeviceID,
                "DeviceAttr": {}
            };

            switch (type) {
                case "operationMode":
                    var target = parseInt($scope.air.operationMode);
                    if (param == 0) {
                        if (target == 4 || target == 6) {
                            target = target - 2;
                        } else {
                            target = target - 1;
                        }
                    } else {
                        if (target == 4 || target == 2) {
                            target = target + 2;
                        } else {
                            target = target + 1;
                        }
                    }
                    if (target >= 0 && target <= 6) {
                        $scope.air.operationMode = target.toString();
                        post.DeviceAttr = {"operationMode": $scope.air.operationMode};
                    }
                    break;
                case "onOffStatus":
                    $scope.air.onOffStatus = param;
                    var status = $scope.air.onOffStatus ? "True" : "False";
                    //if ($scope.platId == '000008') {
                    //    status = $scope.air.onOffStatus ? "TRUE" : "FALSE";
                    //}
                    post.DeviceAttr = {"onOffStatus": status};
                    break;
                case "targetTemperature":
                    var target = parseInt($scope.air.targetTemperature);
                    if (param == 0) {
                        target = target - 1;
                    } else {
                        target = target + 1;
                    }

                    if (($scope.platId != '000008' && target >= 16 && target <= 31) || ($scope.platId == '000008' && target >= 17 && target <= 30)) {
                        $scope.air.targetTemperature = target.toString();
                        post.DeviceAttr = {"targetTemperature": $scope.air.targetTemperature};
                    }
                    break;
                case "windSpeed":
                    var target = parseInt($scope.air.windSpeed);
                    if (param == 0) {
                        if (target == 5) {
                            target = target - 2;
                        } else {
                            target = target - 1;
                        }
                    } else {
                        if (target == 3) {
                            target = target + 2;
                        } else {
                            target = target + 1;
                        }
                    }
                    if (target >= 1 && target <= 5) {
                        $scope.air.windSpeed = target.toString();
                        post.DeviceAttr = {"windSpeed": $scope.air.windSpeed};
                    }
                    break;
                case "windDirectionVertical":
                    var target = parseInt($scope.air.windDirectionVertical);
                    if (param == 0) {
                        if (target == 8) {
                            target = 0;
                        }
                    } else {
                        if (target == 0) {
                            target = 8;
                        }
                    }
                    if (target >= 0 && target <= 8) {
                        $scope.air.windDirectionVertical = target.toString();
                        post.DeviceAttr = {"windDirectionVertical": $scope.air.windDirectionVertical};
                    }
                    break;
                case "windDirectionHorizontal":
                    var target = parseInt($scope.air.windDirectionHorizontal);
                    if (param == 0) {
                        if (target == 7) {
                            target = 0;
                        }
                    } else {
                        if (target == 0) {
                            target = 7;
                        }
                    }
                    if (target >= 0 && target <= 7) {
                        $scope.air.windDirectionHorizontal = target.toString();
                        post.DeviceAttr = {"windDirectionHorizontal": $scope.air.windDirectionHorizontal};
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