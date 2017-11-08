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

.controller('homeCtrl', function($scope, acteurSrv) {
	
	$('#searchButton').on('click', function(e) {
		
		var acteur = $('#acteurText').val();
		
		acteurSrv.getActeur(acteur).then(function(data) {
			console.log(data);
			
		});
	});
})

.service('acteurSrv', function($http, $q) {
	this.getActeur = function(acteur) {
		
		var q = $q.defer();
		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(acteur);
		
		$http.get(url)
			.then(function(data) {
				q.resolve(data);
			}, function error(err) {
				q.reject(err);
			});
		
		return q.promise;
	}
})