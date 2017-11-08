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

.controller('homeCtrl', function($scope, acteurSrv, putDocSrv) {
	
	$('#searchButton').on('click', function(e) {
		
		var acteur = $('#acteurText').val();
		
		acteurSrv.getActeur(acteur).then(function(data) {
			//console.log(data);
			var doc = {};
			var movies = data.data[0].filmography.actor;
			doc.acteur = acteur;
			doc.movies = movies;

			putDocSrv.putDoc(acteur,doc).then(function(response){
	            
	        },function(response){
	            
	        })
			
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

.factory('putDocSrv',['$http','$q',function($http,$q){
    return {
    	putDoc: function(key, doc){
            var method = 'PUT';
            var q = $q.defer();
            $http({
                url: '../../' + key,
                method: method,
                data: JSON.stringify(doc),
                contentType: "application/json"
            }).success(function (data, status, headers, config) {
                q.resolve(method + " is goed uitgevoerd: Status " + status);
             })
                .error(function (data, status, headers, config) {
                 q.reject(method + " is niet goed uitgevoerd: Status " + status);
             });
            return q.promise;
        }
    }
}]);