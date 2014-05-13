

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

        $scope.mostrar = function(lugar){
            console.log(lugar);
            $location.path("/lugar-" + lugar.nid)
        }
    }
])

ambienteApp.controller( 'LugaresDetalleCtrl', ['$scope', '$http', '$location', '$routeParams',
    function( $scope, $http, $location, $routeParams ) {
    //    google.maps.visualRefresh = true;
//
    //    $scope.mapa = {
    //        center: {
    //            latitude: 37.0000,
    //            longitude: -122.0000
    //        },
    //        ref: true,
    //        control: {},
    //        zoom: 2
    //    };


       // $scope.refreshMap = function () {
       //     $scope.mapa.control.refresh({latitude: 32.779680, longitude: -79.935493});
       //     console.log("hola")
       //     $scope.mapa.control.getGMap().setZoom(11);
       //     return;
       // };



        getLugar( $routeParams.lugarId , function( lugar ){
            $scope.lugarSel = lugar[0]

            //$scope.mapa.center.latitude = $scope.lugarSel.latitud
            //$scope.mapa.center.longitude = $scope.lugarSel.longitud
            //$scope.refreshMap();
            $scope.$digest()


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


function getLugar( id , success){
    $.getJSON(
        "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/puntosposconsumo?$filter=nid%20EQ%20'"+id+"'&$format=json",
        function(data, textStatus, jqXHR){
            console.log(data);
            // var lugar = data.d
            //var encontrado = false
            // for (var i = 0; i < lugares.length; i++) {
                if ( data.d.length > 0 ){
                    success( data.d )
                   // encontrado = true
                   // break;
                }else{
                    success( {} )
                    console.log("no encontrado")
                }
            //};
            //if(!encontrado){
            //    success( {} )
            //    console.log("no encontrado")
            // }
        })
}


//function getLugaresCategorias( success ){
//    $.getJSON(
//        'data/puntosposconsumobarranquilla.json',
//        function(data, textStatus, jqXHR){
//            var categorias = []
//            for (var i = 0; i < data.d.length; i++) {
//                var nueva = {
//                    nombre: data.d[i].categoria,
//                    id: data.d[i].categoria.replace(/ /g, '_').toLowerCase()
//                }
//                var existe = false;
//                for (var j = 0; j < categorias.length; j++) {
//                    if(categorias[j].id == nueva.id){
//                        existe = true;
//                        break;
//                    }
//                }
//                if(!existe){
//                    categorias.push(nueva)
//                }
//            }
//
//            success(categorias)
//        })
//}

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

//function puntosCiudadCategoria(ciudad, categoria, success ){
//    $.getJSON(
//        'data/puntosposconsumobarranquilla.json',
//        function(data, textStatus, jqXHR){
//            var lugares = []
//            for (var i = 0; i < data.d.length; i++) {
//                var id_cat = data.d[i].categoria.replace(/ /g, '_').toLowerCase()
//                if(id_cat == categoria){
//                    lugares.push(data.d[i])
//                }
//            }
//            success(lugares)
//        })
//}


function Volver() {
    window.location.href = "_donde.html#/categorias";
}