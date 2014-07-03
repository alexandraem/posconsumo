
var geocoder;
var directionsService;
var directionsDisplay;
var mi_posicion;
var DptDelSelect ="";
var mncDelSelect ="";
var pin_persona= 'img/marker/persona.png';
var markerPersona = null;

/////////////////


//Angular App Module and Controller
angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope) {

    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(4.598291, -74.076119),
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROAD_MAP
    }

    $scope.bound = new google.maps.LatLngBounds()

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});
    directionsDisplay.setMap($scope.map);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        info.latitud = parseFloat(info.latitud);
        info.longitud = parseFloat(info.longitud);

////OJO Set de datos malo... valores que deben ser negativos estan positivos ejempleo (6.262061, 75.59186799999998)
        
        if(info.longitud  > 0){
            info.longitud = info.longitud * -1;

        }
        var point = new google.maps.LatLng(info.latitud , info.longitud)
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: point,
            title: info.vocero
        });
        marker.content = '<div class="infoWindowContent">' + info.direccion + '<div class="infoWindowButton"><button class="button button-green btnLlegar" onclick="mostrar_ruta()">&iquest;C&oacute;mo llegar?</button></div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2 class="h2Mapa">' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
            window.info_punto_clickeado = info
        });
        //console.log("po= "+marker.position);
                
        $scope.bound.extend(point);
        $scope.markers.push(marker);
    }  
    
    $scope.listadoLugares = function(){
            var CodDpto = sessionStorage.getItem("dpSelect");
            var CodMnpio = sessionStorage.getItem("mnSelect");
            var ct = sessionStorage.getItem("ctSelect");
           
            $.getJSON(
                "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/puntosposconsumo?$filter=codigodepto%20EQ%20'" + CodDpto + "'%20and%20codigomunicipio%20EQ%20'" + CodMnpio + "'%20and%20categoria%20EQ%20'" + ct.toUpperCase() + "'&$format=json",
                function(data, textStatus, jqXHR){
                    //  console.log(data)
                    var lugares = []
                    for (var i = 0; i < data.d.length; i++) {
                            lugares.push(data.d[i])
                    }
                        $scope.puntos = lugares;

                      //  var pruebas = [
                       // { "PartitionKey": "592A1F2A-7C5E-4537-9BB0-160C6D874900", "RowKey": "CBB62211-9778-4F74-B9B2-5E010D2EF09D", "nid": "3", "vocero": "INCOLMOTOS YAMAHA S.A", "categoria": "BUPA", "subcategoria": "MOTOCICLETAS", "email": "", "codigodepto": "17", "departamento": "CALDAS", "codigomunicipio": "17001", "municipio": "MANIZALES", "direccion": "Carrera  6 No 18 - 06  Av Circunvalar B/ Colon", "latitud": "5.067747", "longitud": "-75.517154" }, { "PartitionKey": "0DEF2E79-37E4-4053-8059-2B0314F245CC", "RowKey": "F50A2A1E-D14A-4C44-AD33-61C4E041E14A", "nid": "4", "vocero": "INCOLMOTOS YAMAHA S.A", "categoria": "BUPA", "subcategoria": "MOTOCICLETAS", "email": "", "codigodepto": "17", "departamento": "CALDAS", "codigomunicipio": "17001", "municipio": "MANIZALES", "direccion": "Calle 47 No  3 - 51", "latitud": "5.068027", "longitud": "-75.520172" }
                        //  ];
                        // $scope.puntos = pruebas;
        
                      $scope.$digest()
    
                    if($scope.puntos.length > 0){
						DptDelSelect = $scope.puntos[1].departamento;
						mncDelSelect = $scope.puntos[1].municipio;
                         for (i = 0; i <$scope.puntos.length; i++){
                            createMarker($scope.puntos[i]);
                        }

                        $scope.map.fitBounds($scope.bound);
                    }
                })
    }
    $scope.listadoLugares();
});



function mostrar_ruta(){

    obtener_mi_posicion(function (info_yo) {

        var info_punto = window.info_punto_clickeado
        var start = new google.maps.LatLng(info_yo.lat, info_yo.lon)
        var end = new google.maps.LatLng(info_punto.latitud, info_punto.longitud)
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        };

        mostrarCargando("Trazando la ruta")
        directionsService.route(request, function (response, status) {
            ocultarCargando();
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else if (status == google.maps.DirectionsStatus.NOT_FOUND || status == google.maps.DirectionsStatus.ZERO_RESULTS) {
                navigator.notification.alert("No fue posible calcular la ruta hasta ese destino.", function () { }, "Lo sentimos", "Aceptar");
            } else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT || status == google.maps.DirectionsStatus.REQUEST_DENIED) {
                navigator.notification.alert("Ésta funcionalidad no es posible usarla por el momento. Intente más tarde.", function () { }, "Lo sentimos", "Aceptar");
            } else {
                navigator.notification.alert("No es posible calcular la ruta hasta ese destino.", function () { }, "Lo sentimos", "Aceptar");
            }
        });

    })
}



function obtener_mi_posicion(funcion) {
    
	geocoder = new google.maps.Geocoder();
    //$("#debug").append("<br> Despues del geocoder")

	mostrarCargando("Geolocalizando mi posici&oacute;n");
	navigator.geolocation.getCurrentPosition(function (position) {
	    ocultarCargando();
	    var scope = angular.element(document.getElementById('content-map')).scope();
	    var lat = position.coords.latitude
	    var lon = position.coords.longitude

	    // $("#debug").append("<br> Responde obtener_mi_posicion")

	    var point = new google.maps.LatLng(lat, lon)

	    mostrarCargando("Obteniendo mi ciudad");
	    geocoder.geocode({ 'latLng': point }, function (results, status) {
	        // $("#debug").append("<br> Geocoder responde")
	        ocultarCargando();
	        if (status == google.maps.GeocoderStatus.OK) {
	            try {
	                mostrarCargando("Ciudad obtenida");
	                var Mi_ciudad = results[results.length - 3].address_components[0].long_name
	                var Mi_departamento = results[results.length - 3].address_components[1].long_name

	                if (Mi_ciudad.toUpperCase() == 'BOGOTÁ') {
	                    Mi_departamento = 'BOGOTÁ D.C.'
	                    Mi_ciudad = 'BOGOTÁ D.C.'
	                }

	                ////////////////////////////////if solo para pruebas///////////////////////////////////////////////////////////////
	                //						if(Mi_departamento.toUpperCase() == "CALDAS" && Mi_ciudad.toUpperCase() == "MANIZALES"){
	                //							//ubicarme();
	                //							
	                //							if(scope.map != null){
	                //									console.log("en ubicarme");
	                //								if(lat != null && lon != null){
	                //									console.log("lat scope: "+lat);
	                //									var point = new google.maps.LatLng(lat, lon)
	                //									var marker = new google.maps.Marker({
	                //										position: point,
	                //										title:"Yo!",
	                //										icon: pin_persona
	                //									});
	                //									
	                //									if(markerPersona != null){
	                //										markerPersona.setMap(null)
	                //									}
	                //									markerPersona = marker
	                //									marker.setMap( scope.map )
	                //									scope.map.setCenter( point )

	                //                                    if(funcion!=undefined){
	                //                                        console.log( "comenzar a mostra la ruta" )
	                //                                        funcion( {"lat": lat, "lon": lon} )
	                //                                    }

	                //								}else{
	                //									navigator.notification.alert("No fue posible ubicar su posici�n", function(){}, "Error", "Aceptar");
	                //								}
	                //							}else{
	                //								navigator.notification.alert("El mapa no se carg� no se puede ubicar mi posici�n", function(){}, "Error", "Aceptar");
	                //							}
	                //						}////////////////////////////////////////////////
	                //                        else 
	                // navigator.notification.alert("Va a comparar la ciudades", function () { }, "Pruebas", "Aceptar");
	                if (Mi_departamento.toUpperCase() != DptDelSelect.toUpperCase() || Mi_ciudad.toUpperCase() != mncDelSelect.toUpperCase()) {
	                    ocultarCargando();
	                    navigator.notification.alert("No es posible trazar una ruta porque usted no fue localizado en el mismo municipio del punto seleccionado. Ubicado en " + Mi_ciudad, function () { }, "Otro municipio", "Aceptar");
	                }
	                else {
	                    if (scope.map != null) {
	                        if (lat != null && lon != null) {
	                            //console.log("lat scope: " + lat);
	                            var point = new google.maps.LatLng(lat, lon)
	                            var marker = new google.maps.Marker({
	                                position: point,
	                                title: "Yo!",
	                                icon: pin_persona
	                            });

	                            if (markerPersona != null) {
	                                markerPersona.setMap(null)
	                            }
	                            markerPersona = marker
	                            marker.setMap(scope.map)
	                            scope.map.setCenter(point)

	                            ocultarCargando();
	                            if (funcion != undefined) {
	                                funcion({ "lat": lat, "lon": lon })
	                            }


	                        } else {
	                            ocultarCargando();
	                            navigator.notification.alert("No fue posible ubicar su posición", function () { }, "Error", "Aceptar");
	                        }
	                    } else {
	                        ocultarCargando();
	                        navigator.notification.alert("El mapa no se cargó correctamente. No fue posible localizar su posición.", function () { }, "Error", "Aceptar");
	                    }
	                }
	            } catch (e) {
	                ocultarCargando();
	                navigator.notification.alert("No pudimos localizar su ciudad.", function () { }, "Sin localización", "Aceptar");
	            }
	        } else {
	            ocultarCargando();
	            navigator.notification.alert("No pudimos localizar su ciudad.", function () { }, "Sin localización", "Aceptar");
	        }
	    });
	},
        function (error) {
            ocultarCargando();
            //$("#debug").append("geolocalizando: error");
            //navigator.notification.alert("OMP: " + error.message, function () { }, "C: " + error.code, "Aceptar");
            if (error.code == error.POSITION_UNAVAILABLE) {
                navigator.notification.alert("No fue posible geolocalizar su posición.", function () { }, "Lo sentimos", "Aceptar");

            } else if (error.code == error.TIMEOUT) {
                navigator.notification.alert("Tiempo de espera agotado. No fue posible localizar su posición.", function () { }, "Lo sentimos", "Aceptar");

            } else if (error.code == error.PERMISSION_DENIED) {
                navigator.notification.alert("No está disponible la localización. Se ha negado el servicio de localización.", function () { }, "Lo sentimos", "Aceptar");

            } else {
                navigator.notification.alert("No está disponible la localización", function () { }, "Lo sentimos", "Aceptar");
            }

            // $.loading('hide')
            //            if (Mi_ciudad == '') {
            //                navigator.notification.alert("Al parecer el GPS no funciona correctamente. No fue posible localizar su  posición.", function () { }, "Lo sentimos", "Aceptar");
            //            }

        },
        { timeout: 30000 });
    }

    function Volver() {
        window.location.href = "_donde.html#/lugares-" + sessionStorage.getItem("ctSelect");
    }