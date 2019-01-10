firebase.initializeApp({
    apiKey: "AIzaSyBypcVi840fHj01LjqjIGVMgZFMtWaIQ5I",
    authDomain: "crudfirebase-9c4af.firebaseapp.com",
    projectId: "crudfirebase-9c4af"
  });
  
  // Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();

    var editPelicula = new Array();
    var editGenero = new Array();
    var editEstado = new Array();

    var eleccion = false;
    var datosEditFila = "";
    var datosEditId = "";

  getPeliculas();


function guardaPeliculas(){

    if(eleccion == false){
        var pelicula = document.getElementById("pelicula").value;
        var genero = document.getElementById("genero").value;
        var checkbox = document.getElementById("Check1").checked;

        // agregar a la base de datos de Cloud Firestore through Firebase
        db.collection("peliculas").add({
            Titulo: pelicula,
            Genero: genero,
            Nuevo: checkbox
            })
            .then(function(docRef) {
                alert("Se a Registrado su pelicula");
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                alert("No se pudo gegistrar su pelicula");
                console.error("Error adding document: ", error);
        });
    }
    else
    {
        editPeli(datosEditId,datosEditFila);
    }
    
}

function getPeliculas(){

    var tabla = document.getElementById("cuerpoTabla");

    db.collection("peliculas").onSnapshot((querySnapshot) => {

        var coleccionPeli = new Array();
        var coleccionGenero = new Array();
        var coleccionEstado = new Array();
        var coleccionId = new Array();
        var i = 0;
        
        querySnapshot.forEach((doc) => {
            tabla.innerHTML = "";
            console.log(`${doc.id} => ${doc.data().Titulo}`);

            coleccionPeli[i] = doc.data().Titulo;
            coleccionGenero[i] = doc.data().Genero;
            coleccionEstado[i] = doc.data().Nuevo;
            coleccionId[i] = doc.id;
            i++;
            
        });

        for(var j=0; j<coleccionEstado.length; j++){

            editPelicula[j] = coleccionPeli[j];
            editGenero[j] = coleccionGenero[j];
            editEstado[j] = coleccionEstado[j];

            tabla.innerHTML += `
                            <tr>
                                <th scope="row">${j}</th>
                                <td>${coleccionPeli[j]}</td>
                                <td>${coleccionGenero[j]}</td>
                                <td>${coleccionEstado[j]}</td>
                                <td><input type="button" class="btn btn-success" value="Editar" onclick="ingresaDatosEdit('${coleccionId[j]}', ${j})" /></td>
                                <td><input type="button" class="btn btn-danger" value="Eliminar" onclick="borrarPeli('${coleccionId[j]}')" /></td>
                            </tr>
    
                             `;
        }

    });


}

function ingresaDatosEdit(id, fila){

    document.getElementById("pelicula").value = editPelicula[fila];
    document.getElementById("genero").value = editGenero[fila];
    document.getElementById("Check1").checked = editEstado[fila];

    datosEditId = id;
    datosEditFila = fila;
    eleccion = true;
}

function editPeli(id,fila){

    db.collection("peliculas").doc(id).set({
        Titulo: document.getElementById("pelicula").value,
        Genero: document.getElementById("genero").value,
        Nuevo: document.getElementById("Check1").checked
    })
    .then(function() {
        console.log("Document successfully written se edito!" + document.getElementById("pelicula").value + " " + document.getElementById("genero").value + " " + document.getElementById("Check1").checked);
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

}

function borrarPeli(id){

    console.log(id);
    db.collection("peliculas").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
        alert("Se elimino de la base de datos con exito!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}