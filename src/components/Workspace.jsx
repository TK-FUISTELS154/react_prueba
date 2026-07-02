import React, { useState, useEffect, useRef } from 'react';

export default function Workspace({ username, role, onLogout }) {
  const initialUrl = role === 'admin' 
    ? '/pages/security/index.html' 
    : '/pages/leading/menu/index.html';

  const [iframeUrl, setIframeUrl] = useState(initialUrl);
  const [iframePath, setIframePath] = useState(initialUrl);
  const iframeRef = useRef(null);

  // Monitor iframe load to update the path in the footer
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const path = iframeRef.current.contentWindow.location.pathname;
        setIframePath(path);

        // Redirect duplicate shell pages/leading/index.html to the actual menu page
        if (path === '/pages/leading/' || path.endsWith('/pages/leading/index.html') || path.endsWith('/pages/leading/')) {
          iframeRef.current.contentWindow.location.replace('/pages/leading/menu/index.html');
        }
      }
    } catch (error) {
      console.error("No se pudo leer la ruta del iframe:", error);
    }
  };

  const handleLogoutClick = () => {
    if (confirm('¿Está seguro de que desea cerrar la sesión?')) {
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioRol');
      onLogout();
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
      <link rel="stylesheet" href="/css/styles_main/header.css" />
      
      <header>
        <div className="header-container">
          <div className="header-left">
            <img src="/assets/img/icono.png" alt="icono" />
            <h1>SISTEMA DE ACTIVOS FIJOS - CAPA REACT</h1>
          </div>

          <div className="header-right">
            <button id="minimize">−</button>
            <button id="maximize">□</button>
            <button id="close" onClick={handleLogoutClick}>✕</button>
          </div>
        </div>

        <nav className="menu-bar">
          <details className="menu-item">
            <summary>Sistema</summary>
            <div className="dropdown-fox">
              <div className="opcion" onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
                <span>Cerrar Sesión</span>
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

      <main style={{ flexGrow: 1, position: 'relative', width: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
        <iframe 
          ref={iframeRef}
          src={iframeUrl} 
          onLoad={handleIframeLoad}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Legacy Workspace"
        />
      </main>

      <footer style={{ position: 'relative', borderTop: '2px solid #808080' }}>
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: '#f0f0f0' }}>
          <div className="rol" style={{ display: 'flex', alignItems: 'center', borderLeft: '2px solid #808080', padding: '5px' }}>
            <p>👨‍💼 Rol: {role}</p>
          </div>
          <div className="road" style={{ display: 'flex', alignItems: 'center', borderLeft: '2px solid #808080', padding: '5px' }}>
            <p>📅 Ruta: {iframePath}</p>
          </div>
          <div className="connect" style={{ display: 'flex', alignItems: 'center', borderLeft: '2px solid #808080', padding: '5px' }}>
            <p>🔄 Conectado</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
