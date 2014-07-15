

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);


ambienteApp.controller( 'CampaniasCtrl', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        getCampanias(function( campanias ){
            $scope.campaniaLista = campanias
            $scope.$apply()
        })

        $scope.mostrar = function(campania){
            $location.path("/" + campania.nid)
        }
    }
])
ambienteApp.controller( 'CampaniaDetalleCtrl', ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {

        getCampania($routeParams.campaniaId, function (campain) {
            mostrarCargando("Cargando información de la campaña")
            $scope.campain = campain
            $scope.campain.informacion = $scope.campain.informacion.replace('y','&');
            $scope.$apply()
            ocultarCargando();
        })
       

        $scope.compartir = function(){
            window.plugins.socialsharing.share('He visto la campaña '+ $scope.campain.nombre +' Visita ', null, null,  $scope.campain.informacion )
        }
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
        "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/campanas?$filter=nid%20EQ%20+" + id + "+&$format=json",
        function(data, textStatus, jqXHR){
            var campanias = data.d
            var encontrado = false
            //console.log(campanias);
            for (var i = 0; i < campanias.length; i++) {
                if ( campanias[i].nid == id ){
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
        'http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/campanas?$format=json',
        function(data, textStatus, jqXHR){
           //console.log(data);
            success(data.d)
        })
    }

    function Volver() {
        window.location.href = "_campanias.html";
    }

    function openLinkInBrow(url) {
//        console.log(url);
//        var newUrl = encodeURI(url)
//        console.log(newUrl);
//        if (navigator != undefined && navigator.app != undefined && navigator.app.loadUrl != undefined) 
//        {
//            navigator.app.loadUrl(newUrl, { openExternal: true });
//        }
//        else
//        {
            window.open(encodeURI(url), '_system');
//        }
    }
