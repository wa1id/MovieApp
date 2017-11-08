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

.controller('homeCtrl', function($scope, acteurSrv, putDocSrv, getDocSrv, viewSrv) {
	
	$('#searchView').on('click', function(e) {
		var param = $('#viewSearch').val();
		var viewString = '_view/byName?key=' + param;
		
		viewSrv.getView(viewString).then(function(data) {
			var arr = JSON.parse(data).rows;
			var htmlString;
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].value.type === "acteur") { 
					var titles = [];
					for(var j=0;j<response.rows[i].doc.movies.length;j++){
		            	   titles.push(response.rows[i].doc.movies[j].title);
		                } 
					for (var i = 0; i < titles.length; i++) {
						htmlString += titles[i];
					}
					$("#output").html(htmlString);
				}
			}
		}, function (data) {
			
		});
	})
	
	$('#searchButton').on('click', function(e) {
		
		var acteur = $('#acteurText').val();
		
		acteurSrv.getActeur(acteur).then(function(data) {
			//console.log(data);
			var doc = {};
			var movies = data.data[0].filmography.actor;
			doc.acteur = acteur;
			doc.movies = movies;
			doc.type = "acteur";

			putDocSrv.putDoc(acteur,doc).then(function(response){
				getDocSrv.getDoc().then(function(response){
			        var titles = [];
			        for(var i=0;i<response.rows.length;i++){
			           if(response.rows[i].id != "_design/views" && response.rows[i].doc.type == "acteur"){
			               for(var j=0;j<response.rows[i].doc.movies.length;j++){
			            	   titles.push(response.rows[i].doc.movies[j].title);
			                } 
			           }
			        }
			        $scope.allMovies = titles;
			    },function(response){
			        
			    });
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

.factory('getDocSrv',['$http','$q',function($http,$q){
    return {
        getDoc: function(){
            var q = $q.defer();
            $http.get('../../_all_docs?include_docs=true')
                .success(function(data, status, headers, config) {
					q.resolve(data);
				})
                .error(function (data, status, headers, config) {
                    q.reject("Doc kon niet worden opgevraagd: Status: " + status);
                 });
            return q.promise;
        }
    }
}])

.factory('viewSrv',['$http','$q',function($http,$q){
    return {
        getView: function(view){
            var q = $q.defer();
            $http.get(view)
                .success(function(data, status, headers, config) {
					q.resolve(data);
				})
                .error(function (data, status, headers, config) {
                    q.reject("Doc kon niet worden opgevraagd: Status: " + status);
                 });
            return q.promise;
        }
    }
}])

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