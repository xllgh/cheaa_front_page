/**
 *  No bugs! God bless!
 *  Created by Jim 9/9/16 4:05 PM.
 */
angular = require('angular');

angular.module('demomvc')
    .controller('AddCtrl', function AddCtrl($scope, $rootScope, $routeParams, $filter, DeviceService) {
        'use strict';

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

        if ($rootScope.userId == null) {
            $rootScope.userId = getQueryString("aweToken");
        }


        $scope.step = 1;
        $scope.user = {};
        $scope.modal = false;
        $scope.errTitle = '';
        $scope.errMsg = '';

        console.log($scope.user.username);


        //var qrResult = getQueryString("qrResult") == null ? "000007+010404+86100c009002005000000101959525e21ur02000nljk00h4jj10811" : getQueryString("qrResult");
        //
        //// use this mock to simulate the response of the native QR-Scanner
        //var HCWebExtension = {
        //    showQRScanner: function (arg) {
        //        arg.resultCallback(qrResult);
        //    }
        //};

        window.getDeviceInfo = function () {
            var platId = window.platId == undefined ? 'undefined' : window.platId.replace(/\\/g, '');
            var deviceTypeId = window.deviceTypeId == undefined ? 'undefined' : window.deviceTypeId.replace(/\\/g, '');
            DeviceService.getDeviceInfo(platId, deviceTypeId).then(function (result) {
                console.log(result);
                if (result.data.flag) {
                    $scope.deviceInfo = result.data.data;
                    $scope.step = 2;
                } else {
                    $scope.errTitle = '扫描失败了';
                    $scope.errMsg = '抱歉,我们暂时还未支持您扫描的设备';
                    $scope.modal = true;
                }
            }, function () {
                $scope.errTitle = '扫描失败了';
                $scope.errMsg = '抱歉,我们暂时还未支持您扫描的设备';
                $scope.modal = true;
            });
        };

        HCWebExtension.showQRScanner({
            resultCallback: function (result) {
                console.log(result);
                var arr = result.split("+");
                window.platId = arr[0];
                window.deviceTypeId = arr[1];
                window.deviceId = arr[2];
                window.getDeviceInfo();
            },
            cancelCallback: function () {
                window.location.href = "#/";
            }
        });


        $scope.next = function () {
            $scope.step = 3;
        }

        $scope.cancel = function () {
            window.location.href = "#/";
        }


        $scope.update = function (user) {
            console.log(user);
            if (user.userName == undefined || user.password == undefined) {
                return;
            }
            var bind = {
                "UserID": $rootScope.userId,
                "PlatID": window.platId,
                "DeviceID": window.deviceId,
                "DeviceType": window.deviceTypeId,
                "UserName": user.userName
            };

            DeviceService.bind(bind).then(function (data) {
                var result = data.data;
                if (!result.flag) {
                    $scope.errTitle = '绑定失败了';
                    if (result.code == 4) {
                        $scope.errMsg = '用户设备已存在,无需重复绑定!';
                    } else {
                        $scope.errMsg = result.msg;
                    }

                    $scope.modal = true;
                } else {
                    window.location.href = "#/"
                }
            });
        };

        $scope.hide = function () {
            $scope.modal = false;
            window.location.href = "#/"
        }
    });