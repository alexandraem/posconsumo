/*
Estos objetos y atributos están dispuestos para la manipulación,
de los mapas usados en la sección FNA Mas Cerca, de la aplicación
FNA En Tu Bolsillo
*/

/*
   Éstas variables globales, son usadas por el mapa
*/
var directionsDisplay;
var geocoder;
var directionsService = new google.maps.DirectionsService();
var info_window = new google.maps.InfoWindow({content: ''});
var markersArray = [];
var markerPersona = null;
var MapaMarkerSelected = null;
/*
    Éste objeto tiene todos los atributos usados para la sección mapas del FNA
*/
var MapaAtributos = {
    //
    //Ciudad donde el usuario está ubicado ó que ha elejido.
    mi_ciudad: '',
    //
    //Ciudad donde el usuario está ubicado
    ciudad: '',
    //
    //Departamento donde el usuario está ubicado
    departamento: '',
    //
    //Objeto que contiene el mapa
    mapa: null,
    //
    // Latitud y longitud de mi posición
    mi_posicion: null,
    //
    //Punto de atencion que tiene seleccionado
    punto_seleccionado: null,
    //
    //Configuración de estilo para el mapa
    estilo_mapa: [
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#ffffff" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#090808" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "visibility": "on" },
              { "color": "#808080" },
              { "weight": 0.8 }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              { "visibility": "on" },
              { "hue": "#ff1a00" },
              { "weight": 2 }
            ]
          },{
            "featureType": "transit.line",
            "stylers": [
              { "visibility": "on" }
            ]
          }],
    //
    //Configuración usada para el mapa
    opciones_mapa: {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(10.980667, -74.802732),
            panControl: false,
            panControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: true,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM,
              style: google.maps.ZoomControlStyle.DEFAULT
            },
            styles: this.estilo_mapa
    }

}



/*
    Éste objeto tiene todas las funciones usadas para la sección mapas del FNA
*/
var MapaObjeto = {
    //
    // inicializador
    inicializar: function(callback) {
        var map           = new google.maps.Map(document.getElementById('map-canvas'), MapaAtributos.opciones_mapa);
        geocoder          = new google.maps.Geocoder();
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});

        directionsDisplay.setMap(map);
        google.maps.visualRefresh = true;
        MapaAtributos.mapa = map

        if(callback!=undefined)
            callback()
    },
    //
    // Obtiene mi posición
    obtener_mi_posicion: function(callback){
        navigator.geolocation.getCurrentPosition( function(position){
            MapaAtributos.mi_posicion = position
            $("#debug").html("<br> Respondio la posicion")
            console.log("respondio")
            var lat = position.coords.latitude
            var lon = position.coords.longitude
            var point = new google.maps.LatLng(lat, lon)
            geocoder.geocode({'latLng': point}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    try{
                        var ciudad       = results[results.length - 3].address_components[0].long_name
                        var departamento = results[results.length - 3].address_components[1].long_name

                    }catch(e){
                        navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localización", "Aceptar");
                    }

                    if(callback!=undefined)
                        callback()

                } else {
                    navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localización", "Aceptar");
                    if(callback!=undefined)
                        callback()

                }
            });
        },
        function( error ){
            //navigator.notification.alert("OMP: " + error.message , "",  "C: " + error.code, "Aceptar");
            if(error.code == PositionError.POSITION_UNAVAILABLE){

              console.log("obtener_mi_posicion: POSITION_UNAVAILABLE")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.TIMEOUT){
              console.log("obtener_mi_posicion: TIMEOUT")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.PERMISSION_DENIED){
              console.log("obtener_mi_posicion: PERMISSION_DENIED")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else{
              console.log("obtener_mi_posicion: OTRO con codigo " + error.code)
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");
            }

        },
        { timeout: 15000 });
    },
    //
    // Si ya tiene mi ubicación centra el mapa en éste punto
    centrarme: function(){
        if(MapaAtributos.mi_posicion != null){
            var punto = new google.maps.LatLng(MapaAtributos.mi_posicion.coords.latitude, MapaAtributos.mi_posicion.coords.longitude)
            MapaAtributos.mapa.setCenter(punto)
        }else{
            this.ubicarme(function(){})
        }
    },
    //
    // Ubicar mi posición en el mapa
    ubicarme: function(callback){
        if(MapaAtributos.mapa != null){

            if( MapaAtributos.mi_posicion != null ){
                var position = MapaAtributos.mi_posicion
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                var point = new google.maps.LatLng(lat, lon)
                var marker = new google.maps.Marker({
                    position: point,
                    title:"Yo!"
                });

                if(markerPersona != null){
                    markerPersona.setMap(null)
                }

                markerPersona = marker

                marker.setMap(MapaAtributos.mapa)
                MapaAtributos.mapa.setCenter(point)

                if(callback != undefined)
                    callback()
            }else{
                MapaObjeto.obtener_mi_posicion(function(){
                    MapaObjeto.ubicarme(callback)
                })
            }
        }else{
            navigator.notification.alert("El mapa no se cargó no se puede ubicar mi posición", function(){}, "Error", "Aceptar");
        }
    },
    // Cargar los puntos que retorna el setdatos
    cargar_todos_puntos: function(por_ciudad, callback){
        MapaAtributos.mapa.setZoom(5);

        var lat = 10.980667
        var log = -74.802732
        var point = new google.maps.LatLng(lat, log)
        var marker = new google.maps.Marker({
                                position: point,
                                title: "",
                                map: MapaAtributos.mapa,
                                clickable: true
                            });

        callback()
        //MapaObjeto.mostrar_ruta(lat, log)
    },

    //
    // Carga la ruta desde mi punto de ubicacion hasta el punto fna o recaudo señalado
    mostrar_ruta: function(lat, lon){
        MapaAtributos.mi_posicion = new google.maps.LatLng(10.985217, -74.812174)

        //if( MapaAtributos.mi_posicion != null ){
            var position = MapaAtributos.mi_posicion
            var start = new google.maps.LatLng(10.985217, -74.812174)
            var end = new google.maps.LatLng(lat, lon)

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
              }else if(status == google.maps.DirectionsStatus.NOT_FOUND || status == google.maps.DirectionsStatus.ZERO_RESULTS ){
                navigator.notification.alert("No es posible calcular ruta hasta ese destino.", function(){}, "Lo sentimos", "Aceptar");
              }else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT || status == google.maps.DirectionsStatus.REQUEST_DENIED ){
                navigator.notification.alert("Ésta funcionalidad no es posible usarla por el momento. Intente más tarde.", function(){}, "Lo sentimos", "Aceptar");
              }else{
                navigator.notification.alert("No es posible calcular ruta hasta ese destino.", function(){}, "Lo sentimos", "Aceptar");
              }
            });
        /*}else{
            navigator.notification.alert("Debe estar en su ciudad por ubicación satelital, para poder usar esta función", function(){}, "Atención", "Aceptar");
        }*/
    },
    //
    // dispara el evento de redimensionar la pantalla
    resize_trigger: function(){

        google.maps.event.trigger( MapaAtributos.mapa, 'resize');
    }
}





var Contenido = {
    // Carga el contenido de los mapas, consultando inicialmente la posición del
    // usuario
    cargar: function(){
                MapaObjeto.inicializar( function(){
                    //MapaObjeto.ubicarme( function(){
                        MapaObjeto.cargar_todos_puntos( true, function(){
                            MapaObjeto.resize_trigger()
                            //MapaObjeto.centrarme()
                            console.log("aasd")
                        })
                    //})
                })
    },
}



  google.maps.event.addDomListener(window, 'load', function(){
      console.log("Google loaded.")
      Contenido.cargar()
  });