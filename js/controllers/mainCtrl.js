/**
 *  No bugs! God bless!
 *  Created by Jim 9/28/16 11:43 AM.
 */
angular = require('angular');

angular.module('demomvc')
    .controller('MainCtrl', function MainCtrl($scope, $rootScope, $filter, DeviceService) {
        'use strict';

        //删除其他页面的定时任务
        if ($rootScope.airInterval != null) {
            clearInterval($rootScope.airInterval);
        }
        if ($rootScope.fridgeInterval != null) {
            clearInterval($rootScope.fridgeInterval);
        }
        if ($rootScope.hoodsInterval != null) {
            clearInterval($rootScope.hoodsInterval);
        }
        //关闭所有弹框
        $('.dw-modal').hide();

        var getQueryString = function (key) {
            var result = null;
            var url = window.location.search == "" ? window.location.hash : window.location.search;
            if (url.indexOf("?") != -1) {
                var str = url.substr(url.indexOf("?") + 1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    if (strs[i].split("=")[0] == key) {
                        result = unescape(strs[i].split("=")[1]);
                        break;
                    }

                }
            }
            return result;
        }

        $rootScope.userId = getQueryString("aweToken");

        $rootScope.devices = [];

        $scope.showDel = false;

        $scope.waittingDel = null;

        if ($rootScope.userId != null) {
            DeviceService.getList($rootScope.userId).then(function (result) {
                $rootScope.devices = result.data.data;
                $scope.waittingDel = $rootScope.devices[0];
            });
        }

        $scope.control = function (device) {
            $rootScope.device = device;
            switch (device.deviceType) {
                case "010404":
                    window.location.href = "#/hoods/" + device.platId + "/" + device.deviceId;
                    break;
                case "010103":
                    window.location.href = "#/fridge/" + device.platId + "/" + device.deviceId;
                    break;
                case "03001012":
                    window.location.href = "#/air/" + device.platId + "/" + device.deviceId;
                    break;
                default :
                    break;
            }
        };

        $scope.select = function (device) {
            $scope.waittingDel = device;
        }

        $scope.delete = function () {
            $scope.showDel = true;
        };

        $scope.cancel = function () {
            $scope.showDel = false;
        }

        $scope.comfirmDel = function () {
            DeviceService.delete($scope.waittingDel.userId, $scope.waittingDel.deviceId).then(function (result) {
                $rootScope.devices.splice($rootScope.devices.lastIndexOf($scope.waittingDel), 1);
                $scope.waittingDel = $rootScope.devices[0];
                $scope.showDel = false;
            });
        }

        $scope.add = function () {
            window.location.href = "#/add"
        };
    });