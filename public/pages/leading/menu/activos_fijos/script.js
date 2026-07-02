// ============================================================
// SISTEMA VSIAF - Unidad Administrativa
// API: https://fuerza-g-grupo-1-uy0x.onrender.com
// Endpoint: /unidadadmin
// Schema: { entidad: int64, unidad: int64, descrip: string, ciudad: string }
// ============================================================

const API_BASE    = "https://fuerza-g-grupo-1-uy0x.onrender.com";
const API_URL     = `${API_BASE}/unidadadmin`;

// ── DOM Referencias ──
const tablaBody       = document.getElementById("tabla-body");
const btnNuevo        = document.getElementById("btn-nuevo");
const btnEditar       = document.getElementById("btn-editar");
const btnEliminar     = document.getElementById("btn-eliminar");
const btnSeleccionar  = document.getElementById("btn-seleccionar");
const btnSalir        = document.getElementById("btn-salir");

// Modal Form
const modalForm       = document.getElementById("modal-form");
const modalFormTitulo = document.getElementById("modal-form-titulo");
const modalFormCerrar = document.getElementById("modal-form-cerrar");
const modalFormGuardar= document.getElementById("modal-form-guardar");
const modalFormCancelar=document.getElementById("modal-form-cancelar");
const fEntidad        = document.getElementById("f-entidad");
const fUnidad         = document.getElementById("f-unidad");
const fDescrip        = document.getElementById("f-descrip");
const fCiudad         = document.getElementById("f-ciudad");

// Modal Confirm
const modalConfirm    = document.getElementById("modal-confirm");
const confirmTitulo   = document.getElementById("modal-confirm-titulo");
const confirmMsg      = document.getElementById("modal-confirm-msg");
const confirmOk       = document.getElementById("modal-confirm-ok");
const confirmCancel   = document.getElementById("modal-confirm-cancel");

// Modal Alert
const modalAlert      = document.getElementById("modal-alert");
const alertTitulo     = document.getElementById("modal-alert-titulo");
const alertIcon       = document.getElementById("modal-alert-icon");
const alertMsg        = document.getElementById("modal-alert-msg");
const alertOk         = document.getElementById("modal-alert-ok");

// ── Estado global ──
let datos       = [];   // array de { entidad, unidad, descrip, ciudad }
let filaSelec   = null; // objeto seleccionado actualmente

// ============================================================
// UTILIDADES DE POPUP
// ============================================================

function mostrarAlerta(mensaje, titulo = "Información", tipo = "info") {
    return new Promise(resolve => {
        alertTitulo.textContent = titulo;
        alertMsg.textContent    = mensaje;
        alertIcon.textContent   = tipo === "error" ? "❌" : tipo === "ok" ? "✅" : "ℹ️";
        modalAlert.classList.remove("hidden");
        const handler = () => {
            modalAlert.classList.add("hidden");
            alertOk.removeEventListener("click", handler);
            resolve();
        };
        alertOk.addEventListener("click", handler);
    });
}

function mostrarConfirm(mensaje, titulo = "Confirmación") {
    return new Promise(resolve => {
        confirmTitulo.textContent = titulo;
        confirmMsg.textContent    = mensaje;
        modalConfirm.classList.remove("hidden");
        const handleOk = () => {
            modalConfirm.classList.add("hidden");
            confirmOk.removeEventListener("click", handleOk);
            confirmCancel.removeEventListener("click", handleCancel);
            resolve(true);
        };
        const handleCancel = () => {
            modalConfirm.classList.add("hidden");
            confirmOk.removeEventListener("click", handleOk);
            confirmCancel.removeEventListener("click", handleCancel);
            resolve(false);
        };
        confirmOk.addEventListener("click", handleOk);
        confirmCancel.addEventListener("click", handleCancel);
    });
}

function abrirModalForm(titulo, valores = {}, unidadReadOnly = false) {
    return new Promise(resolve => {
        modalFormTitulo.textContent = titulo;
        fEntidad.value  = valores.entidad ?? "";
        fUnidad.value   = valores.unidad  ?? "";
        fDescrip.value  = valores.descrip ?? "";
        fCiudad.value   = valores.ciudad  ?? "";
        fUnidad.readOnly = unidadReadOnly;
        fUnidad.style.backgroundColor = unidadReadOnly ? "#e8e8e8" : "#ffffe1";

        modalForm.classList.remove("hidden");
        fDescrip.focus();

        const cleanup = () => {
            modalForm.classList.add("hidden");
            modalFormGuardar.removeEventListener("click", handleGuardar);
            modalFormCancelar.removeEventListener("click", handleCancelar);
            modalFormCerrar.removeEventListener("click", handleCancelar);
        };

        const handleGuardar = async () => {
            const entidad = parseInt(fEntidad.value);
            const unidad  = parseInt(fUnidad.value);
            const descrip = fDescrip.value.trim().toUpperCase();
            const ciudad  = fCiudad.value.trim().toUpperCase();

            if (!entidad || entidad < 1) {
                await mostrarAlerta("Ingrese un número de entidad válido.", "Validación", "error");
                fEntidad.focus();
                return;
            }
            if (!unidad || unidad < 1) {
                await mostrarAlerta("Ingrese un número de unidad válido.", "Validación", "error");
                fUnidad.focus();
                return;
            }
            if (!descrip) {
                await mostrarAlerta("La descripción es obligatoria.", "Validación", "error");
                fDescrip.focus();
                return;
            }
            if (!ciudad) {
                await mostrarAlerta("La ciudad es obligatoria.", "Validación", "error");
                fCiudad.focus();
                return;
            }

            cleanup();
            resolve({ entidad, unidad, descrip, ciudad });
        };

        const handleCancelar = () => {
            cleanup();
            resolve(null);
        };

        modalFormGuardar.addEventListener("click", handleGuardar);
        modalFormCancelar.addEventListener("click", handleCancelar);
        modalFormCerrar.addEventListener("click", handleCancelar);
    });
}

// ============================================================
// RENDERIZADO DE TABLA
// ============================================================

const FILAS_MIN = 10;

function renderizarTabla() {
    tablaBody.innerHTML = "";

    if (datos.length === 0) {
        const tr = document.createElement("tr");
        tr.className = "empty-row";
        tr.innerHTML = `<td colspan="3" style="text-align:center;color:#888;font-style:italic;padding:12px;">Sin registros disponibles</td>`;
        tablaBody.appendChild(tr);
        return;
    }

    datos.forEach(item => {
        const tr = document.createElement("tr");
        const unidadFmt = String(item.unidad).padStart(3, "0");

        tr.innerHTML = `
            <td>${unidadFmt}</td>
            <td>${item.descrip || ""}</td>
            <td>${item.ciudad  || ""}</td>
        `;

        // Marcar seleccionada
        if (filaSelec && filaSelec.unidad === item.unidad && filaSelec.entidad === item.entidad) {
            tr.classList.add("selected-row");
        }

        tr.addEventListener("click", () => seleccionarFila(tr, item));
        tablaBody.appendChild(tr);
    });

    // Rellenar filas vacías
    const extras = FILAS_MIN - datos.length;
    for (let i = 0; i < extras; i++) {
        const tr = document.createElement("tr");
        tr.className = "empty-row";
        tr.innerHTML = `<td></td><td></td><td></td>`;
        tablaBody.appendChild(tr);
    }
}

function seleccionarFila(trEl, item) {
    // Quitar selección anterior
    tablaBody.querySelectorAll("tr.selected-row").forEach(r => r.classList.remove("selected-row"));
    trEl.classList.add("selected-row");
    filaSelec = item;
    actualizarBotones(true);
}

function actualizarBotones(haySeleccion) {
    btnEditar.disabled      = !haySeleccion;
    btnEliminar.disabled    = !haySeleccion;
    btnSeleccionar.disabled = !haySeleccion;
}

// ============================================================
// LLAMADAS A LA API
// ============================================================

async function cargarDatos() {
    tablaBody.innerHTML = `<tr class="empty-row"><td colspan="3" style="text-align:center;color:#888;font-style:italic;padding:12px;">Cargando...</td></tr>`;
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        datos = await res.json();
        // Normalizar: la API retorna array de { entidad, unidad, descrip, ciudad }
        datos = datos.map(d => ({
            entidad: d.entidad,
            unidad : d.unidad,
            descrip: d.descrip || "",
            ciudad : d.ciudad  || ""
        }));
        filaSelec = null;
        actualizarBotones(false);
        renderizarTabla();
    } catch (err) {
        console.error("Error al cargar:", err);
        tablaBody.innerHTML = `<tr class="empty-row"><td colspan="3" style="text-align:center;color:#c00;padding:12px;">Error al conectar con la API. Verifique la conexión.</td></tr>`;
    }
}

async function crearUnidad(payload) {
    const res = await fetch(API_URL, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload)
    });
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ": " + txt : ""}`);
    }
    return res.json().catch(() => payload);
}

async function actualizarUnidad(unidad, payload) {
    const res = await fetch(`${API_URL}/${unidad}`, {
        method : "PUT",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload)
    });
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ": " + txt : ""}`);
    }
    return res.json().catch(() => payload);
}

async function eliminarUnidad(unidad) {
    const res = await fetch(`${API_URL}/${unidad}`, {
        method: "DELETE"
    });
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ": " + txt : ""}`);
    }
}

// ============================================================
// ACCIONES DE BOTONES
// ============================================================

btnNuevo.addEventListener("click", async () => {
    const datos_form = await abrirModalForm("NUEVA UNIDAD ADMINISTRATIVA", {}, false);
    if (!datos_form) return;

    // Verificar que la unidad no exista ya
    const existe = datos.find(d => d.unidad === datos_form.unidad && d.entidad === datos_form.entidad);
    if (existe) {
        await mostrarAlerta(
            `La unidad ${datos_form.unidad} ya existe para la entidad ${datos_form.entidad}.`,
            "Registro duplicado", "error"
        );
        return;
    }

    try {
        await crearUnidad(datos_form);
        await mostrarAlerta("Unidad administrativa registrada exitosamente.", "Éxito", "ok");
        filaSelec = null;
        actualizarBotones(false);
        await cargarDatos();
    } catch (err) {
        console.error("Error al crear:", err);
        await mostrarAlerta(`No se pudo registrar la unidad.\n${err.message}`, "Error", "error");
    }
});

btnEditar.addEventListener("click", async () => {
    if (!filaSelec) return;

    const datos_form = await abrirModalForm(
        "EDITAR UNIDAD ADMINISTRATIVA",
        {
            entidad: filaSelec.entidad,
            unidad : filaSelec.unidad,
            descrip: filaSelec.descrip,
            ciudad : filaSelec.ciudad
        },
        true  // unidad es read-only al editar (es la PK)
    );
    if (!datos_form) return;

    const payload = {
        entidad: datos_form.entidad,
        unidad : filaSelec.unidad,   // no cambia la PK
        descrip: datos_form.descrip,
        ciudad : datos_form.ciudad
    };

    try {
        await actualizarUnidad(filaSelec.unidad, payload);
        await mostrarAlerta("Unidad administrativa actualizada exitosamente.", "Éxito", "ok");
        filaSelec = null;
        actualizarBotones(false);
        await cargarDatos();
    } catch (err) {
        console.error("Error al actualizar:", err);
        await mostrarAlerta(`No se pudo actualizar la unidad.\n${err.message}`, "Error", "error");
    }
});

btnEliminar.addEventListener("click", async () => {
    if (!filaSelec) return;

    const unidadFmt = String(filaSelec.unidad).padStart(3, "0");
    const confirmado = await mostrarConfirm(
        `¿Está seguro de eliminar la unidad ${unidadFmt} "${filaSelec.descrip}"?\n\nEsta acción no se puede deshacer.`,
        "Confirmar eliminación"
    );
    if (!confirmado) return;

    try {
        await eliminarUnidad(filaSelec.unidad);
        await mostrarAlerta("Unidad administrativa eliminada correctamente.", "Éxito", "ok");
        filaSelec = null;
        actualizarBotones(false);
        await cargarDatos();
    } catch (err) {
        console.error("Error al eliminar:", err);
        await mostrarAlerta(`No se pudo eliminar la unidad.\n${err.message}`, "Error", "error");
    }
});

btnSeleccionar.addEventListener("click", () => {
    if (!filaSelec) return;
    // Enviar la selección al iframe padre si existe
    if (window.parent !== window) {
        window.parent.postMessage(
            { type: "unidad-seleccionada", data: filaSelec },
            "*"
        );
    }
});

btnSalir.addEventListener("click", () => {
    if (window.parent !== window) {
        window.parent.postMessage({ type: "close-modal" }, "*");
    } else {
        window.close();
    }
});

// ── Arranque ──
document.addEventListener("DOMContentLoaded", cargarDatos);