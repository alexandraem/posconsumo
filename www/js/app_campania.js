

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);


ambienteApp.controller( 'CampaniasCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {  
        getCampanias(function( campanias ){
            $scope.campaniaLista = campanias
            $scope.$apply()
        })

        $scope.mostrar = function(campania){
            $location.path("/" + campania.id)
        }
    }
])
ambienteApp.controller( 'CampaniaDetalleCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {
        getCampania( $routeParams.campaniaId , function( campain ){
            $scope.campain = campain
            $scope.$apply()
        })
    }
])


ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/campania-list.html',
        controller: 'CampaniasCtrl'
      }).
      when('/:campaniaId', {
        templateUrl: 'templates/campania-detail.html',
        controller: 'CampaniaDetalleCtrl'
      }).

      otherwise({
        redirectTo: '/'
      });

}]);





///////////////////////////////// CONSULTAS AL SET DE DATOS


function getCampania( id , success){
    $.getJSON(
        'data/campanias.json',
        function(data, textStatus, jqXHR){
            var campanias = data.campanias
            var encontrado = false
            for (var i = 0; i < campanias.length; i++) {
                if ( campanias[i].id == id ){
                    success( campanias[i] )
                    encontrado = true
                    break;
                }
            };
            if(!encontrado){
                success( {} )
                console.log("no encontrado")
            }
        })
}


function getCampanias( success ){
    $.getJSON(
        'data/campanias.json',
        function(data, textStatus, jqXHR){
            success(data.campanias)
        })
}