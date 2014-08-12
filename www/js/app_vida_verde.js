

var ambienteApp = angular.module(
  'ambienteApp',
  ['ngRoute']
);

ambienteApp.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
       'self',
       'https://*.youtube.com/**']);
   });


   ambienteApp.controller('VideosCtrl', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        getVideos(function (videos) {
            for (var i = 0; i < videos.length; i++) {
                console.log(videos[i].url);
                // console.log("algo " + videos[i].url);
                //if (videos[i].url.indexOf("watch?v=") != -1) {
                //    videos[i].url = videos[i].url.replace("watch?v=", "embed/");
                //}
                var th = $scope.thumbnail_youtube(videos[i].url)
                if (th == "") {
                    videos[i].ok = false;
                } else {
                    videos[i].ok = true;
                    videos[i].th = th;
                }
            };
            $scope.videoLista = videos
            $scope.$apply()
            touchScroll('content');
        })

        $scope.video_click = function (url_youtube) {
            console.log("click", url_youtube)
            openLinkInBrow(url_youtube);
            //            $.magnificPopup.open({
            //                items: {
            //                    src: url_youtube,
            //                    type: 'iframe'
            //                },
            //                type: 'iframe',
            //                fixedContentPos: true,
            //                closeOnContentClick: false,
            //                closeBtnInside: false,
            //                iframe: {
            //                    patterns: {
            //                        youtube: {
            //                            src: 'https://www.youtube.com/embed/%id%?autoplay=1'
            //                        }
            //                    }
            //                }
            //            });
        }

        $scope.thumbnail_youtube = function (youtube_url) {
            var video_id = "";
            var thumbnail_url = "";
            try {
                video_id = youtube_url.split('v=')[1];
                var ampersandPosition = video_id.indexOf('&');
                if (ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }
                thumbnail_url = "http://img.youtube.com/vi/" + video_id + "/0.jpg";
                return thumbnail_url;
            } catch (err) {
                return "";
            }
        }
    }
])

ambienteApp.config( ['$routeProvider', '$locationProvider',
  function( $routeProvider, $locationProvider ) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/vida-verde.html',
        controller: 'VideosCtrl'
      }).
      
      otherwise({
        redirectTo: '/'
      });

}]);




///////////////////////////////// CONSULTAS AL JSON CONTENEDOR DE DATOS

function getVideos( success ){
    $.getJSON(
        'http://servicedatosabiertoscolombia.cloudapp.net/v1/Ministerio_de_Ambiente/vidaverde?$format=json',
        function(data, textStatus, jqXHR){
            success(data.d)
        })
    }

    function openLinkInBrow(url) {
        
        window.open(encodeURI(url), '_system');
       
    }