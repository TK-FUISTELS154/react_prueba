const API_BASE_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_OFICINAS  = `${API_BASE_URL}/unidadadmin`;
const API_ESTADOS   = `${API_BASE_URL}/api/estado`;

const selectOficina   = document.getElementById("select-oficina");
const inputId         = document.getElementById("input-oficina-id");
const txtObservacion  = document.getElementById("txt-observacion");
const statusLabel     = document.getElementById("status-label");

const btnSideNuevo    = document.getElementById("btn-side-nuevo");
const btnSideModificar= document.getElementById("btn-side-modificar");
const btnSideActivar  = document.getElementById("btn-side-activar");
const btnSideInactivar= document.getElementById("btn-side-inactivar");

const btnFooterActivar  = document.getElementById("btn-footer-activar");
const btnFooterInactivar= document.getElementById("btn-footer-inactivar");
const btnFooterNuevo    = document.getElementById("btn-footer-nuevo");
const btnFooterModificar= document.getElementById("btn-footer-modificar");
const btnFooterGuardar  = document.getElementById("btn-footer-guardar");
const btnFooterDeshacer = document.getElementById("btn-footer-deshacer");
const btnSalir          = document.getElementById("btn-salir");

const modalOverlay    = document.getElementById("modal-overlay");
const modalTitulo     = document.getElementById("modal-titulo");
const modalBtnCerrar  = document.getElementById("modal-btn-cerrar");
const modalBtnGuardar = document.getElementById("modal-btn-guardar");
const modalBtnCancelar= document.getElementById("modal-btn-cancelar");
const modalEntidad    = document.getElementById("modal-entidad");
const modalUnidad     = document.getElementById("modal-unidad");
const modalDescrip    = document.getElementById("modal-descrip");
const modalCiudad     = document.getElementById("modal-ciudad");

const confirmOverlay  = document.getElementById("confirm-overlay");
const confirmTitulo   = document.getElementById("confirm-titulo");
const confirmMensaje  = document.getElementById("confirm-mensaje");
const confirmBtnOk    = document.getElementById("confirm-btn-ok");
const confirmBtnCancel= document.getElementById("confirm-btn-cancel");

const alertOverlay    = document.getElementById("alert-overlay");
const alertTitulo     = document.getElementById("alert-titulo");
const alertMensaje    = document.getElementById("alert-mensaje");
const alertBtnOk      = document.getElementById("alert-btn-ok");

let oficinas        = [];
let estados         = [];
let modoEdicion     = false;
let oficinaOriginal = null;

function mostrarAlerta(mensaje, titulo = "Información") {
    return new Promise(resolve => {
        alertTitulo.textContent  = titulo;
        alertMensaje.textContent = mensaje;
        alertOverlay.classList.remove("hidden");
        const handler = () => {
            alertOverlay.classList.add("hidden");
            alertBtnOk.removeEventListener("click", handler);
            resolve();
        };
        alertBtnOk.addEventListener("click", handler);
    });
}

function mostrarConfirm(mensaje, titulo = "Confirmación") {
    return new Promise(resolve => {
        confirmTitulo.textContent  = titulo;
        confirmMensaje.textContent = mensaje;
        confirmOverlay.classList.remove("hidden");
        const handleOk = () => {
            confirmOverlay.classList.add("hidden");
            confirmBtnOk.removeEventListener("click", handleOk);
            confirmBtnCancel.removeEventListener("click", handleCancel);
            resolve(true);
        };
        const handleCancel = () => {
            confirmOverlay.classList.add("hidden");
            confirmBtnOk.removeEventListener("click", handleOk);
            confirmBtnCancel.removeEventListener("click", handleCancel);
            resolve(false);
        };
        confirmBtnOk.addEventListener("click", handleOk);
        confirmBtnCancel.addEventListener("click", handleCancel);
    });
}

function abrirModalOficina(titulo, datos = {}) {
    return new Promise(resolve => {
        modalTitulo.textContent   = titulo;
        modalEntidad.value        = datos.entidad  || "";
        modalUnidad.value         = datos.unidad   || "";
        modalDescrip.value        = datos.descrip  || "";
        modalCiudad.value         = datos.ciudad   || "";
        modalOverlay.classList.remove("hidden");
        modalUnidad.readOnly      = !!datos.unidad;

        const cleanup = () => {
            modalOverlay.classList.add("hidden");
            modalBtnGuardar.removeEventListener("click", handleGuardar);
            modalBtnCancelar.removeEventListener("click", handleCancelar);
            modalBtnCerrar.removeEventListener("click", handleCancelar);
        };
        const handleGuardar = () => {
            const result = {
                entidad: modalEntidad.value.trim(),
                unidad : modalUnidad.value.trim(),
                descrip: modalDescrip.value.trim(),
                ciudad : modalCiudad.value.trim()
            };
            if (!result.descrip) {
                mostrarAlerta("La descripción es obligatoria.", "Validación");
                return;
            }
            cleanup();
            resolve(result);
        };
        const handleCancelar = () => {
            cleanup();
            resolve(null);
        };
        modalBtnGuardar.addEventListener("click", handleGuardar);
        modalBtnCancelar.addEventListener("click", handleCancelar);
        modalBtnCerrar.addEventListener("click", handleCancelar);
    });
}

async function cargarEstados() {
    try {
        const response = await fetch(API_ESTADOS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        estados = await response.json();
    } catch (error) {
        console.error("Error al cargar estados:", error);
        estados = [
            { codestado: 1, nomestado: "ACTIVO"   },
            { codestado: 2, nomestado: "INACTIVO"  }
        ];
    }
}

async function cargarOficinas() {
    try {
        await cargarEstados();
        const response = await fetch(API_OFICINAS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawData = await response.json();

        oficinas = rawData.map(item => ({
            idOficina    : String(item.unidad),
            nombreOficina: item.descrip || "UNIDAD ADMINISTRATIVA",
            observacion  : item.ciudad  || "",
            entidad      : String(item.entidad || ""),
            idEstado     : 1
        }));

        inicializarSelector();
    } catch (error) {
        console.error("Error al cargar oficinas:", error);
        mostrarAlerta("No se pudo conectar con la API de oficinas.", "Error de conexión");
        oficinas = [];
        inicializarSelector();
    }
}

function inicializarSelector() {
    selectOficina.innerHTML = "";
    oficinas.forEach(oficina => {
        const opt = document.createElement("option");
        opt.value       = oficina.idOficina;
        opt.textContent = oficina.nombreOficina;
        selectOficina.appendChild(opt);
    });

    if (oficinas.length > 0) {
        selectOficina.value = oficinas[0].idOficina;
        renderizarDatosOficina(oficinas[0].idOficina);
    }
}

function renderizarDatosOficina(idOficina) {
    const data = oficinas.find(o => o.idOficina === idOficina);
    if (!data) return;

    inputId.value         = data.idOficina;
    txtObservacion.value  = data.observacion || "";
    const nombreEstado    = getNombreEstado(data.idEstado);
    statusLabel.textContent = nombreEstado;
    actualizarEstiloEstado(nombreEstado);

    cargarResponsables(idOficina);
}

function actualizarEstiloEstado(nombreEstado) {
    if (nombreEstado === "INACTIVO") {
        statusLabel.style.color      = "#b22222";
        statusLabel.style.fontWeight = "bold";
        btnSideActivar.disabled      = false;
        btnSideInactivar.disabled    = true;
        btnFooterActivar.disabled    = false;
        btnFooterInactivar.disabled  = true;
        btnFooterActivar.classList.remove("disabled");
        btnFooterInactivar.classList.add("disabled");
    } else {
        statusLabel.style.color      = "#008000";
        statusLabel.style.fontWeight = "bold";
        btnSideActivar.disabled      = true;
        btnSideInactivar.disabled    = false;
        btnFooterActivar.disabled    = true;
        btnFooterInactivar.disabled  = false;
        btnFooterActivar.classList.add("disabled");
        btnFooterInactivar.classList.remove("disabled");
    }
}

function getNombreEstado(idEstado) {
    const estado = estados.find(e => e.codestado === idEstado);
    return estado ? estado.nomestado : "DESCONOCIDO";
}

function getIdEstado(nombreEstado) {
    const estado = estados.find(e => e.nomestado === nombreEstado);
    return estado ? estado.codestado : 1;
}

async function cargarResponsables(idOficina) {
    try {
        const response = await fetch(`${API_OFICINAS}/${idOficina}/responsables`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const responsables = await response.json();
        renderizarTablaResponsables(responsables);
    } catch (error) {
        console.info("Sin responsables en API, tabla vacía.");
        renderizarTablaResponsables([]);
    }
}

function renderizarTablaResponsables(responsables) {
    const tbody = document.getElementById("tabla-responsables");
    tbody.innerHTML = "";
    const FILAS_MIN = 9;

    responsables.forEach(resp => {
        const tr = document.createElement("tr");
        const nombreEstado = getNombreEstado(resp.idEstado);
        tr.innerHTML = `
            <td class="center">${resp.codResponsable || ""}</td>
            <td>${resp.nombreCompleto || ""}</td>
            <td>${resp.cargo || ""}</td>
            <td>${resp.ci || ""}</td>
            <td>${resp.expedido || ""}</td>
            <td class="center">${nombreEstado}</td>
        `;
        tbody.appendChild(tr);
    });

    const filasVacias = FILAS_MIN - responsables.length;
    for (let i = 0; i < filasVacias; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td></td>`;
        tbody.appendChild(tr);
    }
}

async function nuevoOficina() {
    const datos = await abrirModalOficina("NUEVA OFICINA");
    if (!datos) return;   // Canceló

    const payload = {
        entidad: parseInt(datos.entidad) || 1,
        unidad : parseInt(datos.unidad)  || 0,
        descrip: datos.descrip,
        ciudad : datos.ciudad
    };

    try {
        const response = await fetch(API_OFICINAS, {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        await mostrarAlerta("Oficina creada exitosamente.", "Éxito");
        await cargarOficinas();
    } catch (error) {
        console.error("Error al crear oficina:", error);
        const nuevaOficina = {
            idOficina    : datos.unidad || String(Date.now()),
            nombreOficina: datos.descrip,
            observacion  : datos.ciudad,
            entidad      : datos.entidad,
            idEstado     : 1
        };
        oficinas.push(nuevaOficina);
        inicializarSelector();
        await mostrarAlerta("Guardado localmente (API no disponible).", "Advertencia");
    }
}

async function modificarOficina() {
    const idSeleccionado = selectOficina.value;
    const actual = oficinas.find(o => o.idOficina === idSeleccionado);
    if (!actual) return;

    const datos = await abrirModalOficina("MODIFICAR OFICINA", {
        entidad: actual.entidad,
        unidad : actual.idOficina,
        descrip: actual.nombreOficina,
        ciudad : actual.observacion
    });
    if (!datos) return;

    const payload = {
        entidad: parseInt(datos.entidad) || 1,
        unidad : parseInt(idSeleccionado),
        descrip: datos.descrip,
        ciudad : datos.ciudad
    };

    try {
        const response = await fetch(`${API_OFICINAS}/${idSeleccionado}`, {
            method : "PUT",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        await mostrarAlerta("Oficina actualizada exitosamente.", "Éxito");
        await cargarOficinas();
        selectOficina.value = idSeleccionado;
        renderizarDatosOficina(idSeleccionado);
    } catch (error) {
        console.error("Error al modificar oficina:", error);
        // Actualizar localmente
        const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
        if (index >= 0) {
            oficinas[index].nombreOficina = datos.descrip;
            oficinas[index].observacion   = datos.ciudad;
        }
        inicializarSelector();
        selectOficina.value = idSeleccionado;
        renderizarDatosOficina(idSeleccionado);
        await mostrarAlerta("Guardado localmente (API no disponible).", "Advertencia");
    }
}

async function activarOficina() {
    const idSeleccionado = selectOficina.value;
    try {
        const response = await fetch(`${API_OFICINAS}/${idSeleccionado}/estado`, {
            method : "PATCH",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify({ idEstado: getIdEstado("ACTIVO") })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
        console.error("Error al activar:", error);
    }
    const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
    if (index >= 0) oficinas[index].idEstado = getIdEstado("ACTIVO");
    renderizarDatosOficina(idSeleccionado);
    await mostrarAlerta("Oficina activada.", "Información");
}

async function inactivarOficina() {
    const confirmado = await mostrarConfirm("¿Está seguro de inactivar esta oficina?", "Confirmación");
    if (!confirmado) return;

    const idSeleccionado = selectOficina.value;
    try {
        const response = await fetch(`${API_OFICINAS}/${idSeleccionado}/estado`, {
            method : "PATCH",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify({ idEstado: getIdEstado("INACTIVO") })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
        console.error("Error al inactivar:", error);
    }
    const index = oficinas.findIndex(o => o.idOficina === idSeleccionado);
    if (index >= 0) oficinas[index].idEstado = getIdEstado("INACTIVO");
    renderizarDatosOficina(idSeleccionado);
    await mostrarAlerta("Oficina inactivada.", "Información");
}

async function salir() {
    if (modoEdicion) {
        const confirmado = await mostrarConfirm("Hay cambios sin guardar. ¿Desea salir?", "Salir");
        if (!confirmado) return;
    }
    if (window.parent !== window) {
        window.parent.postMessage({ type: "close-modal" }, "*");
    } else {
        window.close();
    }
}

function activarModoEdicion(esNuevo = false) {
    modoEdicion = true;
    if (esNuevo) {
        oficinaOriginal = null;
    } else {
        officinaOriginal = oficinas.find(o => o.idOficina === selectOficina.value);
    }

    btnSideNuevo.disabled     = true;
    btnSideModificar.disabled = true;
    btnFooterNuevo.disabled   = true;
    btnFooterModificar.disabled = true;
    btnFooterGuardar.disabled = false;
    btnFooterGuardar.classList.remove("disabled");
    btnFooterDeshacer.disabled = false;
    btnFooterDeshacer.classList.remove("disabled");
    txtObservacion.readOnly = false;
}

function restaurarEstado() {
    modoEdicion     = false;
    oficinaOriginal = null;

    btnSideNuevo.disabled       = false;
    btnSideModificar.disabled   = false;
    btnFooterNuevo.disabled     = false;
    btnFooterModificar.disabled = false;
    btnFooterGuardar.disabled   = true;
    btnFooterGuardar.classList.add("disabled");
    btnFooterDeshacer.disabled  = true;
    btnFooterDeshacer.classList.add("disabled");
    txtObservacion.readOnly     = true;

    const nombreEstado = statusLabel.textContent;
    actualizarEstiloEstado(nombreEstado);
}

function deshacer() {
    restaurarEstado();
    if (selectOficina.value) {
        renderizarDatosOficina(selectOficina.value);
    }
}

selectOficina.addEventListener("change", function () {
    renderizarDatosOficina(this.value);
});

btnSideNuevo.addEventListener    ("click", nuevoOficina);
btnSideModificar.addEventListener("click", modificarOficina);
btnSideActivar.addEventListener  ("click", activarOficina);
btnSideInactivar.addEventListener("click", inactivarOficina);

btnFooterActivar.addEventListener  ("click", activarOficina);
btnFooterInactivar.addEventListener("click", inactivarOficina);
btnFooterNuevo.addEventListener    ("click", nuevoOficina);
btnFooterModificar.addEventListener("click", modificarOficina);
btnFooterGuardar.addEventListener  ("click", modificarOficina);
btnFooterDeshacer.addEventListener ("click", deshacer);
btnSalir.addEventListener          ("click", salir);

document.addEventListener("DOMContentLoaded", cargarOficinas);