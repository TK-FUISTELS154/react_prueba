const API_URL = "https://fuerza-g-grupo-1-uy0x.onrender.com/api/Cta_par";

const adminForm = document.getElementById("adminForm");
const modal = document.getElementById("modal");

let formData = null; // guardamos datos temporalmente

// SUBMIT → solo abre modal
adminForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formData = {
        Partida: parseInt(document.getElementById("numero_partida").value),
        Gestion: parseInt(document.getElementById("anio_gestion").value)
    };

    modal.style.display = "flex";
});


// BOTÓN "NO"
function closeModal() {
    modal.style.display = "none";
    formData = null;
}


// BOTÓN "SÍ" → aquí recién enviamos a la API
async function confirmarEnvio() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        modal.style.display = "none";

        if (res.ok) {
            alert("Partida creada exitosamente");
            adminForm.reset();
        } else {
            alert("Error al crear la partida");
        }

    } catch (error) {
        modal.style.display = "none";
        alert("Error de conexión con el servidor");
    }

    formData = null;
}