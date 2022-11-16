//las dos van

import { libro,biblioteca,socio } from "./clases.js";

export async function processLibros() {
    //'datos/libros.txt'
    let libros = [];
    const result = await readFile('datos/libros.txt');
    let arr = result.split('🙪');
    arr.pop();
    let cont = 0;
    while (cont < arr.length) {
        const nombre = arr[cont];
        cont++;
        const autore = arr[cont];
        cont++;
        const genero = arr[cont];
        cont++;
        const nombreSocio = arr[cont];
        cont++;
        const idSocio = arr[cont];
        cont++;
        const bibliotecaSocio = arr[cont];
        cont++;

        libros.push(new libro(nombre, autore, genero, new socio(nombreSocio, idSocio, bibliotecaSocio)));
    }
    return libros;
}

export async function processBibliotecas() {
    //'datos/bibliotecas.txt'
    let bibliotecas = [];
    const result = await readFile('datos/bibliotecas.txt');
    let arr = result.split('🙪');
    arr.pop();
    let cont = 0;
    while (cont < arr.length) {
        const nombre = arr[cont];
        cont++;
        const localidad = arr[cont];
        cont++;
        const bibliotecarie = arr[cont];
        cont++;

        bibliotecas.push(new biblioteca(nombre, localidad, bibliotecarie));
    }
    return bibliotecas;
}

export async function processSocios() {
    //'datos/socios.txt'
    let socios = [];
    const result = await readFile('datos/socios.txt');
    let arr = result.split('🙪');
    arr.pop();
    let cont = 0;
    while (cont < arr.length) {
        const nombre = arr[cont];
        cont++;
        const id = arr[cont];
        cont++;
        const nombreBiblioteca = arr[cont];
        cont++;
        const localidadBiblioteca = arr[cont];
        cont++;
        const bibliotecarieBiblioteca = arr[cont];
        cont++;

        socios.push(new socio(nombre, id, new biblioteca(nombreBiblioteca, localidadBiblioteca, bibliotecarieBiblioteca)));
    }
    return socios;
}

async function readFile(filePath) {
    try {
        const txt = await fetch(filePath);
        const txtData = await txt.text();
        return txtData;
    } catch (err) {
        return console.error(err);
    }
}