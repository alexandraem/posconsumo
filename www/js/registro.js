function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS registro (nombre, id)');
        //tx.executeSql("INSERT INTO favoritos (fecha_ingreso, convocatoria, fecha_fin) "+
        //     "SELECT '2013-10-03', 'ABCconvocatoria', '2013-10-10' WHERE NOT EXISTS (SELECT * FROM favoritos WHERE convocatoria = 'ABCconvocatoria')");
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


//Si la consulta retorna un registro cualquiera
//pone en la variable local ese valor (puede ser un nombre o "Agregar nombre")
//Sino no redirecciona a ningún lado y muestra la pantalla de registro
function crearVariableRegistro(tx, results) {
    var len = results.rows.length;
    var nom = "";
    if (len > 0) {
        if(results.rows.item(0).nombre != ""){
            nom = results.rows.item(0).nombre;
        }
        localStorage.setItem("NombreRegistro", nom);
        redireccionarIndex();
    }
}

function errorOperacionConsulta(err) {
    console.log(err);
    alert("Error procesando la consulta de nombre : " + err);
}

function efectuadaOperacionConsulta() {
    console.log("Información consultada!");
}

function GuardarNom() {
    var db = window.openDatabase("bd_redposconsumo", "1.0", "Guardar nombre", 200000);
    db.transaction(GuardarRegistro, errorOperacionGuardar, efectuadaOperacionGuardar);
}

function GuardarRegistro(tx) {
    var valor = $("#txtRegistro").val();
    if(valor != ""){
        localStorage.setItem("NombreRegistro", valor);
         tx.executeSql('INSERT INTO registro (nombre, id) VALUES ("'+valor+'", "1")', [], redireccionar, function (error) {
            console.log("Guardar nombre error: " + error)
        });
    }else{
        $("#alertaRegistro").css("display", "block");
    }
}

function errorOperacionGuardar(err) {
    console.log("Error realizando el registro : " + err);
}

function efectuadaOperacionGuardar() {
    console.log("Información registrada!");
}

function redireccionarIndex() {
    window.location.href = "index.html";
}

function MasTarde() {
    var db = window.openDatabase("bd_redposconsumo", "1.0", "Guardar mas tarde", 200000);
    db.transaction(GuardarMasTarde, errorOperacionGuardar, efectuadaOperacionGuardar);
}

function GuardarMasTarde(tx) {
    localStorage.setItem("NombreRegistro", "Agregar nombre");
    tx.executeSql('INSERT INTO registro (nombre, id) VALUES ("Agregar nombre", "1")', [], redireccionar, function (error) {
        console.log("Guardar Agregar nombre error: " + error)
    });
}

function redireccionar(tx, results) {
    redireccionarIndex();
}