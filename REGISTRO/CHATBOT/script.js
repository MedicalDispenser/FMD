var estadoAnterior = null; // Guardará el estado previo
var nombre = "";
var email = "";
var telefono = "";
var historial = [];

const lang = document.documentElement.getAttribute("lang");
console.log(lang); // Ejemplo: "es", "en", "fr", etc.

window.chatbase.addEventListener("user-message", (event) => {
  //console.log("User message received:", event.data.content);
  historial.push({ rol: "User", message: event.data.content });
});
window.chatbase.addEventListener("assistant-message", (event) => {
  //console.log("Assistant message received:", event.data.content);
  historial.push({ rol: "Assistant", message: event.data.content });
});

const observer2 = new MutationObserver((mutations, obs) => {
  let ventanaChat = document.getElementById("chatbase-bubble-window");
  if (ventanaChat) {
    console.log("Ventana encontrada, asignando evento.");
    // Detectar cambios en el estilo display
    const observerDisplay = new MutationObserver(() => {
      let displayActual = window.getComputedStyle(ventanaChat).display;
      if (displayActual === "flex" && estadoAnterior === "none") {
        if (nombre === "" && email === "" && telefono === "") {
          console.log("Recopilar info usuario");
          mostrarFormulario();
        }
      }
      if (displayActual === "none" && estadoAnterior === "flex") {
        //alert("El chat se ha cerrado"); // cerrar chat
        cerrarChat();
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
                    background: white; padding: 25px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
                    border-radius: 12px; z-index: 1000; width: 350px; font-family: 'Arial', sans-serif;">
    <h3 style="color: #1E73BE; margin-top: 0; border-bottom: 2px solid #1E73BE; padding-bottom: 10px;">Ingresa los datos de la farmacia</h3>
    
    <div style="margin: 15px 0;">
        <label style="display: block; margin-bottom: 15px; color: #555;">
            Nombre: 
            <input type="text" id="nombre" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
        
        <label style="display: block; margin-bottom: 15px; color: #555;">
            Email: 
            <input type="email" id="email" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
        
        <label style="display: block; margin-bottom: 20px; color: #555;">
            Teléfono: 
            <input type="text" id="telefono" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
    </div>
    
    <button id="enviarDatos" style="background-color: #1E73BE; color: white; border: none; 
                    padding: 10px 20px; border-radius: 4px; cursor: pointer; 
                    font-size: 16px; width: 100%; transition: background-color 0.3s;"
            onmouseover="this.style.backgroundColor='#165a9d'" 
            onmouseout="this.style.backgroundColor='#1E73BE'">
        Enviar
    </button>
</div>
    `;
  document.body.appendChild(modal);
  abrirModal();
  // Evento para enviar datos
  document.getElementById("enviarDatos").addEventListener("click", () => {
    enviarDatosAPI(modal); // Pasamos el modal para cerrarlo solo si los datos son correctos
  });
}

function cerrarChat() {
  let modal = document.createElement("div");
  modal.innerHTML = `
<div id="miModalTrueFalse" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 25px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
                    border-radius: 12px; z-index: 1000; width: 350px; font-family: 'Arial', sans-serif;
                    transition: opacity 0.3s ease;">
    <h3 style="color: #1E73BE; margin-top: 0; border-bottom: 2px solid #1E73BE; padding-bottom: 10px;">¿Se ha solucionado tu duda?</h3>
    
    <div style="margin: 20px 0; text-align: center;">
        <div style="display: flex; justify-content: space-around; margin-bottom: 25px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="solucionado" value="true" style="margin-right: 8px; accent-color: #1E73BE;">
                <span style="font-size: 16px;">✅ Sí</span>
            </label>
            
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="solucionado" value="false" style="margin-right: 8px; accent-color: #1E73BE;">
                <span style="font-size: 16px;">❌ No</span>
            </label>
        </div>
    </div>
    
    <button id="confirmarRespuesta" style="background-color: #1E73BE; color: white; border: none; 
                    padding: 10px 20px; border-radius: 4px; cursor: pointer; 
                    font-size: 16px; width: 100%; transition: background-color 0.3s;"
            onmouseover="this.style.backgroundColor='#165a9d'" 
            onmouseout="this.style.backgroundColor='#1E73BE'">
        Confirmar
    </button>
</div>

<script>
document.getElementById('confirmarRespuesta').addEventListener('click', function() {
    const modal = document.getElementById('miModalTrueFalse');
    modal.style.opacity = '0';
    
    // Espera a que termine la transición para remover completamente el modal
    setTimeout(function() {
        modal.style.display = 'none';
    }, 300); // 300ms = duración de la transición
});
</script>
    `;
  document.body.appendChild(modal);

  modal
    .querySelector("#confirmarRespuesta")
    .addEventListener("click", function () {
      const seleccionado = modal.querySelector(
        'input[name="solucionado"]:checked'
      );

      if (!seleccionado) {
        alert("Por favor selecciona si tu duda fue resuelta");
        return;
      }

      const solucionado = seleccionado.value === "true";
      const boton = this;
      const textoOriginal = boton.textContent;

      // Mostrar estado de carga
      boton.disabled = true;
      boton.textContent = "Enviando...";
      boton.style.backgroundColor = "#165a9d";

      // Llamada API
      fetch("https://nrapi.fmd.fagorhealthcare.com/v0/postAirtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            "Nombre farmacia": nombre,
            "Teléfono farmacia": telefono,
            "Correo farmacia": email,
            historial: historial,
            solucionado: solucionado,
          },
        }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error("Error en la respuesta del servidor");
          return response.json();
        })
        .then((data) => {
          console.log("Respuesta Node-RED:", data);
          // Cierre animado después de éxito
          const modal = document.getElementById("miModalTrueFalse");
          modal.style.opacity = "0";
          setTimeout(() => {
            modal.remove(); // Eliminar completamente el modal del DOM
          }, 300);
        })
        .catch((error) => {
          console.error("Error al enviar datos:", error);
          alert("Hubo un error al guardar tu respuesta. Inténtalo de nuevo.");
        })
        .finally(() => {
          // Restaurar botón
          boton.disabled = false;
          boton.textContent = textoOriginal;
          boton.style.backgroundColor = "#1E73BE";
        });
    });
  //historial.length = 0	// limpar el historial
}

/**
 * Envía los datos ingresados en el formulario a una API REST (POST request).
 * Solo cierra el formulario si los datos están completos.
 */
function enviarDatosAPI(modal) {
  nombre = document.getElementById("nombre").value.trim();
  email = document.getElementById("email").value.trim();
  telefono = document.getElementById("telefono").value.trim();

  // Si hay campos vacíos, mostramos alerta y no enviamos nada
  if (!nombre || !email || !telefono) {
    alert("Por favor, completa todos los campos antes de enviar.");
    return;
  }
  console.log(nombre + " " + email + " " + telefono);
  // console.log("Enviando peticion...");
  cerrarModal(modal);
  switch (lang) {
    case "es-ES":
      window.chatbase.setInitialMessages([
        `Hola ${nombre}!`,
        "¿En que puedo ayudarte hoy?",
      ]);
      break;
    case "fr-FR":
      window.chatbase.setInitialMessages([
        `Bonjour ${nombre}!`,
        "Comment puis-je vous aider aujourd'hui ?",
      ]);
      break;
    case "en-US":
      window.chatbase.setInitialMessages([
        `Hello ${nombre}!`,
        "How can I help you today?",
      ]);
      break;
    case "it-IT":
      window.chatbase.setInitialMessages([
        `Salve ${nombre}!`,
        "Come posso aiutarla oggi?",
      ]);
      break;
    case "pt-PT":
      window.chatbase.setInitialMessages([
        `Olá ${nombre}!`,
        "Como posso ajudá-lo hoje?",
      ]);
      break;
    default:
      window.chatbase.setInitialMessages([
        `Hello ${nombre}!`,
        "How can I help you today?",
      ]);
  }

}

function abrirModal() {
  document.getElementById("chatbase-bubble-window").style.visibility = "hidden";
  document.body.style.pointerEvents = "none"; // Bloquea interacciones con el fondo
  document.getElementById("miModal").style.pointerEvents = "auto"; // Permite solo en el iframe
}
function cerrarModal(modal) {
  document.body.style.pointerEvents = "auto"; // Reactiva la interacción con el fondo
  document.body.removeChild(modal);
  document.getElementById("chatbase-bubble-window").style.visibility =
    "visible";
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
