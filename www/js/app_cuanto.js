

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);



ambienteApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.google.com/**']);
    });


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



ambienteApp.controller( 'CuantoCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {
        $scope.mostrar = function(categoria){
            $location.path("/cat-"+categoria)
        }
    }
])
ambienteApp.controller( 'CuantoCategoriaCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {
        getPuntajes($routeParams.categoria, function(puntajes){
            $scope.puntajes = puntajes
            for (var i = 0; i < _categorias.length; i++) {
                if(_categorias[i].id == $routeParams.categoria){
                    $scope.categoria = _categorias[i]
                    break;
                }
            }
            $scope.$apply();
        })

        $scope.cantidad = 0
    }
])


ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/cuanto-cat.html',
        controller: 'CuantoCtrl'
      }).
      when('/cat-:categoria', {
        templateUrl: 'templates/cuanto-detalle.html',
        controller: 'CuantoCategoriaCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);


function getPuntajes( categoria, success ){
    $.getJSON(
        "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/cuantoayudo?$filter=categoria%20EQ%20'"+categoria+"'&$format=json",
        function(data, textStatus, jqXHR){
            var puntajes_final = []
            for (var i = 0; i < data.d.length; i++) {
                if(data.d[i].categoria == categoria){
                    puntajes_final.push(data.d[i])
                }
            }
            success(puntajes_final)
        })
}

