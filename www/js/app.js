/**

    Con éste script disparamos los eventos necesarios cuando la aplicación
    es lanzada para determinar cuando está lista para ser manejada.

    Como funciona?

    Primero verifica que el dispositivo esté listo para ser accedido por la api
    luego verifica la conexión a internet. Si no tiene acceso agrega la clase
    al body "no-internet". De lo contrario no usa ésta clase y deja el body limpio.

    Se pueden hacer selectores para que aparezca un mensaje en alguna opción que
    necesite acceso a internet para funcionar correctamente.

*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onChangeConnection, false);
        document.addEventListener('online', this.onChangeConnection, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    //
    onChangeConnection: function(){
    	if( app.checkConnection() ){
    		$("body").removeClass("no-internet")
            app.with_internet = true
    	} else {
    		$("body").addClass("no-internet")
            app.with_internet = false
    	}
    },
    // Devuelve si hay o no conexión a internet
    checkConnection: function() {
	    console.log("checkConnection: Comprobando conectividad a internet!");
	    var networkState = navigator.connection.type;
	    if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
	      console.log("checkConnection: No hay internet!");
	      return false;
	    } else {
	      console.log("checkConnection: Si hay internet!");
	      return true;
	    }
	},
};




function openLinkInBrowser(url){
    if (navigator!=undefined && navigator.app!=undefined && navigator.app.loadUrl !=undefined) {
        navigator.app.loadUrl( url,  { openExternal: true });
    } else {
        window.open(url, "_system");
    }
}