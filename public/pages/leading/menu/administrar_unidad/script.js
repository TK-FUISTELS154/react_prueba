const API_BASE_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_UNIDADES = `${API_BASE_URL}/unidadadmin`;

const tablaBody = document.getElementById("tabla-body");
const btnNuevo = document.getElementById("btn-nuevo");
const btnEditar = document.getElementById("btn-editar");
const btnEliminar = document.getElementById("btn-eliminar");
const btnSeleccionar = document.getElementById("btn-seleccionar");
const btnSalir = document.getElementById("btn-salir");

const popupOverlay = document.getElementById("popup-overlay");
const popupUnidadId = document.getElementById("popup-unidad-id");
const popupCiudad = document.getElementById("popup-ciudad");
const popupDescripcion = document.getElementById("popup-descripcion");
const btnPopupGrabar = document.getElementById("popup-grabar");
const btnPopupSalir = document.getElementById("popup-salir");

let unidades = [];
let filaSeleccionada = null;
let modoEdicion = false;
let unidadOriginal = null;

async function cargarUnidades() {
    try {
        const response = await fetch(API_UNIDADES);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const rawData = await response.json();

        if (rawData.length > 0) {
            unidades = rawData.map(item => ({
                entidad: item.entidad,
                unidad: item.unidad,
                descripcion: item.descrip || "",
                ciudad: item.ciudad || ""
            }));
        } else {
            unidades = [];
        }
        
        renderizarTabla();
    } catch (error) {
        console.error("Error al cargar unidades:", error);
        alert("Error: No se pudo conectar con la API. Verifique la conexión.");
        unidades = [];
        renderizarTabla();
    }
}

function renderizarTabla() {
    tablaBody.innerHTML = "";
    
    if (unidades.length === 0) {
        for (let i = 0; i < 8; i++) {
            const row = document.createElement("tr");
            row.innerHTML = `<td></td><td></td><td></td>`;
            tablaBody.appendChild(row);
        }
        return;
    }

    unidades.forEach((unidad, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${unidad.unidad}</td>
            <td>${unidad.descripcion}</td>
            <td>${unidad.ciudad}</td>
        `;
        row.addEventListener("click", () => seleccionarFila(index));
        tablaBody.appendChild(row);
    });
}

function seleccionarFila(index) {
    if (filaSeleccionada !== null) {
        tablaBody.children[filaSeleccionada].style.backgroundColor = "";
    }

    filaSeleccionada = index;
    tablaBody.children[index].style.backgroundColor = "#ffff99";
    
    btnEditar.disabled = false;
    btnEliminar.disabled = false;
    btnSeleccionar.disabled = false;
}

function nuevo() {
    modoEdicion = true;
    unidadOriginal = null;
    filaSeleccionada = null;
    
    Array.from(tablaBody.children).forEach(row => {
        row.style.backgroundColor = "";
    });

    btnNuevo.disabled = true;
    btnEditar.disabled = true;
    btnEliminar.disabled = true;
    btnSeleccionar.disabled = true;
    
    popupUnidadId.value = "";
    popupCiudad.value = "";
    popupDescripcion.value = "";
    popupUnidadId.readOnly = false;
    
    popupOverlay.classList.add("active");
}

function editar() {
    if (filaSeleccionada === null) {
        alert("Seleccione una unidad para editar");
        return;
    }
    
    console.log("Editando fila:", filaSeleccionada);
    console.log("Unidad seleccionada:", unidades[filaSeleccionada]);
    
    modoEdicion = true;
    unidadOriginal = {...unidades[filaSeleccionada]};
    
    btnNuevo.disabled = true;
    btnEditar.disabled = true;
    btnEliminar.disabled = true;
    btnSeleccionar.disabled = true;
    
    const unidad = unidades[filaSeleccionada];
    console.log("Cargando datos en popup:", unidad);
    
    popupUnidadId.value = unidad.unidad.toString();
    popupCiudad.value = unidad.ciudad;
    popupDescripcion.value = unidad.descripcion;
    popupUnidadId.readOnly = true;
    
    console.log("Datos cargados - Unidad ID:", popupUnidadId.value, "Ciudad:", popupCiudad.value, "Descripción:", popupDescripcion.value);
    
    popupOverlay.classList.add("active");
    console.log("Popup mostrado");
}

async function eliminar() {
    if (filaSeleccionada === null) {
        alert("Seleccione una unidad para eliminar");
        return;
    }
    
    if (!confirm("¿Está seguro de eliminar esta unidad?")) return;

    try {
        const posicion = filaSeleccionada;
        console.log("Intentando eliminar posición:", posicion);
        
        const response = await fetch(`${API_UNIDADES}/${posicion}`, {
            method: "DELETE"
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        unidades.splice(filaSeleccionada, 1);
        
        renderizarTabla();
        
        restaurarEstado();
        
        alert("Eliminado exitosamente");
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error: No se pudo eliminar en la API. Verifique la conexión.");
    }
}

function seleccionar() {
    if (filaSeleccionada === null) {
        alert("Seleccione una unidad primero");
        return;
    }
    
    const unidad = unidades[filaSeleccionada];
    alert("Unidad seleccionada: " + unidad.descripcion);

    if (window.parent !== window) {
        window.parent.postMessage({ 
            type: 'unidad-seleccionada', 
            unidad: unidad 
        }, '*');
    }
    
    restaurarEstado();
}

function salir() {
    if (modoEdicion) {
        if (confirm("Hay cambios sin guardar. ¿Desea salir?")) {
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'close-modal' }, '*');
            } else {
                window.close();
            }
        }
    } else {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'close-modal' }, '*');
        } else {
            window.close();
        }
    }
}

function mostrarPopup() {
    popupOverlay.classList.add("active");
}

function ocultarPopup() {
    popupOverlay.classList.remove("active");
    restaurarEstado();
}

async function grabarPopup() {
    const unidad = popupUnidadId.value.trim();
    const ciudad = popupCiudad.value.trim();
    const descripcion = popupDescripcion.value.trim();

    if (!unidad) {
        alert("Por favor ingrese la unidad administrativa");
        popupUnidadId.focus();
        return;
    }

    const apiData = {
        entidad: 1,
        unidad: parseInt(unidad),
        descrip: descripcion,
        ciudad: ciudad
    };

    try {
        if (modoEdicion && unidadOriginal) {
            const posicion = filaSeleccionada;
            const response = await fetch(`${API_UNIDADES}/${posicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData)
            });
            if (!response.ok) throw new Error("Error al actualizar");
            alert("Actualizado exitosamente");
        } else {
            const response = await fetch(API_UNIDADES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData)
            });
            if (!response.ok) throw new Error("Error al crear");
            alert("Creado exitosamente");
        }
        
        await cargarUnidades();
        ocultarPopup();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error: No se pudo guardar en la API. Verifique la conexión.");
    }
}

function salirPopup() {
    if (popupUnidadId.value || popupCiudad.value || popupDescripcion.value) {
        if (confirm("Hay cambios sin guardar. ¿Desea salir?")) {
            ocultarPopup();
        }
    } else {
        ocultarPopup();
    }
}

function restaurarEstado() {
    modoEdicion = false;
    unidadOriginal = null;
    filaSeleccionada = null;
    
    btnNuevo.disabled = false;
    btnEditar.disabled = false;
    btnEliminar.disabled = false;
    btnSeleccionar.disabled = false;
    
    Array.from(tablaBody.children).forEach(row => {
        row.style.backgroundColor = "";
    });
}

btnNuevo.addEventListener("click", nuevo);
btnEditar.addEventListener("click", editar);
btnEliminar.addEventListener("click", eliminar);
btnSeleccionar.addEventListener("click", seleccionar);
btnSalir.addEventListener("click", salir);

btnPopupGrabar.addEventListener("click", grabarPopup);
btnPopupSalir.addEventListener("click", salirPopup);

popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
        salirPopup();
    }
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'recargar-unidades') {
        cargarUnidades();
    }
});

document.addEventListener("DOMContentLoaded", cargarUnidades);
