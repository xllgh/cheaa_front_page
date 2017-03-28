/**
 *  No bugs! God bless!
 *  Created by Jim 9/28/16 12:04 PM.
 */
angular = require('angular');

angular.module('demomvc').service('DeviceService', function ($http, $q, serviceBaseUrl) {
    'use strict';

    this.getList = function (userId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(serviceBaseUrl + "/bsh/user/devices?userId="+userId)
            .then(function (data) {
                deferred.resolve(data);//执行成功
            },function (data) {
                deferred.reject();//执行失败
            });

        return promise;
    }

    this.bind = function (bind) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        console.log(bind);
        $http.post(serviceBaseUrl + "/bsh/user/bindDevices", bind).then(function (data, status) {
            deferred.resolve(data);//执行成功
        },function (data) {
            deferred.reject();//执行失败
        });

        return promise;
    }


    this.delete = function (userId, deviceId) {
        var post = {"UserID": userId, "DeviceID": deviceId};
        console.log(post);
        var deferred = $q.defer();
        var promise = deferred.promise;
        //$http.delete(serviceBaseUrl + '/bsh/user/unbindDevices', post).success(function (data, status) {
        //    deferred.resolve(data);//执行成功
        //}).error(function (data) {
        //    deferred.reject();//执行失败
        //});

        $http({
            url: serviceBaseUrl + '/bsh/user/unbindDevices',
            method: 'DELETE',
            data: post,
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).then(function (data, status) {
            deferred.resolve(data);//执行成功
        },function (data) {
            deferred.reject();//执行失败
        });

        return promise;
    }

    this.getDeviceInfo = function (platId, type) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(serviceBaseUrl + "/bsh/devices/deviceType/" + platId + "/" + type)
            .then(function (data) {
                deferred.resolve(data);//执行成功
            },function (data) {
                deferred.reject();//执行失败
            });

        return promise;
    }

    this.getDevice = function (deviceId) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(serviceBaseUrl + "/bsh/devices/deviceStatus?DeviceID=" + deviceId)
            .then(function (data) {
                deferred.resolve(data);//执行成功
            },function (data) {
                deferred.reject();//执行失败
            });

        return promise;
    }

    this.op = function (post) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        console.log(post);
        $http.post(serviceBaseUrl + "/bsh/devices/op", post).then(function (data, status) {
            deferred.resolve(data);//执行成功
        },function (data) {
            deferred.reject();//执行失败
        });

        return promise;
    }

});