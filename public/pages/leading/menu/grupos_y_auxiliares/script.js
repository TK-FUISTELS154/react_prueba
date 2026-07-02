const API_BASE_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_GRUPOS   = `${API_BASE_URL}/api/objgasto`;

const selectNombre    = document.getElementById("select-nombre");
const inputGrupo      = document.getElementById("input-grupo");
const inputVidaUtil   = document.getElementById("input-vida-util");
const txtObservaciones = document.getElementById("txt-observaciones");
const chkDeprecia     = document.getElementById("chk-deprecia");
const chkActualiza    = document.getElementById("chk-actualiza");
const tableBody       = document.querySelector(".table-container tbody");

const btnNuevo     = document.getElementById("btn-nuevo");
const btnModificar = document.getElementById("btn-modificar");
const btnGuardar   = document.getElementById("btn-guardar");
const btnEliminar  = document.getElementById("btn-eliminar");
const btnDeshacer  = document.getElementById("btn-deshacer");
const btnSalir     = document.getElementById("btn-salir");

let gruposContables = [];
let modoEdicion     = false;
let esNuevo         = false;
let posicionEdicion = -1;
let snapshotAnterior = null;

function mostrarError(msg)  { mostrarModal("Error", msg, "error"); }
function mostrarExito(msg)  { mostrarModal("Éxito", msg, "exito"); }

function mostrarModal(titulo, mensaje, tipo) {
    const overlay = document.getElementById("modal-overlay");
    const tituloEl = document.getElementById("modal-titulo");
    const mensajeEl = document.getElementById("modal-mensaje");
    const iconoEl = document.getElementById("modal-icono");

    tituloEl.textContent = titulo;
    mensajeEl.textContent = mensaje;
    iconoEl.textContent = tipo === "error" ? "✖" : "✔";
    iconoEl.className = tipo === "error" ? "modal-icono error" : "modal-icono exito";
    overlay.style.display = "flex";
}

function mostrarConfirm(mensaje, callback) {
    const overlay = document.getElementById("confirm-overlay");
    document.getElementById("confirm-mensaje").textContent = mensaje;
    overlay.style.display = "flex";
    overlay.dataset.pendiente = "1";
    window._confirmCallback = callback;
}

function mostrarCarga(visible) {
    document.getElementById("loading-overlay").style.display = visible ? "flex" : "none";
}

async function cargarGrupos() {
    mostrarCarga(true);
    try {
        const resp = await fetch(API_GRUPOS);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const rawData = await resp.json();

        gruposContables = rawData.map((item, idx) => ({
            _pos:         idx,
            gestion:      item.gestion ?? 0,
            partida:      item.partida ?? "",
            descrip:      item.descrip ?? "(sin descripción)",
            vidaUtil:     10,
            deprecia:     true,
            actualiza:    true,
            observaciones: ""
        }));

        poblarSelector();
    } catch (err) {
        console.error("Error cargarGrupos:", err);
        mostrarError("No se pudo conectar con la API. Verifique la conexión.");
        gruposContables = [];
        poblarSelector();
    } finally {
        mostrarCarga(false);
    }
}

function poblarSelector() {
    selectNombre.innerHTML = "";
    if (gruposContables.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "(sin registros)";
        selectNombre.appendChild(opt);
        limpiarCampos();
        return;
    }
    gruposContables.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item._pos;
        opt.textContent = item.descrip;
        selectNombre.appendChild(opt);
    });
    selectNombre.value = gruposContables[0]._pos;
    mostrarGrupo(gruposContables[0]);
    poblarTabla(gruposContables[0]);
}

function mostrarGrupo(item) {
    if (!item) { limpiarCampos(); return; }
    inputGrupo.value      = item.gestion;
    inputVidaUtil.value   = item.vidaUtil;
    txtObservaciones.value = item.observaciones || "";
    chkDeprecia.checked   = item.deprecia;
    chkActualiza.checked  = item.actualiza;
    poblarTabla(item);
}

function limpiarCampos() {
    inputGrupo.value      = "";
    inputVidaUtil.value   = "";
    txtObservaciones.value = "";
    chkDeprecia.checked   = true;
    chkActualiza.checked  = true;
    limpiarTabla();
}

function poblarTabla(itemSeleccionado) {
    tableBody.innerHTML = "";

    if (gruposContables.length === 0) {
        limpiarTabla();
        return;
    }

    gruposContables.forEach((item) => {
        const tr = document.createElement("tr");
        const esActivo = itemSeleccionado && item._pos === itemSeleccionado._pos;
        if (esActivo) tr.classList.add("fila-seleccionada");

        tr.innerHTML = `<td style="text-align:center;">${item.gestion ?? ""}</td><td>${item.descrip ?? ""}</td>`;

        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => {
            if (modoEdicion) return;
            selectNombre.value = item._pos;
            mostrarGrupo(item);
        });

        tableBody.appendChild(tr);
    });
}

function limpiarTabla() {
    tableBody.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        tableBody.innerHTML += "<tr><td></td><td></td></tr>";
    }
}

selectNombre.addEventListener("change", function () {
    if (modoEdicion) return;
    const pos = parseInt(this.value);
    const item = gruposContables.find(g => g._pos === pos);
    mostrarGrupo(item);
});

function nuevoGrupo() {
    modoEdicion  = true;
    esNuevo      = true;
    posicionEdicion = -1;
    snapshotAnterior = null;

    const maxGestion = gruposContables.length > 0
        ? Math.max(...gruposContables.map(g => Number(g.gestion) || 0))
        : 0;

    inputGrupo.value      = maxGestion + 1;
    inputVidaUtil.value   = "";
    txtObservaciones.value = "";
    chkDeprecia.checked   = true;
    chkActualiza.checked  = true;
    selectNombre.value    = "";
    limpiarTabla();

    setEstadoBotones("edicion");
    setInputsEditables(true);
    inputVidaUtil.focus();
}

function modificarGrupo() {
    const pos = parseInt(selectNombre.value);
    const item = gruposContables.find(g => g._pos === pos);
    if (!item) { mostrarError("Seleccione un registro para modificar."); return; }

    modoEdicion      = true;
    esNuevo          = false;
    posicionEdicion  = pos;
    snapshotAnterior = { ...item };

    setEstadoBotones("edicion");
    setInputsEditables(true);
    inputVidaUtil.focus();
}

async function guardarGrupo() {
    const gestionVal = parseInt(inputGrupo.value);
    const vidaUtilVal = parseInt(inputVidaUtil.value);
    const descripVal  = selectNombre.options[selectNombre.selectedIndex]?.textContent?.trim()
                        || "NUEVO GRUPO";

    if (!inputGrupo.value.trim()) {
        mostrarError("El campo Grupo es obligatorio."); return;
    }

    const payload = {
        gestion: gestionVal,
        partida: gestionVal.toString(),
        descrip: descripVal
    };

    mostrarCarga(true);
    try {
        if (esNuevo) {
            const resp = await fetch(API_GRUPOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            await cargarGrupos();
            if (gruposContables.length > 0) {
                const ultimo = gruposContables[gruposContables.length - 1];
                selectNombre.value = ultimo._pos;
                mostrarGrupo(ultimo);
            }
            mostrarExito("Grupo creado exitosamente.");
        } else {
            const resp = await fetch(`${API_GRUPOS}/${posicionEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const idx = gruposContables.findIndex(g => g._pos === posicionEdicion);
            if (idx >= 0) {
                gruposContables[idx] = {
                    ...gruposContables[idx],
                    gestion: gestionVal,
                    partida: gestionVal.toString(),
                    descrip: descripVal,
                    vidaUtil: isNaN(vidaUtilVal) ? 10 : vidaUtilVal,
                    deprecia: chkDeprecia.checked,
                    actualiza: chkActualiza.checked,
                    observaciones: txtObservaciones.value
                };
                poblarSelector();
                selectNombre.value = posicionEdicion;
                mostrarGrupo(gruposContables[idx]);
            }
            mostrarExito("Grupo actualizado exitosamente.");
        }
        restaurarEstado();
    } catch (err) {
        console.error("Error guardar:", err);
        mostrarError(`No se pudo guardar. ${err.message}`);
    } finally {
        mostrarCarga(false);
    }
}

function eliminarGrupo() {
    const pos = parseInt(selectNombre.value);
    if (isNaN(pos)) { mostrarError("Seleccione un registro para eliminar."); return; }
    const item = gruposContables.find(g => g._pos === pos);
    if (!item) { mostrarError("Registro no encontrado."); return; }

    mostrarConfirm(`¿Está seguro de eliminar "${item.descrip}"?`, async () => {
        mostrarCarga(true);
        try {
            const resp = await fetch(`${API_GRUPOS}/${pos}`, { method: "DELETE" });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            await cargarGrupos();
            mostrarExito("Grupo eliminado exitosamente.");
        } catch (err) {
            console.error("Error eliminar:", err);
            mostrarError(`No se pudo eliminar. ${err.message}`);
        } finally {
            mostrarCarga(false);
        }
    });
}

function deshacer() {
    if (snapshotAnterior) {
        mostrarGrupo(snapshotAnterior);
        selectNombre.value = snapshotAnterior._pos;
    } else {
        limpiarCampos();
    }
    restaurarEstado();
}

function salir() {
    const cerrar = () => {
        if (window.parent !== window) {
            window.parent.postMessage({ type: "close-modal" }, "*");
        } else {
            window.close();
        }
    };
    if (modoEdicion) {
        mostrarConfirm("Hay cambios sin guardar. ¿Desea salir de todos modos?", cerrar);
    } else {
        cerrar();
    }
}

function setEstadoBotones(estado) {
    const enEdicion = estado === "edicion";
    btnNuevo.disabled     = enEdicion;
    btnModificar.disabled = enEdicion;
    btnGuardar.disabled   = !enEdicion;
    btnEliminar.disabled  = enEdicion;
    btnDeshacer.disabled  = !enEdicion;

    btnGuardar.classList.toggle("disabled", !enEdicion);
    btnDeshacer.classList.toggle("disabled", !enEdicion);
    btnNuevo.classList.toggle("disabled", enEdicion);
    btnModificar.classList.toggle("disabled", enEdicion);
    btnEliminar.classList.toggle("disabled", enEdicion);
}

function setInputsEditables(editable) {
    inputVidaUtil.readOnly    = !editable;
    txtObservaciones.readOnly = !editable;
    chkDeprecia.disabled      = !editable;
    chkActualiza.disabled     = !editable;
}

function restaurarEstado() {
    modoEdicion      = false;
    esNuevo          = false;
    posicionEdicion  = -1;
    snapshotAnterior = null;
    setEstadoBotones("normal");
    setInputsEditables(false);
}

btnNuevo.addEventListener("click",     nuevoGrupo);
btnModificar.addEventListener("click", modificarGrupo);
btnGuardar.addEventListener("click",   guardarGrupo);
btnEliminar.addEventListener("click",  eliminarGrupo);
btnDeshacer.addEventListener("click",  deshacer);
btnSalir.addEventListener("click",     salir);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("modal-ok").addEventListener("click", () => {
        document.getElementById("modal-overlay").style.display = "none";
    });
    document.getElementById("confirm-si").addEventListener("click", () => {
        document.getElementById("confirm-overlay").style.display = "none";
        if (typeof window._confirmCallback === "function") {
            window._confirmCallback();
            window._confirmCallback = null;
        }
    });
    document.getElementById("confirm-no").addEventListener("click", () => {
        document.getElementById("confirm-overlay").style.display = "none";
        window._confirmCallback = null;
    });

    restaurarEstado();
    cargarGrupos();
});