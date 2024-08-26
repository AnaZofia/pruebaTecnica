const fecha = document.querySelector('#fecha')
const lista = document.querySelector('#lista')
const elemento = document.querySelector('#elemento')
const input = document.querySelector('#input')
const botonEnter = document.querySelector('#boton-enter')
const check = 'fa-check-circle'
const uncheck = 'fa-circle'
const lineThrough = 'line-through'


let LIST = JSON.parse(localStorage.getItem('TODO')) || [];
let id =0
const taskId = parseInt(window.location.search.split('id=')[1]);
if (LIST.length > 0) {
  const tarea = LIST.find(item => item.id === taskId);
  if (tarea) {
    const descripcion = tarea.descripcion;
    document.querySelector('#descripcion').innerHTML = descripcion;
  }
}
//creacion de fecha actualizada 

const FECHA = new Date ()
fecha.innerHTML = FECHA.toLocaleDateString('es-MX',{weekday: 'long', month: 'short', day:'numeric'})

// funcion de agregar tarea 

function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) { return; }
    const REALIZADO = realizado ? check : uncheck
    const LINE = realizado ? lineThrough : ''
    const elemento = `
                        <li id="tarea-${id}">
                        <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
                        <p class="text ${LINE}">${tarea}</p>
                        <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
                        <i class="fas fa-ellipsis-v" data="opciones" id="${id}"></i>
                        </li>
                    `
    lista.insertAdjacentHTML("beforeend", elemento)
}


// funcion de Tarea Realizada 

function tareaRealizada(element, id) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
    LIST[id].realizado = LIST[id].realizado ? false : true;
}

function tareaEliminada(element, id) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[id].eliminado = true;
    console.log(LIST);
}

// crear un evento para escuchar el enter y para habilitar el boton 

botonEnter.addEventListener('click', ()=> {
    const tarea = input.value
    const descripcion = document.querySelector('#descripcion').value
    if(tarea){
        id = LIST.length
        agregarTarea(tarea, id, '', false, false) // No se muestra la descripción aquí
        LIST.push({
            nombre : tarea,
            descripcion : descripcion, // Se guarda la descripción en el objeto LIST
            id : id,
            realizado : false,
            eliminado : false
        })
        localStorage.setItem('TODO',JSON.stringify(LIST))
        input.value = ''
        document.querySelector('#descripcion').value = ''
        id++
    }
})

document.addEventListener('keyup', function (event) {
    if (event.key=='Enter'){
        const tarea = input.value
        const descripcion = document.querySelector('#descripcion').value
        if(tarea) {
            id = LIST.length
            agregarTarea(tarea, id, descripcion, false, false)
            LIST.push({
                nombre : tarea,
                descripcion : descripcion,
                id : id,
                realizado : false,
                eliminado : false
            })
            localStorage.setItem('TODO',JSON.stringify(LIST))
            input.value = ''
            document.querySelector('#descripcion').value = ''
            id++
        }
    }
})

lista.addEventListener('click', function(event) {
    const element = event.target;
    const elementData = element.attributes.data.value;
    console.log(elementData);

    if (elementData == 'realizado') {
        tareaRealizada(element, element.id);
    } else if (elementData == 'eliminado') {
        tareaEliminada(element, element.id);
        console.log("elimnado");
    } else if (elementData == 'opciones') {
        const opcionesId = element.id.replace('opciones-', '');
        window.location.href = `DetalleTareas.html?id=${opcionesId}`;
    }
    localStorage.setItem('TODO', JSON.stringify(LIST));
});

function cargarLista(array) {
    array.forEach(function(item) {
        agregarTarea(item.nombre, item.id, item.descripcion, item.realizado, item.eliminado);
    })
 
}
cargarLista(LIST);

if (LIST.length > 0) {
    const tarea = LIST.find(item => item.id === taskId);
    if (tarea) {
      const descripcion = tarea.descripcion;
      document.querySelector('#descripcion').innerHTML = descripcion;
      document.querySelector('#nombre-tarea').innerHTML = tarea.nombre;
    }
  }

// Agrega un elemento de entrada de texto editable en la página de detalles
const descripcionInput = document.querySelector('#descripcion-input');

// Carga la descripción de la tarea en el elemento de entrada de texto
if (LIST.length > 0) {
  const tarea = LIST.find(item => item.id === taskId);
  if (tarea) {
    descripcionInput.value = tarea.descripcion;
  }
}

// Agrega un botón de guardar para editar la descripción
const guardarDescripcionButton = document.querySelector('#guardar-descripcion-button');

// Función para actualizar la descripción de la tarea
function actualizarDescripcion() {
    const nuevaDescripcion = descripcionInput.value;
    const tarea = LIST.find(item => item.id === taskId);
    if (tarea && tarea.descripcion && LIST.find(item => item.id === taskId)) {
      tarea.descripcion = nuevaDescripcion;
      const indice = LIST.indexOf(tarea);
      LIST[indice].descripcion = nuevaDescripcion;
      localStorage.setItem('TODO', JSON.stringify(LIST));
      descripcionInput.value = nuevaDescripcion;
      document.querySelector('#descripcion').innerHTML = nuevaDescripcion;
    }
  }
// Agrega un evento de clic al botón de guardar
guardarDescripcionButton.addEventListener('click', function() {
    actualizarDescripcion();
  });
