import { biblioteca, socio, libro } from './clases.js';
import { processBibliotecas, processLibros, processSocios } from './cargarDatos.js';
import { activateLink } from './page.js';

//mirar de poner un current type universal en vez de pasarlo como una pelota

//recuperamos los datos de los archivos
let bibliotecas = await processBibliotecas();
let socios = await processSocios();
let libros = await processLibros();

//recuperamos los datos de sesion
recuperarSesion();

//añadimos funcionalidad a los botones del menu lateral
const links = document.getElementById("links").querySelectorAll("a");
links.forEach(link => {
    link.addEventListener('click', () => {
        setPage(link.innerText);
    });
});


//funciones
function recuperarSesion() {
    let sesBiblio = sessionStorage.getItem("bibliotecas");
    if (sesBiblio !== null) {
        sesBiblio = JSON.parse(sesBiblio);
    
        //añadimos las bibliotecas de la sesión al array de bibliotecas
        sesBiblio.forEach(biblio => {
            addObjectToArray(bibliotecas, new biblioteca(biblio.nombre, biblio.localidad, biblio.bibliotecarie))
        })
    }
    
    let sesSocio = sessionStorage.getItem("socios");
    if (sesSocio !== null) {
        sesSocio = JSON.parse(sesSocio);
    
        //añadimos los socios de la sesión al array de socios
        sesSocio.forEach(soc => {
            const b = new biblioteca(soc.biblioteca.nombre, soc.biblioteca.localidad, soc.biblioteca.bibliotecarie);
            addObjectToArray(socios, new socio(soc.nombre, soc.id, b));
        });
    }
    
    let sesLibro = sessionStorage.getItem("libros");
    if (sesLibro !== null) {
        sesLibro = JSON.parse(sesLibro);
    
        //añadimos los libros de la sesión al array de libros
        sesLibro.forEach(lib => {
            const b = new biblioteca(lib.socie.biblioteca.nombre, lib.socie.biblioteca.localidad, lib.socie.biblioteca.bibliotecarie);
            const s = new socio(lib.socie.nombre, lib.socie.id, b);
            addObjectToArray(libros, new libro(lib.titulo, lib.autore, lib.genero, s));
        });
    }
}

function getObjectFromArray(obj) {
    let ret;
    switch (obj.constructor.name) {
        case "biblioteca":
            bibliotecas.forEach(bib => {
                if (bib.equals(obj)) {
                    ret = bib;
                    return;
                }
            });
        return ret;
        case "socio":
            let s = new socio("No Prestado", "-1", new biblioteca("","",""));
            if (obj.equals(s)) {
                return s;
            }
            socios.forEach(soc => {
                if (soc.equals(obj)) {
                    ret = soc;
                    return;
                }
            });
        return ret;
        case "libro":
            libros.forEach(lib => {
                if (lib.equals(obj)) {
                    ret = lib;
                    return;
                }
            });
        return ret;
    }
}

function addObjectToArray(arr,obj) {

    let contains = false;

    switch (obj.constructor.name) {
        case "biblioteca":
            bibliotecas.forEach(bib => {
                if (bib.equals(obj)) {
                    contains = true;
                    return;
                }
            });
        break;
        case "socio":
            socios.forEach(soc => {
                if (soc.equals(obj)) {
                    contains = true;
                    return;
                }
            });
        break;
        case "libro":
            libros.forEach(lib => {
                if (lib.equals(obj)) {
                    contains = true;
                    return;
                }
            });
        break;
    }
    if (!contains) {
        arr.push(obj);
        return true;
    }
    
    return false;
}

function setPage(setTo) {
    switch(setTo) {
        case "Bibliotecas":
            activateLink(links[0]);
            setButtons({"añadir biblioteca" : function() {addVisualObject("Bibliotecas")},
                        "borrar biblioteca" : function() {removeVisualObject("Bibliotecas")},
                        "modificar bibliotecas" : function() {modifyVisualObject("Bibliotecas")}});
            setActions("Bibliotecas");
            updateTable("Bibliotecas");
        break;
        case "Libros":
            activateLink(links[1]);
            setButtons({"añadir libro" : function() {addVisualObject("Libros")},
                        "borrar libro" : function() {removeVisualObject("Libros")},
                        "modificar libros" : function() {modifyVisualObject("Libros")}});
            setActions("Libros");
            updateTable("Libros");
        break;
        case "Socios":
            activateLink(links[2]);
            setButtons({"añadir socio" : function() {addVisualObject("Socios")},
                        "borrar socio" : function() {removeVisualObject("Socios")},
                        "modificar socios" : function() {modifyVisualObject("Socios")}});
            setActions("Socios");
            updateTable("Socios");
        break;
    }
}

function updateTable(type) {

    //se crea la tabla
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    const tableDiv = document.getElementById("table"); 
    
    //se resetea la tabla
    tableDiv.innerHTML = '';
    table.innerHTML = '';

    let cabeceras;
    switch (type) {
        case "Bibliotecas":
            sessionStorage.setItem("bibliotecas", JSON.stringify(bibliotecas));
            cabeceras = ["Nombre", "Localidad", "Bibliotecario/a"];
        break;
        case "Libros":
            sessionStorage.setItem("libros", JSON.stringify(libros));
            cabeceras = ["Título", "Autor/a", "Género", "Prestado a"];
        break;
        case "Socios":
            sessionStorage.setItem("socios", JSON.stringify(socios));
            cabeceras = ["Nombre", "Id", "Biblioteca"];
        break;
    }

    //se añaden las cabeceras a la tabla
    table.appendChild(getCabeceras(cabeceras));

    //se añaden las filas a la tabla
    const filas = getFilas(type);
    
    filas.forEach(fila => {
        table.appendChild(fila);
    })
    tableDiv.appendChild(table);
}

function addObjectAviso(obj, type) {
    switch(type) {
        case "Bibliotecas":
            if (addObjectToArray(bibliotecas,obj)) {
                updateTable(type);
                aviso("Biblioteca añadida correctamente","success");
            } else {
                aviso("Error, la biblioteca ya existe","error");
            }
        break;
        case "Libros":
            if (addObjectToArray(libros,obj)) {
                updateTable(type);
                aviso("Libro añadido correctamente","success");
            } else {
                aviso("Error, el libro ya existe","error");
            }
        break;
        case "Socios":
            if (addObjectToArray(socios,obj)) {
                updateTable(type);
                aviso("Socio añadido correctamente","success");
            } else {
                aviso("Error, el socio ya existe","error");
            }
        break;
    }
}

function addVisualObject(type) {
    const actionsDiv = document.getElementById("actions");
    actionsDiv.style.display = 'block';

    const addBtn = actionsDiv.querySelector("#add");
    addBtn.addEventListener('click', () => {
        const inputs = actionsDiv.querySelectorAll("input");

        switch(type) {
            case "Bibliotecas":
                //mira si los puntos clave de la biblioteca se han dejado en blanco
                if ((inputs[0].value !== "" && inputs[0].value) && (inputs[1].value !== "" && inputs[1].value)) {
                    addObjectAviso(new biblioteca(inputs[0].value, inputs[1].value, inputs[2].value), type);
                } else {
                    aviso("No puedes dejar en blanco ni el nombre ni la localidad","error");
                }
    
            break;
            case "Libros":
                //mira si los puntos clave del libro se han dejado en blanco
                if ((inputs[0].value !== "" && inputs[0].value) && (inputs[1].value !== "" && inputs[1].value)) {

                    //se recupera el socio seleccionado
                    const selectSocios = actionsDiv.querySelector("select");
                    let s = new socio("",selectSocios.value,"");

                    addObjectAviso(new libro(inputs[0].value, inputs[1].value, inputs[2].value,getObjectFromArray(s)), type);
                } else {
                    aviso("No puedes dejar en blanco ni el título ni el autor/a","error");
                }
            break;
            case "Socios":
                //mira si los puntos clave del libro se han dejado en blanco
                if ((inputs[1].value !== "" && inputs[1].value)) {

                    //se recupera la biblioteca seleccionada
                    const selectBiblios = actionsDiv.querySelector("select");
                    let bib = selectBiblios.value.split('🙪');
                    let b = new biblioteca(bib[0],bib[1],"");

                    addObjectAviso(new socio(inputs[0].value, inputs[1].value, getObjectFromArray(b)), type);
                } else {
                    aviso("No puedes dejar en el Id","error");
                }
            break;
        }

        //volvemos a esconder el div de acciones
        actionsDiv.style.display = "none";
    })
    const cancelBtn = actionsDiv.querySelector("#cancel");
    cancelBtn.addEventListener('click', () => {
        updateTable(type);
        actionsDiv.style.display = "none";
    });
}

function removeVisualObject(type) {

    setTableDelete(type);

    //añadimos los botones de acción de borrado al final de la tabla
    const eliminar = document.createElement("button");
    eliminar.setAttribute("class", "btn btn-light me-2");
    eliminar.innerHTML = "Eliminar selección";
    eliminar.addEventListener('click', () => {
        let checkedBoxes = tableDiv.querySelectorAll('input[type=checkbox]:checked');
        let toDelete = [];
        checkedBoxes.forEach(check => {
            //se pasa la informacion de los objetos que han de ser borrados
            toDelete.push(check.parentElement.getAttribute("name"));
        })
        remObjects(toDelete,type);
        updateTable(type);
        aviso("Eliminados correctamente","success");
    })

    const cancelar = document.createElement("button");
    cancelar.setAttribute("class", "btn btn-light me-2");
    cancelar.innerHTML = "Cancelar";
    cancelar.addEventListener('click',() => {updateTable(type)});

    const tableDiv = document.getElementById("table");
    tableDiv.appendChild(eliminar);
    tableDiv.appendChild(cancelar);

}

function modifyVisualObject(type) {

    //ponemos la tabla para modificarla y nos devuelve las filas
    let filas = setTableModify(type);

    //añadimos los botones de acción de modificación al final de la tabla
    const modificar = document.createElement("button");
    modificar.setAttribute("class", "btn btn-light me-2");
    modificar.innerHTML = "Modificar cambios";
    modificar.addEventListener('click', () => {
        modObjects(filas,type);
        updateTable(type);
        aviso("Modificados correctamente","success");
    })

    const cancelar = document.createElement("button");
    cancelar.setAttribute("class", "btn btn-light me-2");
    cancelar.innerHTML = "Cancelar";
    cancelar.addEventListener('click',() => {updateTable(type)});

    const tableDiv = document.getElementById("table");
    tableDiv.appendChild(modificar);
    tableDiv.appendChild(cancelar);
}

function setTableDelete(type) {
    //se crea la tabla
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    const tableDiv = document.getElementById("table"); 

    //se resetea la tabla
    tableDiv.innerHTML = '';
    table.innerHTML = '';

    let cabeceras;
    switch (type) {
        case "Bibliotecas":
            cabeceras = ["Nombre", "Localidad", "Bibliotecario/a","Selección"];
        break;
        case "Libros":
            cabeceras = ["Título", "Autor/a", "Género", "Prestado a","Selección"];
        break;
        case "Socios":
            cabeceras = ["Nombre", "Id", "Biblioteca","Selección"];
        break;
    }

    //se añaden las cabeceras a la tabla
    table.appendChild(getCabeceras(cabeceras));

    //se añaden las filas a la tabla
    const filas = getFilasDelete(type);

    filas.forEach(fila => {
        table.appendChild(fila);
    })
    tableDiv.appendChild(table);
}

function remObjects(arr,type) {
    arr.forEach(elem => {
        const toDelete = elem.split('🙪');
        let index = 0;
        
        switch(type) {
            case "Bibliotecas":
                let deletedBibliotecas = [];

                bibliotecas.forEach(bib => {
                    if (bib.nombre === toDelete[0] && bib.localidad === toDelete[1]) {
                        deletedBibliotecas.push(bib);
                        bibliotecas.splice(index, 1);
                    } else {
                        index++;
                    }
                });

                if (deletedBibliotecas.length > 0) {

                    let sociosToDelete = [];

                    deletedBibliotecas.forEach(bib => {
                        socios.forEach(soc => {
                            if (soc.getBiblioteca().equals(bib)) {
                                sociosToDelete.push(soc.getId() + '🙪');
                                return;
                            }
                        })
                    })

                    remObjects(sociosToDelete, "Socios");
                } 
            break;
            case "Socios":
                let deletedSocios = [];

                socios.forEach(soc => {
                    if (soc.getId() === toDelete[0]) {
                        deletedSocios.push(soc);
                        socios.splice(index, 1);
                    } else {
                        index++;
                    }
                });

                if (deletedSocios.length > 0) {

                    let booksToDelete = [];

                    deletedSocios.forEach(soc => {
                        
                        libros.forEach(lib => {
                            if (lib.getsocie().equals(soc)) {
                                booksToDelete.push(lib.getTitulo() + '🙪' + lib.getAutore());
                                return;
                            }
                        });
                    });

                    remObjects(booksToDelete,"Libros");
                }

            break;
            case "Libros":
                libros.forEach(lib => {
                    if (lib.getTitulo() === toDelete[0] && lib.getAutore() === toDelete[1]) {
                        libros.splice(index, 1);
                    } else {
                        index++;
                    }
                });
            break;
        }

    })
}

function setTableModify(type) {

    //se crea la tabla
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    const tableDiv = document.getElementById("table"); 
    
    //se resetea la tabla
    tableDiv.innerHTML = '';
    table.innerHTML = '';

    let cabeceras;
    switch (type) {
        case "Bibliotecas":
            cabeceras = ["Nombre", "Localidad", "Bibliotecario/a"];
        break;
        case "Libros":
            cabeceras = ["Título", "Autor/a", "Género", "Prestado a"];
        break;
        case "Socios":
            cabeceras = ["Nombre", "Id", "Biblioteca"];
        break;
    }

    //se añaden las cabeceras a la tabla
    table.appendChild(getCabeceras(cabeceras));

    //se añaden las filas a la tabla
    const filas = getFilasModify(type);
    
    filas.forEach(fila => {
        table.appendChild(fila);
    })
    tableDiv.appendChild(table);

    return filas;
}

function modObjects(filas,type) {
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        let datosModificados = [];
        
        switch (type) {
            case "Bibliotecas":
                const bib = bibliotecas[i];

                fila.childNodes.forEach(dato => {
                    datosModificados.push(dato.firstElementChild.value);
                });

                bib.actualizaBiblioteca(datosModificados[0],datosModificados[1],datosModificados[2]);
            break;
            case "Socios":
                const soc = socios[i];

                fila.childNodes.forEach(dato => {
                    datosModificados.push(dato.firstElementChild.value);
                });

                let b = datosModificados[2].split('🙪');
                b = new biblioteca(b[0],b[1],"");

                soc.actualizaSocio(datosModificados[0],datosModificados[1],getObjectFromArray(b));
            break;
            case "Libros":
                const lib = libros[i];

                fila.childNodes.forEach(dato => {
                    datosModificados.push(dato.firstElementChild.value);
                });

                let s = datosModificados[3].split('🙪');
                s =  new socio("",s[0],"");

                //console.log(new libro(datosModificados[0],datosModificados[1],datosModificados[2],getObjectFromArray(s)))

                lib.actualizaLibro(datosModificados[0],datosModificados[1],datosModificados[2],getObjectFromArray(s));

            break;
        }
    }
}

function setButtons(buttonsArr) {
    const buttonsDiv = document.getElementById("actionButtons");
    buttonsDiv.innerHTML = '';

    for (const buttonName in buttonsArr) {
        const button = document.createElement("button");
        button.setAttribute("class","btn btn-light bg-white rounded-pill shadow-sm px-4 mb-4 me-2");

        const small = document.createElement("small");
        small.setAttribute("class","text-uppercase font-weight-bold");
        small.innerHTML = buttonName;

        button.addEventListener('click', () => {
            buttonsArr[buttonName]();
        });

        button.appendChild(small);
        buttonsDiv.appendChild(button);
    }
}

function setActions(setTo) {
    const actionsDiv = document.getElementById("actions");
    actionsDiv.innerHTML = '';

    switch(setTo) {
        case "Bibliotecas":
            actionsDiv.innerHTML = `
                <h2 class="mb-4">Añadir Biblioteca</h2>
                <div class="row">
                    <div class="col-md-6 col-xl-4 p-0"><input class="form-control" type="text" placeholder="Nombre"></div>
                    <div class="col-md-6 col-xl-4 p-0"><input class="form-control" type="text" placeholder="Localidad"></div>
                    <div class="col-md-6 col-xl-4 p-0"><input class="form-control" type="text" placeholder="Bibliotecario/a"></div>
                </div>
            `;
        break;
        case "Socios":
            actionsDiv.innerHTML = `
                <h2 class="mb-4">Añadir Socio</h2>
                <div class="row">
                    <div class="col-md-6 p-0"><input class="form-control" type="text" placeholder="Nombre"></div>
                    <div class="col-md-6 p-0"><input class="form-control" type="text" placeholder="Id"></div>
                    <div class="col-md-6 p-0"><select class="form-select"></select></div>
                </div>
            `;
            const selectSocios = actionsDiv.querySelector("select");
            bibliotecas.forEach(bib => {
                const option = document.createElement("option");
                option.setAttribute("value",bib.getNombre() + '🙪' + bib.getLocalidad());
                option.innerText = bib.getNombre();
                selectSocios.appendChild(option);
            })
        break;
        case "Libros":
            actionsDiv.innerHTML = `
                <h2 class="mb-4">Añadir Libro</h2>
                <div class="row">
                    <div class="col-md-6 p-0"><input class="form-control" type="text" placeholder="Título"></div>
                    <div class="col-md-6 p-0"><input class="form-control" type="text" placeholder="Autor/a"></div>
                    <div class="col-md-6 p-0"><input class="form-control" type="text" placeholder="Género"></div>
                    <div class="col-md-6 p-0"><select class="form-select"></select></div>
                </div>
            `;
            const selectLibros = actionsDiv.querySelector("select");
            selectLibros.appendChild(getNoPrestadoOption());
            socios.forEach(soc => {
                const option = document.createElement("option");
                option.setAttribute("value",soc.getId());
                option.innerText = soc.getNombre();
                selectLibros.appendChild(option);
            })
        break;
    }
    actionsDiv.innerHTML += `
        <button class="btn btn-light mt-3" role="button" id="add">Añadir</button>
        <button class="btn btn-light mt-3" role="button" id="cancel">Cancelar</button>
    `;
}

function getCabeceras(cabeceras) {
    const mainTr = document.createElement("tr");

    for (let i = 0; i < cabeceras.length; i++) {

        const th = document.createElement("th");
        th.innerHTML = cabeceras[i];
        mainTr.appendChild(th);
    }

    return mainTr;
}

function getFilas(type) {

    let filas = [];

    switch (type) {
        case "Bibliotecas":
            bibliotecas.forEach(bib => {

                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                nombre.innerHTML = bib.getNombre();

                const localidad = document.createElement("td");
                localidad.innerHTML = bib.getLocalidad();

                const bibliotecarie = document.createElement("td");
                bibliotecarie.innerHTML = bib.getBibliotecarie();

                fila.appendChild(nombre);
                fila.appendChild(localidad);
                fila.appendChild(bibliotecarie);

                filas.push(fila);
            });
        break;
        case "Socios":
            socios.forEach(soc => {
                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                nombre.innerHTML = soc.getNombre();
    
                const id = document.createElement("td");
                id.innerHTML = soc.getId();

                const biblioteca = document.createElement("td");
                biblioteca.innerHTML = soc.getBiblioteca().getNombre();

                fila.appendChild(nombre);
                fila.appendChild(id);
                fila.appendChild(biblioteca);

                filas.push(fila);
            });
        break;
        case "Libros":
            libros.forEach(lib => {
                const fila = document.createElement("tr");
        
                const titulo = document.createElement("td");
                titulo.innerHTML = lib.getTitulo();
            
                const autore = document.createElement("td");
                autore.innerHTML = lib.getAutore();
        
                const genero = document.createElement("td");
                genero.innerHTML = lib.getGenero();
        
                const socie = document.createElement("td");
                socie.innerHTML = lib.getsocie().getNombre();
        
                fila.appendChild(titulo);
                fila.appendChild(autore);
                fila.appendChild(genero);
                fila.appendChild(socie);

                filas.push(fila);
            });
        break;
    }
    return filas;
}

function getFilasDelete(type) {
    let filas = [];

    switch (type) {
        case "Bibliotecas":
            bibliotecas.forEach(bib => {

                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                nombre.innerHTML = bib.getNombre();

                const localidad = document.createElement("td");
                localidad.innerHTML = bib.getLocalidad();

                const bibliotecarie = document.createElement("td");
                bibliotecarie.innerHTML = bib.getBibliotecarie();

                //añadimos el checkbox para seleccionar
                const check = document.createElement("td");
                check.setAttribute("style", "text-align:center");
                check.setAttribute("name", bib.nombre + "🙪" + bib.localidad)
                check.innerHTML = `<input type="checkbox" class="form-check-input">`;

                fila.appendChild(nombre);
                fila.appendChild(localidad);
                fila.appendChild(bibliotecarie);
                fila.appendChild(check);

                filas.push(fila);
            });
        break;
        case "Socios":
            socios.forEach(soc => {
                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                nombre.innerHTML = soc.getNombre();
    
                const id = document.createElement("td");
                id.innerHTML = soc.getId();

                const biblioteca = document.createElement("td");
                biblioteca.innerHTML = soc.getBiblioteca().getNombre();

                //añadimos el checkbox para seleccionar
                const check = document.createElement("td");
                check.setAttribute("style", "text-align:center");
                check.setAttribute("name", soc.getId());
                check.innerHTML = `<input type="checkbox" class="form-check-input">`;

                fila.appendChild(nombre);
                fila.appendChild(id);
                fila.appendChild(biblioteca);
                fila.appendChild(check);

                filas.push(fila);
            });
        break;
        case "Libros":
            libros.forEach(lib => {
                const fila = document.createElement("tr");
        
                const titulo = document.createElement("td");
                titulo.innerHTML = lib.getTitulo();
            
                const autore = document.createElement("td");
                autore.innerHTML = lib.getAutore();
        
                const genero = document.createElement("td");
                genero.innerHTML = lib.getGenero();
        
                const socie = document.createElement("td");
                socie.innerHTML = lib.getsocie().getNombre();

                //añadimos el checkbox para seleccionar
                const check = document.createElement("td");
                check.setAttribute("style", "text-align:center");
                check.setAttribute("name", lib.getTitulo() + "🙪" + lib.getAutore());
                check.innerHTML = `<input type="checkbox" class="form-check-input">`;
        
                fila.appendChild(titulo);
                fila.appendChild(autore);
                fila.appendChild(genero);
                fila.appendChild(socie);
                fila.appendChild(check);

                filas.push(fila);
            });
        break;
    }
    return filas;
}

function getFilasModify(type) {
    let filas = [];

    switch (type) {
        case "Bibliotecas":
            bibliotecas.forEach(bib => {

                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                const nombreInput = document.createElement("input");
                nombreInput.setAttribute("type","text");
                nombreInput.setAttribute("class","form-control");
                nombreInput.value = bib.nombre;
                nombre.appendChild(nombreInput);

                const localidad = document.createElement("td");
                const localidadInput = document.createElement("input");
                localidadInput.setAttribute("type","text");
                localidadInput.setAttribute("class","form-control");
                localidadInput.value = bib.localidad;
                localidad.appendChild(localidadInput);

                const bibliotecarie = document.createElement("td");
                const bibliotecarieInput = document.createElement("input");
                bibliotecarieInput.setAttribute("type","text");
                bibliotecarieInput.setAttribute("class","form-control");
                bibliotecarieInput.value = bib.bibliotecarie;
                bibliotecarie.appendChild(bibliotecarieInput);

                fila.appendChild(nombre);
                fila.appendChild(localidad);
                fila.appendChild(bibliotecarie);

                filas.push(fila);
            });
        break;
        case "Socios":

            const selectSocios = document.createElement("select");
            selectSocios.setAttribute("class","form-select bg-light");

            bibliotecas.forEach(bib => {
                const option = document.createElement("option");
                option.setAttribute("value",bib.getNombre() + '🙪' + bib.getLocalidad());
                option.innerText = bib.getNombre();
                selectSocios.appendChild(option);
            })

            socios.forEach(soc => {
                const fila = document.createElement("tr");

                const nombre = document.createElement("td");
                const nombreInput = document.createElement("input");
                nombreInput.setAttribute("type","text");
                nombreInput.setAttribute("class","form-control");
                nombreInput.value = soc.getNombre();
                nombre.appendChild(nombreInput);

                const id = document.createElement("td");
                const idInput = document.createElement("input");
                idInput.setAttribute("type","text");
                idInput.setAttribute("class","form-control");
                idInput.value = soc.getId();
                id.appendChild(idInput);

                const biblioteca = document.createElement("td");
                const bibliotecaSelect = selectSocios.cloneNode(true);
                bibliotecaSelect.value = soc.getBiblioteca().getNombre() + '🙪' + soc.getBiblioteca().getLocalidad();
                biblioteca.appendChild(bibliotecaSelect);

                fila.appendChild(nombre);
                fila.appendChild(id);
                fila.appendChild(biblioteca);

                filas.push(fila);
            });
        break;
        case "Libros":
            //creamos el select con los socios
            const selectLibros = document.createElement("select");
            selectLibros.setAttribute("class","form-select bg-light");
            selectLibros.appendChild(getNoPrestadoOption());

            socios.forEach(socio => {
                const option = document.createElement("option");
                option.setAttribute("value",socio.getId());
                option.innerHTML = socio.getNombre();
                selectLibros.appendChild(option);
            });

            libros.forEach(lib => {
                const fila = document.createElement("tr");
        
                const titulo = document.createElement("td");
                const tituloInput = document.createElement("input");
                tituloInput.setAttribute("type","text");
                tituloInput.setAttribute("class","form-control");
                tituloInput.value = lib.titulo;
                titulo.appendChild(tituloInput);

                const autore = document.createElement("td");
                const autoreInput = document.createElement("input");
                autoreInput.setAttribute("type","text");
                autoreInput.setAttribute("class","form-control");
                autoreInput.value = lib.autore;
                autore.appendChild(autoreInput);

                const genero = document.createElement("td");
                const generoInput = document.createElement("input");
                generoInput.setAttribute("type","text");
                generoInput.setAttribute("class","form-control");
                generoInput.value = lib.genero;
                genero.appendChild(generoInput);

                const socie = document.createElement("td");
                const socieSelect = selectLibros.cloneNode(true);
                socieSelect.value = lib.getsocie().getId();
                socie.appendChild(socieSelect);

                fila.appendChild(titulo);
                fila.appendChild(autore);
                fila.appendChild(genero);
                fila.appendChild(socie);

                filas.push(fila);
            });
        break;
    }
    return filas;
}

function getNoPrestadoOption() {
    const option = document.createElement("option");
    option.setAttribute("value","-1");
    option.innerText = "No prestado";
    return option;
}

async function aviso(aviso,color) {
    const avisos = document.getElementById("divAvisos");
    const p = document.createElement("p");

    p.innerHTML = aviso;
    avisos.appendChild(p);
    avisos.classList.add("avisando");
    avisos.classList.add(color);

    let timer = setTimeout(function() {
        avisos.innerHTML = '';
        avisos.classList.remove("avisando");
        avisos.classList.remove(color);
    }, 5000);
};