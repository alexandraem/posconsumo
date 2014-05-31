/*

adb logcat | grep 'Web Console'

*/

var Connection = {
    NONE: 'no',
    TIENE: 'tiene'
}
navigator.connection = {}
navigator.connection.type = Connection.TIENE
navigator.notification = {}
navigator.notification.alert = function(mensaje, callback, titulo, boton){
    alert(mensaje)
    if(callback!="")
        callback()
}

navigator.notification.confirm = function(message, confirmCallback, title, buttonLabels){
    var r = window.confirm(message)
    if (r){
        if(confirmCallback!="")
            confirmCallback()
    }
}



PositionError = {}