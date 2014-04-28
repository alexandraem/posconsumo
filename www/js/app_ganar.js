

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



ambienteApp.controller( 'PreguntasCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {
        getPreguntas(function( preguntas ){
            $scope.index = 0
            $scope.vista = 'pregunta'
            $scope.preguntas = preguntas
            $scope.pregunta = preguntas[$scope.index]
            $scope.siguiente = preguntas[$scope.index+1]
            $scope.puntos = 0
            $scope.$apply()
        })

        $scope.calificar = function( respuesta ){
            $scope.respuesta = respuesta

            if(respuesta.valoracion == 'true'){
                $scope.puntos += 10
            }


            $scope.vista = 'respuesta'

            if($scope.index < $scope.preguntas.length-1){
                $scope.index++
                $scope.pregunta = $scope.siguiente
                $scope.siguiente = $scope.preguntas[$scope.index+1]
            }else{
                $scope.pregunta = $scope.siguiente
                $scope.siguiente = null
                console.log("voy pal final")
            }
        }


        $scope.ir_siguiente = function(){
            if ($scope.pregunta == null){
                $scope.vista = 'final'

                if(localStorage.getItem("PuntosRegistro") != null && localStorage.getItem("PuntosRegistro") != ""){
                    //Verifica si ha ganado puntos, y si estos no son mayores a los que ganó
                    //en el juego actual entonces reemplaza el valor
                    if(localStorage.getItem("PuntosRegistro") < $scope.puntos){
                        localStorage.setItem("PuntosRegistro", $scope.puntos);
                    }
                }else{
                    localStorage.setItem("PuntosRegistro", $scope.puntos);
                }
            }else{
                $scope.vista = 'pregunta'
            }
        }

    }
])


ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/ganar-template.html',
        controller: 'PreguntasCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

}]);





function getPreguntas( success ){
    $.getJSON(
        'data/preguntas.json',
        function(data, textStatus, jqXHR){
            success(data.preguntas)
        })
}