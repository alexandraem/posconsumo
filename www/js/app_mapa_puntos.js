
var geocoder;
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
        marker.content = '<div class="infoWindowContent">' + info.direccion + '<div class="infoWindowButton"><button class="button button-green btnLlegar" onclick="obtener_mi_posicion()">&iquest;C&oacute;mo llegar?</button></div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2 class="h2Mapa">' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        //console.log("po= "+marker.position);
                
        $scope.bound.extend(point);
        $scope.markers.push(marker);
    }  
    
    $scope.listadoLugares = function(){
            
            var CodDpto = sessionStorage.getItem("dpSelect");
            var CodMnpio = sessionStorage.getItem("mnSelect");
            var ct = sessionStorage.getItem("ctSelect");
            console.log("categoria =" + ct)
            $.getJSON(
                "http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/puntosposconsumo?$filter=codigodepto%20EQ%20'"+CodDpto+"'%20and%20codigomunicipio%20EQ%20'"+CodMnpio+"'%20and%20categoria%20EQ%20'"+ct+"'&$format=json",
                function(data, textStatus, jqXHR){
                  //  console.log(data)
                    var lugares = []
                    for (var i = 0; i < data.d.length; i++) {
                            lugares.push(data.d[i])
                    }
                    $scope.puntos = lugares; 
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

function obtener_mi_posicion(){
	geocoder = new google.maps.Geocoder();
		
	navigator.geolocation.getCurrentPosition( function(position){
			
			var scope = angular.element(document.getElementById('content-map')).scope();
			var lat = position.coords.latitude
            var lon = position.coords.longitude
			
			console.log("lat "+lat + " lon "+lon);
			
            var point = new google.maps.LatLng(lat, lon)
            geocoder.geocode({'latLng': point}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    try{
					
					    var Mi_ciudad = results[results.length - 3].address_components[0].long_name
                        var Mi_departamento = results[results.length - 3].address_components[1].long_name
											
						if(Mi_ciudad.toUpperCase() == 'BOGOT�'){
							Mi_departamento = "BOGOT� D.C"
							Mi_ciudad = 'BOGOT� D.C'
                        }					
						
						////////////////////////////////if solo para pruebas///////////////////////////////////////////////////////////////
						if(Mi_departamento.toUpperCase() == "CALDAS" && Mi_ciudad.toUpperCase() == "MANIZALES"){
							//ubicarme();
							
							if(scope.map != null){
									console.log("en ubicarme");
								if(lat != null && lon != null){
									console.log("lat scope: "+lat);
									var point = new google.maps.LatLng(lat, lon)
									var marker = new google.maps.Marker({
										position: point,
										title:"Yo!",
										icon: pin_persona
									});
									
									if(markerPersona != null){
										markerPersona.setMap(null)
									}
									markerPersona = marker
									marker.setMap(scope.map)
									scope.map.setCenter(point)
								}else{
									navigator.notification.alert("No fue posible ubicar su posici�n", function(){}, "Error", "Aceptar");
								}
							}else{
								navigator.notification.alert("El mapa no se carg� no se puede ubicar mi posici�n", function(){}, "Error", "Aceptar");
							}
						}////////////////////////////////////////////////
						else if (Mi_departamento.toUpperCase() != DptDelSelect.toUpperCase()  ||  Mi_ciudad.toUpperCase() != mncDelSelect.toUpperCase()){
							navigator.notification.alert("No es posible trazar una ruta porque usted no fue localizado en el mismo municipio del punto seleccionado.", function(){}, "Otro municipio", "Aceptar");
						}
						else{
							if(scope.map != null){
									console.log("en ubicarme");
								if(lat != null && lon != null){
									console.log("lat scope: "+lat);
									var point = new google.maps.LatLng(lat, lon)
									var marker = new google.maps.Marker({
										position: point,
										title:"Yo!",
										icon: pin_persona
									});
									
									if(markerPersona != null){
										markerPersona.setMap(null)
									}
									markerPersona = marker
									marker.setMap(scope.map)
									scope.map.setCenter(point)
								}else{
									navigator.notification.alert("No fue posible ubicar su posici�n", function(){}, "Error", "Aceptar");
								}
							}else{
								navigator.notification.alert("El mapa no se carg� no se puede ubicar mi posici�n", function(){}, "Error", "Aceptar");
							}
						}
					}catch(e){
					console.log("entr� al catch");
                        navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localizaci�n", "Aceptar");
                    }
                } else {
				console.log("entr� al else");
                    navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localizaci�n", "Aceptar");
                }
            });
        },
        function( error ){
		console.log("Entr� al error");
            //navigator.notification.alert("OMP: " + error.message , "",  "C: " + error.code, "Aceptar");
            if(error.code == PositionError.POSITION_UNAVAILABLE){

              console.log("obtener_mi_posicion: POSITION_UNAVAILABLE")
              navigator.notification.alert("No est� disponible la localizaci�n", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.TIMEOUT){
              console.log("obtener_mi_posicion: TIMEOUT")
              navigator.notification.alert("No est� disponible la localizaci�n", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.PERMISSION_DENIED){
              console.log("obtener_mi_posicion: PERMISSION_DENIED")
              navigator.notification.alert("No est� disponible la localizaci�n", function(){}, "Lo sentimos", "Aceptar");

            }else{
              console.log("obtener_mi_posicion: OTRO con codigo " + error.code)
              navigator.notification.alert("No est� disponible la localizaci�n", function(){}, "Lo sentimos", "Aceptar");
            }

           // $.loading('hide')
            if(Mi_ciudad == ''){
				navigator.notification.alert("Al parecer el GPS no funciona correctamente", function(){}, "Lo sentimos", "Aceptar");
			}
                
        },
        { timeout: 15000 });
    }

	