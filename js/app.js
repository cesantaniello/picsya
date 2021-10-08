const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        console.log('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        
        formulario.appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = '23741523-b9822c2077d62ea6a6d785841';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    console.log(total)
    for (let index = 1; index <= total; index++) {
        yield(index);
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total/registrosPorPagina));
}

function mostrarImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML +=`
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}"></img>

                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light"> veces vista</span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            Ver imagen
                        </a>
                    </div>
                </div>
            </div>
            `;
    });

    //Limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    //Generamos el nuevo HTML
    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const {value, done} = iterador.next();
        if(done) return;

        //En caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'mx-auto', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}