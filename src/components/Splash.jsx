import React, { useEffect } from 'react';

export default function Splash({ username, role, onSplashFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplashFinish();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onSplashFinish]);

  const getTodayDateString = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
      <link rel="stylesheet" href="/css/styles_main/header.css" />
      <link rel="stylesheet" href="/css/styles_main/gfpictprevue.css" />

      <header>
        <div className="header-container">
          <div className="header-left">
            <img src="/assets/img/icono.png" alt="icono" />
            <h1>SISTEMA DE ACTIVOS FIJOS-GFPICTPREVUE</h1>
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
              <div className="opcion">
                <span>Pegar</span>
                <span className="atajo">Ctrl+V</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Pegar especial...</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Borrar</span>
              </div>
              <div className="opcion">
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
              <div className="opcion">
                <span>Cascada</span>
              </div>
              <div className="opcion">
                <span>Organizar todo</span>
              </div>
              <div className="opcion">
                <span>Ocultar</span>
              </div>
              <div className="opcion deshabilitada">
                <span>Borrar</span>
              </div>
              <div className="opcion">
                <span>Recorrer</span>
                <span className="atajo">Ctrl+F1</span>
              </div>
              <hr />
              <div className="opcion">
                <span>1 SISTEMA DE ACTIVOS FIJOS</span>
              </div>
              <div className="opcion">
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

      <main style={{ flexGrow: 1, overflow: 'hidden' }}>
        <div className="container">
          <div className="min-economia">
            <img src="/assets/img/gfpictprevue.png" alt="Ministerio de Economía" />
            <h3>SISTEMA DE INFORMACIÓN DE ACTIVOS FIJOS</h3>
            <div className="subtitle">
              <p><strong>Desarrollado </strong></p>
              <div className="info">
                <p>Direccion General de Sistemas (DGSGIF)</p>
                <p>Unidad de Administracion y Seguridad de Sistemas</p>
              </div>
            </div>
            <div className="subtitle">
              <p><strong>Revisado </strong></p>
              <p style={{ color: '#ffffff' }}>pii</p>
              <div className="info">
                <p>Direccion General de Contabilidad Fiscal</p>
                <p>Unidad de Contabilidad y Cuentas Fiscales</p>
              </div>
            </div>
            <div className="footer-info">
              <p><strong>vSIAF vercion 3.2</strong></p>
              <p><strong>Copyright © 1999-2012 DG SGIF</strong></p>
              <p><strong>Todo derecho Reservado</strong></p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="rol" style={{ display: 'flex', alignItems: 'center' }}>
            <p>👨‍💼</p>
            <p id="role">{role}</p>
          </div>
          <div className="road" style={{ display: 'flex', alignItems: 'center' }}>
            <p>📅</p>
            <p id="road">/pages/gfpictprevue/</p>
          </div>
          <div className="connect">
            <p>🔄</p>
            <p id="connect"></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
