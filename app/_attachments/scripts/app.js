'use strict'

angular.module('moviesApp', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'assets/views/home.html',
            controller: 'homeCtrl'
        })
        .otherwise({
            redirectTo: '/home'
          });
})

.controller('homeCtrl', function($scope) {
	
	
	
})