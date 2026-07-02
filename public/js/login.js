const userInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-confirm');

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/Jesus1827/Prueba_2do_parcial/dev/assets/dataBase/user.json";

let users = [];

async function cargarUsers() {
    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error('No se pudo cargar usuarios desde GitHub');
        users = await response.json();
        console.log('users cargados correctamente desde GitHub:', users);
        return true;
    } catch (error) {
        console.error('Error al cargar users desde GitHub:', error);
        users = [
            { username: "admin", password: "admin", rol: "admin" },
            { username: "user", password: "user", rol: "user" },
            { username: "user2", password: "user2", rol: "user" }
        ];
        console.log('Usando datos de prueba:', users);
        return false;
    }
}

function ejecutarLogin() {
    const usernameInput = userInput.value;
    const passwordInput = passInput.value;

    if (typeof users !== 'undefined' && users.length > 0) {
        const usuarioEncontrado = users.find(user =>
            user.username === usernameInput && user.password === passwordInput
        );

        if (usuarioEncontrado) {
            localStorage.setItem('usuarioNombre', usuarioEncontrado.username);
            localStorage.setItem('usuarioRol', usuarioEncontrado.rol);
            
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'login-success', username: usuarioEncontrado.username }, '*');
            } else {
                // Si es admin/admin, redireccionar a security, sino a gfpictprevue
                if (usernameInput === 'admin' && passwordInput === 'admin') {
                    window.location.href = `./pages/security/`;
                } else {
                    window.location.href = `./pages/gfpictprevue/`;
                }
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } else {
        console.error('Error: users no está definido o está vacío');
        alert("Error: No se pudo cargar la base de datos de usuarios");
    }
}

cargarUsers();


userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        passInput.focus();
    }
});


passInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        ejecutarLogin();
    }
});

loginBtn.addEventListener('click', ejecutarLogin);