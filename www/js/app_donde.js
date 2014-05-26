

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute', 'google-maps']
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



ambienteApp.controller( 'LugaresCategoriasCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {
       
        $scope.mostrar = function(categoria){
            $location.path("/lugares-" + categoria)
        }
    }
])

ambienteApp.controller( 'LugaresCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {

        $scope.state = "Cargando departamentos..."
        getDeptos(function( departamentos ){
            $scope.departs = departamentos
            if($scope.departs.length > 0){
                //deptoSel se crea en el select en el html
                $scope.deptoSel = $scope.departs[0].codigo
            }
            $scope.state = ""
            $scope.$apply()
            
            $scope.cargarMunicipios();
         })

        $scope.cargarMunicipios = function(){
            $scope.state = "Cargando municipios..." 
            var CodDpto = $scope.deptoSel;
            $.getJSON(
                "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/lugarespuntos01?$filter=codigodepartamento%20EQ%20'"+CodDpto+"'&$format=json",
                function(data, textStatus, jqXHR){
                    var mnpios = [];
                    for (var i = 0; i < data.d.length; i++) {
                        mnpios.push(data.d[i])
                    }
                    $scope.municipios = mnpios;
                    if($scope.municipios.length>0){
                        $scope.munSel = $scope.municipios[0].codigomunicipio
                    }
                    $scope.state = ""
                    $scope.$digest()
                })
        }

        $scope.listadoLugares = function(){
            $scope.state = "Cargando puntos de recolección..."
            var CodDpto = $scope.deptoSel;
            var CodMnpio = $scope.munSel;
            console.log("categoria =" + $routeParams.categoria)
            $.getJSON(
                "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/puntosposconsumo?$filter=codigodepto%20EQ%20'"+CodDpto+"'%20and%20codigomunicipio%20EQ%20'"+CodMnpio+"'%20and%20categoria%20EQ%20'"+$routeParams.categoria+"'&$format=json",
                function(data, textStatus, jqXHR){
                    console.log(data)
                    var lugares = []
                    for (var i = 0; i < data.d.length; i++) {
                            lugares.push(data.d[i])
                    }
                    $scope.puntos = lugares; 
                    $scope.state = ""
                    $scope.$digest()
                })
        }
       
        $scope.verMapa = function() {
            sessionStorage.setItem("dpSelect", $scope.deptoSel);
            sessionStorage.setItem("mnSelect", $scope.munSel);
            sessionStorage.setItem("ctSelect", $routeParams.categoria);

            window.location.href = "mapa_puntos.html";
        }
    }
])

ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/categorias', {
        templateUrl: 'templates/lugares-cat.html',
        controller: 'LugaresCategoriasCtrl'
      }).
      when('/lugares-:categoria', {
        templateUrl: 'templates/lugares.html',
        controller: 'LugaresCtrl'
      }).
      otherwise({
        redirectTo: '/categorias'
      });
}]);



///////////////////////////////// CONSULTAS AL SET DE DATOS

function getDeptos(success){
    $.getJSON(
        'http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/lugarespuntos01?$format=json',
        function(data, textStatus, jqXHR){
            var dptos = [];
            dptos.myIndexOf = function(codigo){
                for (var i = 0; i < dptos.length; i++) {
                      if (codigo == dptos[i].codigo) {
                            return i;
                      }
                }
                return -1;
            }
            for (var i = 0; i < data.d.length; i++) {
                if(dptos.myIndexOf(data.d[i].codigodepartamento) == -1){
                    var object = new Object();
                    object.codigo = data.d[i].codigodepartamento;
                    object.nombre = data.d[i].nombredepartamento;

                    dptos.push(object)
                }
            }

             success(dptos)
        })
}

function Volver() {
    window.location.href = "_donde.html#/categorias";
}

