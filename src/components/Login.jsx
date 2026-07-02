import React, { useState, useEffect } from 'react';

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/Jesus1827/Prueba_2do_parcial/dev/assets/dataBase/user.json";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function cargarUsers() {
      try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error('No se pudo cargar usuarios desde GitHub');
        const data = await response.json();
        setUsers(data);
        console.log('Usuarios cargados correctamente desde GitHub:', data);
      } catch (error) {
        console.error('Error al cargar usuarios desde GitHub:', error);
        // Fallback local data matching the original js/login.js
        const localUsers = [
          { username: "admin", password: "admin", rol: "admin" },
          { username: "user", password: "user", rol: "user" },
          { username: "user2", password: "user2", rol: "user" }
        ];
        setUsers(localUsers);
        console.log('Usando datos de prueba locales:', localUsers);
      }
    }
    cargarUsers();
  }, []);

  const ejecutarLogin = () => {
    if (users.length === 0) {
      alert("Error: No se pudo cargar la base de datos de usuarios");
      return;
    }

    const usuarioEncontrado = users.find(user =>
      user.username === username && user.password === password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuarioNombre', usuarioEncontrado.username);
      localStorage.setItem('usuarioRol', usuarioEncontrado.rol);
      onLoginSuccess(usuarioEncontrado.username, usuarioEncontrado.rol);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const handleKeyDown = (e, nextInputId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextInputId === 'login-confirm') {
        ejecutarLogin();
      } else {
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
      {/* Cargar estilos originales del login */}
      <link rel="stylesheet" href="/css/styles_main/header.css" />
      <link rel="stylesheet" href="/css/styles_main/login.css" />

      <header>
        <div className="header-container">
          <div className="header-left">
            <img src="/assets/img/icono.png" alt="icono" />
            <h1>SISTEMA DE ACTIVOS FIJOS</h1>
          </div>

          <div className="header-right">
            <button id="minimize">−</button>
            <button id="maximize">□</button>
            <button id="close">✕</button>
          </div>
        </div>

        <nav className="menu-bar">
          <details className="menu-item">
            <summary>Archivo</summary>
            <div className="dropdown-fox">
              <div className="opcion deshabilitada">
                <span>Cerrar</span>
                <span className="atajo">Ctrl+F4</span>
              </div>
              <hr />
              <div className="opcion deshabilitada">
                <span>Guardar</span>
                <span className="atajo">Ctrl+S</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Guardar como...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Guardar como HTML...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Revertir</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Configurar página...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Vista preliminar</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Imprimir...</span>
                <span className="atajo">Ctrl+P</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Enviar...</span>
              </div>
            </div>
          </details>

          <details className="menu-item">
            <summary>Edición</summary>
            <div className="dropdown-fox">
              <div className="opcion deshabilitada">
                <span>Deshacer</span>
                <span className="atajo">Ctrl+Z</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Rehacer</span>
                <span className="atajo">Ctrl+R</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Cortar</span>
                <span className="atajo">Ctrl+X</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Copiar</span>
                <span className="atajo">Ctrl+C</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Pegar</span>
                <span className="atajo">Ctrl+V</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Pegar especial...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Borrar</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Seleccionar todo</span>
                <span className="atajo">Ctrl+A</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Buscar</span>
                <span className="atajo">Ctrl+F</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Reemplazar</span>
                <span className="atajo">Ctrl+L</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Insertar objeto...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Objeto...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Vínculos...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Propiedades...</span>
              </div>
            </div>
          </details>

          <details className="menu-item">
            <summary>Ventana</summary>
            <div className="dropdown-fox">
              <div className="opcion deshabilitada">
                <span>Cascada</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Organizar todo</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Ocultar</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Borrar</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Recorrer</span>
                <span className="atajo">Ctrl+F1</span>
              </div>
              <hr />
              <div className="opcion deshabilitada">
                <span>1 SISTEMA DE ACTIVOS FIJOS</span>
              </div>
              <div className="opcion deshabilitada">
                <span>2 INGRESE SU IDENTIFICACION</span>
              </div>
            </div>
          </details>

          <details className="menu-item">
            <summary>Ayuda</summary>
            <div className="dropdown-fox">
              <div className="opcion deshabilitada">
                <span>Ayuda de Microsoft Visual FoxPro</span>
                <span className="atajo">F1</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Busqueda en MSDN</span>
              </div>
              <hr />
              <div className="opcion deshabilitada">
                <span>Soporte técnico</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Visual FoxPro en el Web</span>
              </div>
              <hr />
              <div className="opcion deshabilitada">
                <span>Acerca de Microsoft Visual FoxPro</span>
              </div>
            </div>
          </details>
        </nav>
      </header>
      <hr style={{ border: 'none', height: '2px', backgroundColor: '#f2f3f9' }} />

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <div className="login-container">
          <h2>INGRESE SU IDENTIFICACION</h2>
          <div className="login-header">
            <img src="/assets/img/login.png" alt="login" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          <div className="login-main">
            <div className="login-inputs">
              <div className="login-title">
                <h3>Login</h3>
                <h2 style={{ color: '#4b9fff', fontWeight: 900 }}><strong>——————————————————————</strong></h2>
              </div>
              <div className="login-user">
                <p>Nombre del Usuario</p>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'login-password')}
                  autoFocus
                />
              </div>
              <div className="login-password">
                <p>Contraseña</p>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'login-confirm')}
                />
              </div>
              <div className="login-confirm">
                <p><strong>Nota: Es sensible al contexto</strong></p>
                <button id="login-confirm" onClick={ejecutarLogin}>Aceptar</button>
              </div>
            </div>
          </div>
          <div className="login-footer">
            <p>vSIAF versión 3.2</p>
            <p>Copyright &copy; 1999-2013 DGSGIF</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </main>
    </div>
  );
}
