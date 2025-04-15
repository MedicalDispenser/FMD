window.chatbase.addEventListener("user-message", (event) => {
  console.log("User message received:", event.data.content);
  historial.push({ rol: "User", message: event.data.content });
});
window.chatbase.addEventListener("assistant-message", (event) => {
  console.log("User message received:", event.data.content);
  historial.push({ rol: "Assistant", message: event.data.content });
});

let estadoAnterior = null; // Guardará el estado previo

const observer2 = new MutationObserver((mutations, obs) => {
  let ventanaChat = document.getElementById("chatbase-bubble-window");
  if (ventanaChat) {
    console.log("Ventana encontrada, asignando evento.");
    // Detectar cambios en el estilo display
    const observerDisplay = new MutationObserver(() => {
      let displayActual = window.getComputedStyle(ventanaChat).display;
      if (displayActual === "flex" && estadoAnterior === "none") {estadoAnterior
        // alert("El chat se ha cerrado"); // Se muestra solo si pasó de flex a none
        mostrarFormulario();
      }
      // Actualizar estado anterior para la siguiente detección
      estadoAnterior = displayActual;
    });

    observerDisplay.observe(ventanaChat, {
      attributes: true,
      attributeFilter: ["style"],
    });
    obs.disconnect(); // Dejar de observar una vez encontrado
  }
});
observer2.observe(document.body, { childList: true, subtree: true });

function mostrarFormulario() {
  // Crear el modal con HTML dinámico
  let modal = document.createElement("div");
  modal.innerHTML = `
        <div id="miModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
                    border-radius: 8px; z-index: 1000;">
            <h3>Ingresa los datos</h3>
            <label>Nombre: <input type="text" id="nombre"></label><br><br>
            <label>Email: <input type="email" id="email"></label><br><br>
            <label>Mensaje: <textarea id="mensaje"></textarea></label><br><br>
            <button id="enviarDatos">Enviar</button>
        </div>
    `;
  document.body.appendChild(modal);
  abrirModal();
  // Evento para enviar datos
  document.getElementById("enviarDatos").addEventListener("click", () => {
    enviarDatosAPI(modal); // Pasamos el modal para cerrarlo solo si los datos son correctos
  });
}

/**
 * Envía los datos ingresados en el formulario a una API REST (POST request).
 * Solo cierra el formulario si los datos están completos.
 */
function enviarDatosAPI(modal) {

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let mensaje = document.getElementById("mensaje").value.trim();

  // Si hay campos vacíos, mostramos alerta y no enviamos nada
  if (!nombre || !email || !mensaje) {
    alert("Por favor, completa todos los campos antes de enviar.");
    return;
  }

  let datosUsuario = { nombre, email, mensaje };
  console.log("Enviando peticion...");
  cerrarModal(modal);
  
  // // 🔹 PRIMERA API (POST) - Obtener datos adicionales
  // fetch("https://tu-api.com/api1", {
  //   // Reemplaza con tu API real
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(datosUsuario),
  // })
  //   .then((response) => {
  //     if (!response.ok) throw new Error("Error en la API 1");
  //     return response.json();
  //   })
  //   .then((dataAPI1) => {
  //     console.log("Respuesta de la API 1:", dataAPI1);

  //     // 🔹 SEGUNDA API (POST) - Enviar los datos finales
  //     let datosFinales = {
  //       ...datosUsuario, // Mantiene los datos del usuario
  //       datosAdicionales: dataAPI1, // Añade los datos obtenidos de la API 1
  //     };

  //     return fetch("https://tu-api.com/api2", {
  //       // Reemplaza con la API final
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(datosFinales),
  //     });
  //   })
  //   .then((response) => {
  //     if (!response.ok) throw new Error("Error en la API 2");
  //     return response.json();
  //   })
  //   .then((dataAPI2) => {
  //     console.log("Datos enviados correctamente:", dataAPI2);
  //     alert("Datos registrados correctamente.");
  //     cerrarModal(); // ✅ Cierra el formulario solo si ambas APIs funcionan
  //   })
  //   .catch((error) => {
  //     console.error("Error en el proceso:", error);
  //     alert("Hubo un problema al enviar los datos.");
  //   });
}

function abrirModal() {
  document.body.style.pointerEvents = "none"; // Bloquea interacciones con el fondo
  document.getElementById("miModal").style.pointerEvents = "auto"; // Permite solo en el iframe
}
function cerrarModal(modal) {
document.body.style.pointerEvents = "auto"; // Reactiva la interacción con el fondo
document.body.removeChild(modal);
}


// const observer = new MutationObserver((mutations, obs) => {
//     let iframe = document.querySelector('iframe[title="Chatbot"]');
//     if (iframe) {
//         console.log("iframe encontrado");
//         let textArea = document.querySelector("textarea");

//         textArea.addEventListener("input", () => {
//             window.parent.postMessage({ texto: textArea.value }, "*");
//         });
//         obs.disconnect(); // Dejar de observar una vez encontrado
//     }
// });
// observer.observe(document.body, { childList: true, subtree: true });
