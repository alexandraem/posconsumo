

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);


ambienteApp.directive('backButton', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', goBack);
        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
});

ambienteApp.controller( 'VidaCategoriasCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {

        $scope.mostrar = function(categoria){
            $location.path("/info-" + categoria)
        }
    }
])


ambienteApp.controller( 'InfoDetalleCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {
        getInformacion( $routeParams.categoria , function( utilidad ){
            $scope.utilidad = utilidad
            $scope.$apply()
        })
    }
])

ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/categorias-vida-util.html',
        controller: 'VidaCategoriasCtrl'
      }).
      when('/info-:categoria', {
        templateUrl: 'templates/vida-util-detalle.html',
        controller: 'InfoDetalleCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

}]);




///////////////////////////////// CONSULTAS AL JSON CONTENEDOR DE DATOS

function getInformacion( categoria, success ){
    $.getJSON(
        'data/vidautil.json',
        function(data, textStatus, jqXHR){

          for(var i =0; i<data.utilidad.length; i++){
              if(data.utilidad[i].categoria == categoria){
                 success(data.utilidad[i])
                 break;
              }
          }
        })
}