

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



ambienteApp.controller('PreguntasCtrl', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {

        //Esto se ejecuta apenas el controlador se carga
        getPreguntas(function (preguntas) {//función que recibe por parámetro es success
            var arRamdom = new Array();
            var len = preguntas.length;

            if (len > 5) {
                for (var i = 0; i < 5; i++) {
                    arRamdom[i] = preguntas[Math.floor((Math.random() * len) + 1)];
                }
            } else {
                for (var i = 0; i < len; i++) {
                    arRamdom[i] = preguntas[Math.floor((Math.random() * len) + 1)];
                }
            }
            $scope.index = 0
            $scope.vista = 'pregunta'
            $scope.preguntas = arRamdom
            $scope.pregunta = arRamdom[$scope.index]
            $scope.siguiente = arRamdom[$scope.index + 1]
            $scope.puntos = 0
            $scope.$apply()
        })

        $scope.calificar = function (respuestaSeleccionada) {

            if ($scope.pregunta.respuesta == respuestaSeleccionada) {
                $scope.puntos += 10
                $scope.correcto = true;
                $scope.feed = $scope.pregunta.textoacierto;
            } else {
                $scope.correcto = false;
                $scope.feed = $scope.pregunta.textoerror;
            }


            $scope.vista = 'respuesta'

            if ($scope.index < $scope.preguntas.length - 1) {
                $scope.index++
                $scope.pregunta = $scope.siguiente
                $scope.siguiente = $scope.preguntas[$scope.index + 1]
            } else {
                $scope.pregunta = $scope.siguiente
                $scope.siguiente = null
                console.log("voy pal final")
            }
        }


        $scope.ir_siguiente = function () {
            if ($scope.pregunta == null) {
                $scope.vista = 'final'

                if (localStorage.getItem("PuntosRegistro") != null && localStorage.getItem("PuntosRegistro") != "") {
                    //Verifica si ha ganado puntos, y si estos no son mayores a los que ganó
                    //en el juego actual entonces reemplaza el valor
                    if (localStorage.getItem("PuntosRegistro") < $scope.puntos) {
                        localStorage.setItem("PuntosRegistro", $scope.puntos);
                    }
                } else {
                    localStorage.setItem("PuntosRegistro", $scope.puntos);
                }
            } else {
                $scope.vista = 'pregunta'
            }
        }

        $scope.compartir = function () {
            window.plugins.socialsharing.share('He ganado ' + $scope.puntos + ' puntos en Red Posconsumo. ¿Puedes superarme?', null, null, 'http://www.minambiente.gov.co/')
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
        'http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/pregrecpostconsumo?$format=json',
        function(data, textStatus, jqXHR){
            success(data.d)
        })
}