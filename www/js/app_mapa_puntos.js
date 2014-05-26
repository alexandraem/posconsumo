
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
        marker.content = '<div class="infoWindowContent">' + info.direccion + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2 class="h2Mapa">' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        console.log("po= "+marker.position);
        
        
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
                    console.log(data)
                    var lugares = []
                    for (var i = 0; i < data.d.length; i++) {
                            lugares.push(data.d[i])
                    }
                    $scope.puntos = lugares; 
                    console.log($scope.puntos);
                    $scope.$digest()

                    if($scope.puntos.length > 0){
                         for (i = 0; i <$scope.puntos.length; i++){
                            createMarker($scope.puntos[i]);
                        }

                        $scope.map.fitBounds($scope.bound);
                    }
                })
        }

         $scope.listadoLugares();
});


