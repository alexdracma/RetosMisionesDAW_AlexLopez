export class biblioteca {
    constructor(nombre, localidad, bibliotecarie) {
        this.nombre = nombre;
        this.localidad = localidad;
        this.bibliotecarie = bibliotecarie;
    }

    actualizaBiblioteca(nombre, localidad, bibliotecarie) {
        this.nombre = nombre;
        this.localidad = localidad;
        this.bibliotecarie = bibliotecarie;
    }

    getNombre() {
        return this.nombre;
    }

    getLocalidad() {
        return this.localidad;
    }

    getBibliotecarie() {
        return this.bibliotecarie;
    }

    equals(compareTo) {
        let eq = true;
        if ((this.getNombre() !== compareTo.getNombre()) || (this.getLocalidad() !== compareTo.getLocalidad())) {
            eq = false;
        }
        return eq;
    }
}

export class libro {
    constructor(titulo, autore, genero, socie = -1) {
        this.titulo = titulo;
        this.autore = autore;
        this.genero = genero;
        this.socie = socie;
    }

    actualizaLibro(titulo, autore, genero, socie) {
        this.titulo = titulo;
        this.autore = autore;
        this.genero = genero;
        this.socie = socie;
    }

    prestarLibro(socie) {
        this.socie = socie;
    }

    getTitulo() {
        return this.titulo;
    }

    getAutore() {
        return this.autore;
    }

    getGenero() {
        return this.genero;
    }
    getsocie() {
        return this.socie;
    }

    equals(compareTo) {
        let eq = true;
        if ((this.getTitulo() !== compareTo.getTitulo()) || (this.getAutore() !== compareTo.getAutore())) {
            eq = false;
        }
        return eq;
    }
}

export class socio {
    constructor(nombre, id, biblioteca) {
        this.nombre = nombre;
        this.id = id;
        this.biblioteca = biblioteca;
    }

    actualizaSocio(nombre, id, biblioteca) {
        this.nombre = nombre;
        this.id = id;
        this.biblioteca = biblioteca;
    }

    getNombre() {
        return this.nombre;
    }

    getId() {
        return this.id;
    }

    getBiblioteca() {
        return this.biblioteca;
    }

    equals(compareTo) {
        let eq = true;
        if(this.getId() !== compareTo.getId()) {
            eq = false;
        }
        return eq;
    }
}