

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);

ambienteApp.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
       'self',
       'https://*.youtube.com/**']);
   });


ambienteApp.controller( 'VideosCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {  
        getVideos(function( videos ){
            //console.log(videos)
            //for (var i = 0; i > videos.length; i++) {
            //    console.log("algo " + videos[i].url);
            //    videos[i].url =  videos[i].url.replace("watch?v=","embed/"); 
            //};

            $scope.videoLista = videos
            
            $scope.$apply()
        })
    }
])

ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/vida-verde.html',
        controller: 'VideosCtrl'
      }).
      
      otherwise({
        redirectTo: '/'
      });

}]);




///////////////////////////////// CONSULTAS AL JSON CONTENEDOR DE DATOS

function getVideos( success ){
    $.getJSON(
        'http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/vidaverde?$format=json',
        function(data, textStatus, jqXHR){
            success(data.d)
        })
}