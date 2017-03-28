/*global angular */

/**
 * The main superDemo app module
 *
 * @type {angular.Module}
 */
var angular = require('angular');
require('angular-route');
require('../dist/templateCachePartials');
require('../dist/config');

angular.module('demomvc', ['ngRoute', 'demoPartials', 'app.config'])
    .config(function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                controller: 'MainCtrl',
                templateUrl: '/partials/main.html'
            })
            .when('/add', {
                controller: 'AddCtrl',
                templateUrl: '/partials/add.html'
            })
            .when('/hoods/:PlatId/:DeviceID', {
                controller: 'HoodsCtrl',
                templateUrl: '/partials/hoods.html'
            })
            .when('/fridge/:PlatId/:DeviceID', {
                controller: 'FridgeCtrl',
                templateUrl: '/partials/fridge.html'
            })
            .when('/air/:PlatId/:DeviceID', {
                controller: 'AirCtrl',
                templateUrl: '/partials/air.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

require('mainCtrl');
require('deviceService');
require('hoodsCtrl');
require('fridgeCtrl');
require('airCtrl');
require('addCtrl');
