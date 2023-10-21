const u = document.getElementById('u').value;
var iborrarPublicacion;

// publicacion modal
function mostrarImagen(id) {
    var modal = document.getElementById("contenedor-modal");
    var img = document.getElementById("imagen-modal");

    fetch("publicacion/modalPublicacion/" + id)
        .then(response => response.json())
        .then(data => {

            img.src = data.imagen;
            modal.style.display = "block";
        })
        .catch(error => {
            console.log(error);
        });

    var cerrarModal = document.getElementById("cerrar");

    cerrarModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
}

async function mostraImagenesLogueado(id) {

    var modal = document.getElementById("contenedor-modal");

    var u = document.getElementById('u').value;

    var cerrarModal = document.getElementById('cerrar');
    cerrarModal.addEventListener("click", function () {
        modal.style.display = "none";
    })

    await fetch('publicacion/modalPublicacionlogueado/' + id)
        .then(response => response.json())
        .then(async data => {

            //traer los elementos con los que voy a atrabajar
            //primer columna 
            var img_usuario = document.getElementById('img-usuario');
            var username = document.getElementById('username')
            var img = document.getElementById("imagen-modal");
            //segunda columna
            //datosPublicacion
            var titulo = document.getElementById("titulo-publicacion")
            var tamaño = document.getElementById("tamaño-publicacion")
            var fecha = document.getElementById("fecha-publicacion")
            var derechos = document.getElementById("derechos-publicacion")
            var categoria = document.getElementById("categoria-publicacion")
            var estado = document.getElementById("estado-publicacion")
            //valoraciones
            var valoraciones = document.getElementById("valoraciones")
            var n = document.getElementById('n')
            //primer columna
            img_usuario.src = data.usuario.fotoRuta
            username.innerHTML = data.usuario.username
            img.src = data.imagen;
            //segunda columna
            titulo.innerHTML = "Titulo: " + data.titulo
            tamaño.innerHTML = "Tamaño: " + data.resolucion
            fecha.innerHTML = data.fecha_creacion
            derechos.innerHTML = "Derechos: " + data.derechos.descripcion
            categoria.innerHTML = "Categoria: " + data.categoria.descripcion


            valoraciones.innerHTML = "Promedio: " + data.promedio

            if (data.estado == 0) {
                data.estado = "publico"
                estado.innerHTML = "Estado: " + data.estado
            } else {
                data.estado = "privado"
                estado.innerHTML = "Estado: " + data.estado
            }

            n.value = data.id_publicacion;

            if (data.id_usuario == u) {
                if (iborrarPublicacion == null) {
                    iborrarPublicacion = document.createElement('i');
                    iborrarPublicacion.className = 'fas fa-trash';
                    iborrarPublicacion.style.color = 'white';
                    iborrarPublicacion.style.margin = '5px';
                    modal.appendChild(iborrarPublicacion);
                    iborrarPublicacion.addEventListener('click', async function () {
                        fetch('/publicacion/borrarPublicacion/' + data.id_publicacion, {
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        });

                        //await actualizarVistaPrincipal(u);
                        await mostrarFotosPaginadas();
                        modal.style.display = 'none';
                    });
                }
            }
            modal.style.display = "block";
        })
        .catch(error => {
            console.log(error);
        });


}


async function valorar(valor) {
    var n = document.getElementById('n');
    var id_publicacion = n.value;
    var u = document.getElementById('u').value;
    var estrellas = document.querySelectorAll(".estrella");

    estrellas.forEach((estrella, index) => {
        estrella.addEventListener("click", () => {
            for (let i = 0; i <= index; i++) {
                estrellas[i].classList.add('clickeado');
            }
            for (let i = index + 1; i < estrellas.length; i++) {
                estrellas[i].classList.remove('clickeado');
            }
        });
    });

    try {
        console.log("Valor: " + valor);


        const response = await fetch(`valoraciones/valorar/${id_publicacion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valor
            })
        }).then(response => response.json()).then(data => {

            if (data != null) {
                var promedio_miniatura = document.getElementById('promedio_miniatura');
                var mensajeExito = document.getElementById("mensaje-exito");
                mensajeExito.style.display = "block";

                mostraImagenesLogueado(id_publicacion);
                promedio_miniatura.innerHTML = data.promedio;
                setTimeout(function () {
                    mensajeExito.style.display = "none";
                }, 2000);

            }
        });

    } catch (error) {
        console.log(error);
    }
    await actualizarVistaPrincipal(u)
}

async function comentar() {
    var comentario = document.getElementById("comentario").value;
    var comentarioInput = document.getElementById("comentario");
    var id_publicacion = document.getElementById('n').value;
    try {
        const response = await fetch(`/comentario/agregarComentario/${id_publicacion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comentario
            })
        })
    } catch (error) {
        console.log(error);
    }
    comentarioInput.value = "";
    var comentarios = await getComentarios(id_publicacion);
    actualizarVistaComentarios(comentarios);
}

async function abrirComentarios() {
    var acordion_comentario_content = document.getElementById('acordion_comentario_content');
    var abrir = document.getElementById('abrir');
    var id_publicacion = document.getElementById('n').value;

    if (abrir.className != "fas fa-plus") {
        acordion_comentario_content.style.display = "none";
        abrir.className = "fas fa-plus";
    } else {
        acordion_comentario_content.style.display = "block";
        abrir.className = "fas fa-minus";
        abrir.value = "-";
        var comentarios = await getComentarios(id_publicacion);
        actualizarVistaComentarios(comentarios);
    }
}

function actualizarVistaComentarios(comentarios) {

    var contenedorComentarios = document.getElementById("contenedor-comentarios");
    contenedorComentarios.innerHTML = '';
    // Itera sobre los comentarios y agrega elementos a la vista
    if (comentarios != null) {
        comentarios.forEach(comentario => {
            console.log("Comentario: " + JSON.stringify(comentario))
            var comentarioUsuarioImg = document.createElement('img');
            comentarioUsuarioImg.src = comentario.usuario.fotoRuta;

            var comentarioUsername = document.createElement('p');
            comentarioUsername.textContent = comentario.usuario.username;

            var comentarioTexto = document.createElement('p');
            comentarioTexto.textContent = comentario.texto;

            var comentarioContainer = document.createElement('div');

            comentarioContainer.className = 'comentarioContainer';
            comentarioTexto.className = 'comentarioTexto';
            comentarioUsername.className = 'comentarioUsername';
            comentarioUsuarioImg.className = 'comentarioUsuarioImg';

            comentarioContainer.appendChild(comentarioUsuarioImg);
            comentarioContainer.appendChild(comentarioUsername);
            comentarioContainer.appendChild(comentarioTexto);

            if (comentario.usuario.id == u) {
                var botonEliminar = document.createElement('button');
                botonEliminar.className = 'fas fa-trash';
                botonEliminar.style.backgroundColor = '#343a40';
                botonEliminar.style.color = 'white';
                botonEliminar.style.padding = '5px';

                botonEliminar.addEventListener('click', function () {
                    llamadaAEliminarComentario(comentario.id_comentario);
                })
                comentarioContainer.appendChild(botonEliminar);
            }
            // Agrega el contenedor a la vista
            contenedorComentarios.appendChild(comentarioContainer);


        });
    }
}

async function getComentarios(id_publicacion) {
    try {
        var response = await fetch(`/comentario/getComentarios/${id_publicacion}`);
        var data = await response.json();
        console.log("la data es : " + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return [];
    }
}

async function llamadaAEliminarComentario(id_comentario) {
    var id_publicacion = document.getElementById('n').value;
    try {
        var response = await fetch(`/comentario/eliminarComentario/${id_comentario}`);
        var comentarios = await getComentarios(id_publicacion);
        actualizarVistaComentarios(comentarios);
    } catch (error) {
        console.log("Error al eliminar comentario:", error);
        return [];
    }
}

async function buscador() {
    var buscador = document.getElementById("buscador-input").value;

    console.log("En la función buscar " + buscador);

    try {
        var response = await fetch(`/buscar/${buscador}`);
        var data = await response.json();

        console.log("La data es:", data);

        if (data && data.publicaciones) {
            var publicacionesobtenidas = data.publicaciones;
            console.log("Publicaciones en el después del fetch:", publicacionesobtenidas);
            await actualizarVistaGeneral(publicacionesobtenidas);
        } else {
            console.error("La respuesta no contiene datos válidos.");
        }
    } catch (error) {
        console.error("Error al buscar:", error);
    }
    buscador.value = "";
}

function actualizarVistaGeneral(publicacionesobtenidas) {
    var galeriaDiv = document.getElementById("Galeria-busqueda");
    galeriaDiv.innerHTML = "";

    console.log("Publicaciones Obtenidas: " + JSON.stringify(publicacionesobtenidas))


    if (publicacionesobtenidas != null) {

        for (var i = 0; i < publicacionesobtenidas.length; i++) {
            var contenedorCartaBusqueda = document.createElement("div");
            var contenedorImagen = document.createElement("img");
            var contenedorTitulo = document.createElement("p");
            var contenedorValoracion = document.createElement("p");
            contenedorImagen.className = "miniatura";
            contenedorTitulo.className = "titulo2";
            contenedorCartaBusqueda.className = "contenedorCartaBusqueda"
            contenedorTitulo.textContent = publicacionesobtenidas[i].titulo;
            contenedorValoracion.textContent = publicacionesobtenidas[i].promedio;
            contenedorImagen.src = publicacionesobtenidas[i].miniatura;

            contenedorCartaBusqueda.appendChild(contenedorTitulo);
            contenedorCartaBusqueda.appendChild(contenedorImagen);
            contenedorCartaBusqueda.appendChild(contenedorValoracion);
            (function (index) {
                contenedorImagen.addEventListener("click", function () {
                    mostraImagenesLogueado(publicacionesobtenidas[index].id_publicacion);
                });
            })(i);

            galeriaDiv.appendChild(contenedorCartaBusqueda);
        }

    }
}

async function nuevo(u) {
    var nuevo = document.getElementById("nuevo");
    nuevo.innerHTML = ' ';

    try {
        var formulario = await creaFormulario(nuevo, u);
        //  await actualizarVistaPrincipal(u);

    } catch (error) {
        console.log("error en nuevo " + error);
        throw error;
    }
    console.log("Paso todo");
}

async function getCategoriasData() {
    try {

        var response = await fetch("/categorias/getCategorias");
        var data = await response.json();
        return data;
    } catch {
        console.log("Error al traer categorias", error)
        throw error
    }
}

async function getDerechosData() {
    try {
        var response = await fetch("/derechos/traerDerechos");
        var data = await response.json();
        return data;
    } catch {
        console.log("Error al traer derechos");
        throw error
    }
}

async function actualizarVistaPrincipal(id) {
    var galeria = document.getElementById('galeria');
    galeria.innerHTML = '';
    var u = document.getElementById('u').value;
    var n = document.getElementById('n').value;
    try {
        await fetch('/publicacion/actualizarVistaPrincipal/' + id)
            .then(response => response.json())
            .then(data => {
                data.forEach(publicacion => {
                    var contenedor_carta = document.createElement('div');
                    var img = document.createElement('img');
                    var promedio = document.getElementById('promedio_miniatura');
                    var p = document.createElement('p');
                    var iValoracion = document.createElement('i');
                    var pValoracion = document.createElement('p');
                    contenedor_carta.setAttribute('id', 'contenedor_carta');
                    img.setAttribute("n", publicacion.id_publicacion);
                    img.className = 'miniatura';
                    img.src = publicacion.miniatura;
                    p.textContent = publicacion.titulo;
                    p.className = 'titulo';
                    promedio.textContent = publicacion.promedio;
                    iValoracion.className = 'fas fa-star';
                    pValoracion.textContent = publicacion.promedio;
                    pValoracion.className = 'miniatura_valoracion'
                    contenedor_carta.appendChild(img);
                    contenedor_carta.appendChild(p);
                    contenedor_carta.appendChild(iValoracion);
                    contenedor_carta.appendChild(pValoracion);
                    galeria.appendChild(contenedor_carta);
                    contenedor_carta.addEventListener('click', async function () {
                        await mostraImagenesLogueado(publicacion.id_publicacion);
                    })

                })
            })
    } catch (error) {
        throw error
    }
    console.log("Actualizo")
}

async function creaFormulario(nuevo, u) {
    var categorias = await getCategoriasData();
    console.log(categorias);
    var derechos = await getDerechosData();
    nuevo.style.display = "block";
    // Crear un formulario
    var formulario = document.createElement("form");
    formulario.setAttribute("action", "/publicacion/agregar");
    formulario.setAttribute("method", "post");
    formulario.setAttribute("enctype", "multipart/form-data");

    var i = document.createElement('i');
    i.className = 'fas fa-times-circle';
    i.addEventListener('click', function () {
        nuevo.style.display = "none";
    })

    // Agregar un campo de texto para el título
    var tituloLabel = document.createElement("label");
    tituloLabel.setAttribute("for", "titulo");
    tituloLabel.textContent = "Título";

    var tituloInput = document.createElement("input");
    tituloInput.setAttribute("type", "text");
    tituloInput.setAttribute("name", "titulo");
    tituloInput.setAttribute("id", "titulo");
    tituloInput.classList.add("form-control");
    tituloInput.setAttribute("required", "required");
    var estadoLabel = document.createElement("label");
    estadoLabel.textContent = "Estado";

    //CHECKBOX
    var labelEstado = document.createElement("label");
    labelEstado.classList.add("form-label");
    labelEstado.setAttribute("for", "estado");
    labelEstado.textContent = "Estado";

    // Crear un div contenedor para los checkboxes "Público" y "Privado"
    var divCheckboxes = document.createElement("div");
    divCheckboxes.classList.add("form-check");
    divCheckboxes.setAttribute('id', 'checkboxes');
    // Crear el checkbox "Público"
    var inputPublico = document.createElement("input");
    inputPublico.setAttribute("type", "radio");
    inputPublico.setAttribute("name", "estado");
    inputPublico.setAttribute("id", "publico");
    inputPublico.classList.add("form-check-input");
    inputPublico.setAttribute("value", "0");
    inputPublico.setAttribute("required", "required");
    inputPublico.disabled = false; // Habilitar el checkbox "Público" por defecto

    // Crear el label para el checkbox "Público"
    var labelPublico = document.createElement("label");
    labelPublico.classList.add("form-check-label");
    labelPublico.setAttribute("for", "publico");
    labelPublico.textContent = "Público";

    // Crear el checkbox "Privado"
    var inputPrivado = document.createElement("input");
    inputPrivado.setAttribute("type", "radio");
    inputPrivado.setAttribute("name", "estado");
    inputPrivado.setAttribute("id", "privado");
    inputPrivado.classList.add("form-check-input");
    inputPrivado.setAttribute("value", "1");
    inputPrivado.setAttribute("required", "required");
    inputPrivado.style.marginLeft = "10px";
    // Crear el label para el checkbox "Privado"
    var labelPrivado = document.createElement("label");
    labelPrivado.classList.add("form-check-label");
    labelPrivado.setAttribute("for", "privado");
    labelPrivado.textContent = "Privado";

    // Agregar los checkboxes al div contenedor de los checkboxes

    divCheckboxes.appendChild(labelPublico);
    divCheckboxes.appendChild(inputPublico);
    divCheckboxes.appendChild(labelPrivado);
    divCheckboxes.appendChild(inputPrivado);

    // Verificar si los derechos son "Copyright" y deshabilitar el checkbox "Público" si es necesario
    if (derechos.id_derechos === 4) {
        inputPublico.disabled = true; // Deshabilitar el checkbox "Público"
    }



    // Agregar un campo de selección para la categoría
    var categoriaLabel = document.createElement("label");
    categoriaLabel.setAttribute("for", "categoria");
    categoriaLabel.textContent = "Categoría";

    var categoriaSelect = document.createElement("select");
    categoriaSelect.setAttribute("name", "categoria");
    categoriaSelect.setAttribute("id", "categoria");
    categoriaSelect.classList.add("form-control");
    categoriaSelect.setAttribute("required", "required");

    // Agregar opciones para las categorías
    categorias.forEach(function (categoria) {
        var categoriaOption = document.createElement("option");
        categoriaOption.setAttribute("value", categoria.id_categoria);
        categoriaOption.textContent = categoria.descripcion;
        categoriaSelect.appendChild(categoriaOption);
    });

    // Agregar un campo de selección para los derechos
    var derechosLabel = document.createElement("label");
    derechosLabel.setAttribute("for", "derechos");
    derechosLabel.textContent = "Derechos";

    var derechosSelect = document.createElement("select");
    derechosSelect.setAttribute("name", "derechos");
    derechosSelect.setAttribute("id", "derechos");
    derechosSelect.classList.add("form-control");
    derechosSelect.setAttribute("required", "required");

    // Agregar opciones para los derechos
    derechos.forEach(function (derecho) {
        var derechoOption = document.createElement("option");
        derechoOption.setAttribute("value", derecho.id_derechos);
        derechoOption.textContent = derecho.descripcion;
        derechosSelect.appendChild(derechoOption);
    });

    var inputFile = document.createElement('input')
    inputFile.setAttribute("type", "file");
    inputFile.setAttribute("name", "foto");
    inputFile.className = "form-control";

    var iSendButton = document.createElement('button');
    iSendButton.style.backgroundColor = "none"
    iSendButton.style.borderRadius = "25px"
    iSendButton.setAttribute("type", "submit");

    var isend = document.createElement('i');
    isend.className = "fa fa-location-arrow"
    isend.style.color = "aliceblue";
    iSendButton.appendChild(isend);


    // Agregar campos al formulario
    formulario.appendChild(tituloLabel);
    formulario.appendChild(i);
    formulario.appendChild(tituloInput);
    formulario.appendChild(categoriaLabel);
    formulario.appendChild(categoriaSelect);
    formulario.appendChild(derechosLabel);
    formulario.appendChild(derechosSelect);
    formulario.appendChild(estadoLabel);
    formulario.appendChild(divCheckboxes);
    formulario.appendChild(inputFile);
    formulario.appendChild(iSendButton);
    nuevo.appendChild(formulario);


    formulario.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de manera predeterminada

        var formData = new FormData(formulario);

        fetch('/publicacion/agregar', {
            method: 'POST',
            body: formData, // Utiliza el objeto FormData como cuerpo de la solicitud
        })
            .then(response => {
                console.log("Pre solicitud POST exitosa", JSON.stringify(response));
                return response.json();
            })
            .then(data => () => {
                console.log('Solicitud POST exitosa:', data);

            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error);
            });
        //await actualizarVistaPrincipal(u);
        await mostrarFotosPaginadas();
        nuevo.style.display = "none";

    });


    return formulario;
}


const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
prevButton.style.display = 'none';
const paginador = {
numeroDePagina : 1
    ,
    setNumeroDePagina(numeroPagina){
        this.numeroDePagina = numeroPagina;
    },
    getNumeroPagina(){
       return  this.numeroDePagina
    }
};
prevButton.addEventListener('click', async function() {
    var u = document.getElementById('u').value;
    console.log("Se hizo click");
    let numeroDePagina = paginador.getNumeroPagina();
    console.log(numeroDePagina);
    
        paginador.setNumeroDePagina(--numeroDePagina);
    if(numeroDePagina == 1){
        prevButton.style.display = 'none';
    }
    
    

    await mostrarFotosPaginadas();
});


nextButton.addEventListener('click', async function() {
    var u = document.getElementById('u').value;
    console.log("Se hizo click");
    let numeroDePagina = paginador.getNumeroPagina();
    console.log(numeroDePagina)
    
    paginador.setNumeroDePagina(++numeroDePagina)

    if (numeroDePagina > 1) {
        prevButton.style.display = 'inline';
    }
    await mostrarFotosPaginadas();
});

async function mostrarFotosPaginadas() {
    var galeria = document.getElementById('galeria')
    galeria.innerHTML = '';
    const IPP = 10;
    const numeroDePagina = paginador.getNumeroPagina();
    console.log("En la funcion num de pagina es " + numeroDePagina)
    console.log("Entramos a la funcion mostrarFotosPaginadas");
    try {
        var u = document.getElementById('u').value;
console.log("try")
        var publicaciones = await fetch('/publicacion/mostrarFotosPaginadas/' + IPP + '/' + numeroDePagina)
            .then(response => response.json())
            .then(data => {
                console.log("data " + data)
                data.forEach(publicacion => {
                    var contenedor_carta = document.createElement('div');
                    var img = document.createElement('img');
                    var promedio = document.getElementById('promedio_miniatura');
                    var p = document.createElement('p');
                    var iValoracion = document.createElement('i');
                    var pValoracion = document.createElement('p');
                    contenedor_carta.setAttribute('id', 'contenedor_carta');
                    img.setAttribute("n", publicacion.id_publicacion);
                    img.className = 'miniatura';
                    img.src = publicacion.miniatura;
                    p.textContent = publicacion.titulo;
                    p.className = 'titulo';
                   // promedio.textContent = publicacion.promedio;
                    iValoracion.className = 'fas fa-star';
                    pValoracion.textContent = publicacion.promedio;
                    pValoracion.className = 'miniatura_valoracion'
                    contenedor_carta.appendChild(img);
                    contenedor_carta.appendChild(p);
                    contenedor_carta.appendChild(iValoracion);
                    contenedor_carta.appendChild(pValoracion);
                    galeria.appendChild(contenedor_carta);
                    contenedor_carta.addEventListener('click', async function () {
                        await mostraImagenesLogueado(publicacion.id_publicacion);
                    })
                    console.log("final del fetch")
                })
            })
    } catch (error) {
   console.log("Error" +  error);
        throw error
    }

}  

async function traerMejores() {

}