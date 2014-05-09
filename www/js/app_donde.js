

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



ambienteApp.controller( 'LugaresCategoriasCtrl', ['$scope', '$http', '$location',
    function( $scope, $http, $location ) {
       
        $scope.mostrar = function(categoria){
            $location.path("/lugares-" + categoria)
        }
    }
])

ambienteApp.controller( 'LugaresCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {

        getLugares( $routeParams.categoria, function( lugares ){
            $scope.lugares = lugares

            for (var i = 0; i < _categorias.length; i++) {
                if(_categorias[i].id == $routeParams.categoria){
                    $scope.categoria = _categorias[i]
                    break;
                }
            }

            $scope.$apply()
        })

        $scope.mostrar = function(lugar){
            $location.path("/lugar-" + lugar.RowKey)
        }
    }
])

ambienteApp.controller( 'LugaresDetalleCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {
        getLugar( $routeParams.lugarId , function( lugar ){
            $scope.lugarSel = lugar
            $scope.lugarSel.google_mapa = 'https://www.google.com/maps/embed/v1/search?key=AIzaSyCD8ba07qJ-nqhvsLOIzD78XnTs223zkWQ&q=' + lugar.direccion + ', ' + lugar.municipio
            $scope.$apply()
        })
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
      when('/lugar-:lugarId', {
        templateUrl: 'templates/lugar.html',
        controller: 'LugaresDetalleCtrl'
      }).
      otherwise({
        redirectTo: '/categorias'
      });
}]);



///////////////////////////////// CONSULTAS AL SET DE DATOS


function getLugar( rowKey , success){
    $.getJSON(
        'data/puntosposconsumobarranquilla.json',
        function(data, textStatus, jqXHR){
            var lugares = data.d
            var encontrado = false
            for (var i = 0; i < lugares.length; i++) {
                if ( lugares[i].RowKey == rowKey ){
                    success( lugares[i] )
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


function getLugaresCategorias( success ){
    $.getJSON(
        'data/puntosposconsumobarranquilla.json',
        function(data, textStatus, jqXHR){
            var categorias = []
            for (var i = 0; i < data.d.length; i++) {
                var nueva = {
                    nombre: data.d[i].categoria,
                    id: data.d[i].categoria.replace(/ /g, '_').toLowerCase()
                }
                var existe = false;
                for (var j = 0; j < categorias.length; j++) {
                    if(categorias[j].id == nueva.id){
                        existe = true;
                        break;
                    }
                }
                if(!existe){
                    categorias.push(nueva)
                }
            }

            success(categorias)
        })
}


function getLugares(categoria, success ){
    $.getJSON(
        'data/puntosposconsumobarranquilla.json',
        function(data, textStatus, jqXHR){
            var lugares = []
            for (var i = 0; i < data.d.length; i++) {
                var id_cat = data.d[i].categoria.replace(/ /g, '_').toLowerCase()
                if(id_cat == categoria){
                    lugares.push(data.d[i])
                }
            }
            success(lugares)
        })
}


function puntosCiudadCategoria(ciudad, categoria, success ){
    $.getJSON(
        'data/puntosposconsumobarranquilla.json',
        function(data, textStatus, jqXHR){
            var lugares = []
            for (var i = 0; i < data.d.length; i++) {
                var id_cat = data.d[i].categoria.replace(/ /g, '_').toLowerCase()
                if(id_cat == categoria){
                    lugares.push(data.d[i])
                }
            }
            success(lugares)
        })
}

//////////////// Otros métodos

//Cómo hacer esto con Angular??
//$(document).ready(function () {
  //     CargarCiudades();
//}

function CargarCiudades(){
    var Depto = document.getElementById('combo_departamento').value;
    document.getElementById('combo_municipio').value = Depto;
}

function CargarInfo(){
    var mncpio = document.getElementById('combo_municipio').value;
    console.log(mncpio);
}

function Volver() {
    window.location.href = "_donde.html#/categorias";
}