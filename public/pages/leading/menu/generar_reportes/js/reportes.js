const API_BASE = "https://fuerza-g-grupo-1-uy0x.onrender.com"; 

const MESES_FALLBACK = [
  { id: "1",  mes: "Enero" },
  { id: "2",  mes: "Febrero" },
  { id: "3",  mes: "Marzo" },
  { id: "4",  mes: "Abril" },
  { id: "5",  mes: "Mayo" },
  { id: "6",  mes: "Junio" },
  { id: "7",  mes: "Julio" },
  { id: "8",  mes: "Agosto" },
  { id: "9",  mes: "Septiembre" },
  { id: "10", mes: "Octubre" },
  { id: "11", mes: "Noviembre" },
  { id: "12", mes: "Diciembre" },
];
 
async function fetchMeses() {
  try {
    const res = await fetch(`${API_BASE}/api/mes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : MESES_FALLBACK;
  } catch (err) {
    console.warn("API no disponible, usando datos locales:", err.message);
    return MESES_FALLBACK;
  }
}
 
function inyectarEstilos() {
  if (document.getElementById("estilos-modal-meses")) return;
 
  const style = document.createElement("style");
  style.id = "estilos-modal-meses";
  style.textContent = `
    /* Overlay */
    #modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
 
    /* Ventana */
    #modal-meses {
      background: #f0f0f0;
      border: 2px solid #7a7a7a;
      border-radius: 4px;
      width: 420px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 4px 12px rgba(0,0,0,0.35);
      animation: slideIn 0.18s ease;
      font-family: 'Courier New', Courier, monospace;
    }
    @keyframes slideIn { from { transform: translateY(-16px); opacity:0 } to { transform: translateY(0); opacity:1 } }
 
    /* Header del modal */
    #modal-meses .modal-header {
      background: #003366;
      color: #fff;
      padding: 7px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    #modal-meses .modal-header button {
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
    }
    #modal-meses .modal-header button:hover { color: #ffcc00; }
 
    /* Cuerpo */
    #modal-meses .modal-body {
      padding: 12px;
      overflow-y: auto;
    }
 
    /* Tabla */
    #tabla-meses {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    #tabla-meses thead tr {
      background: #003366;
      color: #fff;
    }
    #tabla-meses th {
      padding: 7px 10px;
      text-align: left;
      font-weight: bold;
      letter-spacing: 0.3px;
    }
    #tabla-meses tbody tr:nth-child(even) { background: #e0e8f0; }
    #tabla-meses tbody tr:nth-child(odd)  { background: #f7f7f7; }
    #tabla-meses tbody tr:hover           { background: #cce0ff; }
    #tabla-meses td {
      padding: 6px 10px;
      border-bottom: 1px solid #c8c8c8;
    }
 
    /* Botones acción */
    .btn-editar, .btn-eliminar {
      padding: 3px 10px;
      font-size: 12px;
      font-family: inherit;
      border: 1px solid;
      border-radius: 3px;
      cursor: pointer;
      font-weight: bold;
      transition: opacity 0.15s;
    }
    .btn-editar  { background: #0055aa; color: #fff; border-color: #003a80; margin-right: 5px; }
    .btn-eliminar{ background: #cc2200; color: #fff; border-color: #991a00; }
    .btn-editar:hover, .btn-eliminar:hover { opacity: 0.82; }
 
    /* Estado vacío */
    .tabla-vacia { text-align: center; color: #666; padding: 18px 0; font-size: 13px; }
 
    /* Footer del modal */
    #modal-meses .modal-footer {
      padding: 8px 12px;
      text-align: right;
      border-top: 1px solid #c0c0c0;
      background: #e0e0e0;
    }
    #modal-meses .modal-footer button {
      background: #003366;
      color: #fff;
      border: 1px solid #002244;
      padding: 4px 18px;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      border-radius: 3px;
    }
    #modal-meses .modal-footer button:hover { background: #0055aa; }
  `;
  document.head.appendChild(style);
}
 
function construirTabla(meses) {
  const tbody = document.querySelector("#tabla-meses tbody");
  tbody.innerHTML = "";
 
  if (meses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="tabla-vacia">Sin datos disponibles</td></tr>`;
    return;
  }
 
  meses.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.mes}</td>
      <td>
        <button class="btn-editar"  data-id="${item.id}" data-mes="${item.mes}">✏ Editar</button>
        <button class="btn-eliminar" data-id="${item.id}">✕ Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
 
  tbody.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nuevoNombre = prompt(`Editar mes #${btn.dataset.id}:`, btn.dataset.mes);
      if (nuevoNombre && nuevoNombre.trim()) {
        btn.dataset.mes = nuevoNombre.trim();
        btn.closest("tr").querySelector("td:nth-child(2)").textContent = nuevoNombre.trim();
      }
    });
  });
 
  tbody.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm(`¿Eliminar el mes #${btn.dataset.id}?`)) {
        btn.closest("tr").remove();
      }
    });
  });
}
 
async function mostrarModalMeses() {
  inyectarEstilos();
 
  // Evitar duplicados
  const existing = document.getElementById("modal-overlay");
  if (existing) existing.remove();
 
  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.innerHTML = `
    <div id="modal-meses">
      <div class="modal-header">
        <span>📋 LISTADO DE MESES</span>
        <button id="btn-cerrar-modal" title="Cerrar">✕</button>
      </div>
      <div class="modal-body">
        <table id="tabla-meses">
          <thead>
            <tr>
              <th>#</th>
              <th>Mes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="3" class="tabla-vacia">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button id="btn-cerrar-footer">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
 
  const cerrar = () => overlay.remove();
  document.getElementById("btn-cerrar-modal").addEventListener("click", cerrar);
  document.getElementById("btn-cerrar-footer").addEventListener("click", cerrar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrar(); });
 
  const meses = await fetchMeses();
  construirTabla(meses);
}
 
document.addEventListener("DOMContentLoaded", () => {
  const btnReportes = document.querySelector(".btn-main:not(.btn-salir)");
  if (btnReportes) {
    btnReportes.addEventListener("click", mostrarModalMeses);
  } else {
    console.warn("No se encontró el botón Reportes.");
  }
});