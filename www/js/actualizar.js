function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS registro (nombre, id)');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración de base de datos exitosa")
    }

    var db = window.openDatabase("bd_redposconsumo", "1.0", "Registro", 200000);
    db.transaction(execute, error, exito);

}

function consultarRegistro() {
    var db = window.openDatabase("bd_redposconsumo", "1.0", "Consultar registro", 200000);
    db.transaction(consultarExisteRegistro, errorOperacionConsulta, efectuadaOperacionConsulta);
}

function consultarExisteRegistro(tx) {
    tx.executeSql('SELECT * FROM registro', [], crearVariableRegistro, function (error) {
        console.log("consulta nombre fin error: " + error)
    });
}

function crearVariableRegistro(tx, results) {
    var len = results.rows.length;
    var nom = "";
    if (len > 0) {
        if(results.rows.item(0).nombre != ""){
            nom = results.rows.item(0).nombre;
            $("#txtRegistro").val(nom);
        }
        else{
            $("#txtRegistro").val("");
        }
    }
    else{
            $("#txtRegistro").val("");
    }
}

function errorOperacionConsulta(err) {
    console.log(err);
    alert("Error procesando la consulta de nombre en actualizar: " + err);
}

function efectuadaOperacionConsulta() {
    console.log("Información consultada en actualizar!");
}

function GuardarNom() {
    var db = window.openDatabase("bd_redposconsumo", "1.0", "Guardar nombre", 200000);
    db.transaction(GuardarRegistro, errorOperacionGuardar, efectuadaOperacionGuardar);
}

function GuardarRegistro(tx) {
    var valor = $("#txtRegistro").val();
    if(valor != ""){
            localStorage.setItem("NombreRegistro", valor);
            tx.executeSql("UPDATE registro SET nombre = '"+valor+"' WHERE id = '1'", [], redireccionar, function (error) {
            console.log("Actualizar nombre error: " + error)
        });
    }else{
        $("#alertaRegistro").css("display", "block");
    }
}

function errorOperacionGuardar(err) {
    console.log("Error actualizando el registro : " + err);
}

function efectuadaOperacionGuardar() {
    console.log("Información actualizada!");
}

function redireccionarIndex() {
    window.location.href = "index.html";
}

function MasTarde() {
    redireccionarIndex();
}

function redireccionar(tx, results) {
    redireccionarIndex();
}

function limpiar() {
    $("#txtRegistro").val("");
}