/* ════════════════════════════════
   SEGURIDAD — Lógica
   ════════════════════════════════ */

// ── DATOS EN MEMORIA ──────────────────────────────────────────────────────
let records = [
  {
    user:   'admin',
    pass:   'admin',
    nombre: 'Administrador del Sistema',
    desc:   'Usuario con privilegios completos.',
    tipo:   'Administrador'
  }
];

let current = 0;
let editing  = false;

// ── CARGA DE REGISTRO ─────────────────────────────────────────────────────

function loadRecord(i) {
  const r = records[i];
  document.getElementById('fUser').value   = r.user;
  document.getElementById('fPass').value   = '';          // no mostrar contraseña
  document.getElementById('fNombre').value = r.nombre;
  document.getElementById('fDesc').value   = r.desc;
  document.querySelectorAll('input[name="tipo"]').forEach(rb => {
    rb.checked = rb.value === r.tipo;
  });
}

function resetFields() {
  current = 0;
  loadRecord(0);
  setEditing(false);
}

// ── MODO EDICIÓN ──────────────────────────────────────────────────────────

function setEditing(on) {
  editing = on;
  document.getElementById('fNombre').readOnly = !on;
  document.getElementById('fDesc').readOnly   = !on;
  document.getElementById('fPass').readOnly   = !on;
  document.querySelectorAll('input[name="tipo"]').forEach(rb => rb.disabled = !on);
  document.getElementById('btnGuardar').disabled  = !on;
  document.getElementById('btnDeshacer').disabled = !on;
}

// ── NAVEGACIÓN ────────────────────────────────────────────────────────────

function navFirst() {
  current = 0;
  loadRecord(current);
  setEditing(false);
}

function navLast() {
  current = records.length - 1;
  loadRecord(current);
  setEditing(false);
}

function navPrev() {
  if (current > 0) {
    current--;
    loadRecord(current);
    setEditing(false);
  }
}

function navNext() {
  if (current < records.length - 1) {
    current++;
    loadRecord(current);
    setEditing(false);
  }
}

function navEdit() {
  setEditing(true);
  document.getElementById('fNombre').focus();
}

function navNew() {
  records.push({ user: '', pass: '', nombre: '', desc: '', tipo: 'Operador' });
  current = records.length - 1;
  loadRecord(current);
  setEditing(true);
  document.getElementById('fUser').removeAttribute('readonly');
  document.getElementById('fUser').focus();
}

function navUndo() {
  loadRecord(current);
  setEditing(false);
}

function navSalir() {
  if (editing) {
    if (!confirm('¿Descartar cambios y salir?')) return;
  }
  window.history.back();
}

resetFields();
