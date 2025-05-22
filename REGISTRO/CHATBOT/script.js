const traducciones = {
  "es-ES": {
    title_User_Info: "Ingresa los datos de la farmacia",
    lblNombre_User_info: "Nombre de la farmacia",
    lblEmail_User_info: "Correo electronico",
    lblTelefono_User_info: "Telefono de la farmacia",
    btnGuadar_User_info: "Guardar",

    title_Inci_Resuelta: "¿Se ha solucionado tu duda?",
    lblyes: "✅ Sí",
    lblno: "❌ No",
    btnconfirm: "Confirmar",
    lblvalidation: "Por favor selecciona una opción",
    lblsending: "Enviando...",
  },
  "pt-PT": {
    title_User_Info: "Introduzir os dados da farmácia",
    lblNombre_User_info: "Nome da farmácia",
    lblEmail_User_info: "Endereço eletrónico",
    lblTelefono_User_info: "Número de telefone da farmácia",
    btnGuadar_User_info: "Guardar",

    title_Inci_Resuelta: "Sua dúvida foi resolvida?",
    lblyes: "✅ Sim",
    lblno: "❌ Não",
    btnconfirm: "Confirmar",
    lblvalidation: "Por favor selecione uma opção",
    lblsending: "Enviando...",
  },
  "en-US": {
    title_User_Info: "Enter the pharmacy data",
    lblNombre_User_info: "Pharmacy name",
    lblEmail_User_info: "Email address",
    lblTelefono_User_info: "Pharmacy phone number",
    btnGuadar_User_info: "Save",

    title_Inci_Resuelta: "Was your question resolved?",
    lblyes: "✅ Yes",
    lblno: "❌ No",
    btnconfirm: "Confirm",
    lblvalidation: "Please select an option",
    lblsending: "Sending...",
  },
  "it-IT": {
    title_User_Info: "Inserire i dati della farmacia",
    lblNombre_User_info: "Nome della farmacia",
    lblEmail_User_info: "Indirizzo e-mail",
    lblTelefono_User_info: "Numero di telefono della farmacia",
    btnGuadar_User_info: "Salva",

    title_Inci_Resuelta: "La tua domanda ha ricevuto una risposta?",
    lblyes: "✅ Sì",
    lblno: "❌ No",
    btnconfirm: "Confermare",
    lblvalidation: "Selezionare un'opzione",
    lblsending: "Invio...",
  },
  "fr-FR": {
    title_User_Info: "Saisir les coordonnées de la pharmacie",
    lblNombre_User_info: "Nom de la pharmacie",
    lblEmail_User_info: "Adresse électronique",
    lblTelefono_User_info: "Numéro de téléphone de la pharmacie",
    btnGuadar_User_info: "Sauvegarde",

    title_Inci_Resuelta: "Avez-vous reçu une réponse à votre question ?",
    lblyes: "✅ Oui",
    lblno: "❌ Non",
    btnconfirm: "Confirmer",
    lblvalidation: "Veuillez sélectionner une option",
    lblsending: "Envoi...",
  },
};

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
  const t = traducciones[lang] || traducciones[0]; // Fallback a español

  // Crear el modal con HTML dinámico
  let modal = document.createElement("div");
  modal.innerHTML = `
       <div id="formInfoUser" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 25px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
                    border-radius: 12px; z-index: 1000; width: 350px; font-family: 'Arial', sans-serif;">
    <h3 style="color: #1E73BE; margin-top: 0; border-bottom: 2px solid #1E73BE; padding-bottom: 10px;">${t.title_User_Info}</h3>
    
    <div style="margin: 15px 0;">
        <label style="display: block; margin-bottom: 15px; color: #555;">
            ${t.lblNombre_User_info}: 
            <input type="text" id="nombre" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
        
        <label style="display: block; margin-bottom: 15px; color: #555;">
            ${t.lblEmail_User_info}: 
            <input type="email" id="email" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
        
        <label style="display: block; margin-bottom: 20px; color: #555;">
            ${t.lblTelefono_User_info}: 
            <input type="text" id="telefono" style="width: 100%; padding: 8px; margin-top: 5px; 
                    border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </label>
    </div>
    
    <button id="enviarDatos" style="background-color: #1E73BE; color: white; border: none; 
                    padding: 10px 20px; border-radius: 4px; cursor: pointer; 
                    font-size: 16px; width: 100%; transition: background-color 0.3s;"
            onmouseover="this.style.backgroundColor='#165a9d'" 
            onmouseout="this.style.backgroundColor='#1E73BE'">
            ${t.btnGuadar_User_info}
    </button>
</div>
    `;
  document.body.appendChild(modal);
  //abrirModal();
  window.chatbase.close();
  // Evento para enviar datos
  document.getElementById("enviarDatos").addEventListener("click", () => {
    enviarDatosAPI(modal); // Pasamos el modal para cerrarlo solo si los datos son correctos
  });
}

function cerrarChat() {
  if (historial.length == 0) {
    console.log("Sin conversacion");
    return;
  }
  const t = traducciones[lang] || traducciones[0]; // Fallback a español
  let modal = document.createElement("div");
  modal.innerHTML = `
<div id="incidenciaResueltaForm" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 25px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
                    border-radius: 12px; z-index: 1000; width: 350px; font-family: 'Arial', sans-serif;
                    transition: opacity 0.3s ease;">
    <h3 style="color: #1E73BE; margin-top: 0; border-bottom: 2px solid #1E73BE; padding-bottom: 10px;"> ${t.title_Inci_Resuelta}</h3>
    
    <div style="margin: 20px 0; text-align: center;">
        <div style="display: flex; justify-content: space-around; margin-bottom: 25px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="solucionado" value="true" style="margin-right: 8px; accent-color: #1E73BE;">
                <span style="font-size: 16px;">${t.lblyes}</span>
            </label>
            
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="solucionado" value="false" style="margin-right: 8px; accent-color: #1E73BE;">
                <span style="font-size: 16px;">${t.lblno}</span>
            </label>
        </div>
    </div>
    
    <button id="confirmarRespuesta" style="background-color: #1E73BE; color: white; border: none; 
                    padding: 10px 20px; border-radius: 4px; cursor: pointer; 
                    font-size: 16px; width: 100%; transition: background-color 0.3s;"
            onmouseover="this.style.backgroundColor='#165a9d'" 
            onmouseout="this.style.backgroundColor='#1E73BE'">
            ${t.btnconfirm}
    </button>
</div>

<script>
document.getElementById('confirmarRespuesta').addEventListener('click', function() {
    const modal = document.getElementById('incidenciaResueltaForm');
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
      boton.textContent = t.lblsending;
      boton.style.backgroundColor = "#165a9d";

        if  (lang==='es-ES'){
            var pais="España";
        }
        else if (lang==='fr-FR"'){
            var pais="Francia";
        } 
        else if (lang==='it-IT') {
            var pais="Italia";
        }
        else if (lang==='pt-PT') {
            var pais="Portugal";
        }
        else {
            var pais="EEUU";
        }

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
            "pais":pais
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
          const modal = document.getElementById("incidenciaResueltaForm");
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
  if (!validarCorreoElectronico(email)){
    alert("Por favor, introduce un correo electronico válido.");
    return;
  }
  if (!validarNumeroTelefonico(telefono)){
    alert("Por favor, introduce un numero de telefono válido.");
    return;
  }
  console.log(nombre + " " + email + " " + telefono);
  // console.log("Enviando peticion...");
  cerrarModal(modal);

  switch (lang) {
    case "es-ES":
      window.chatbase.setInitialMessages([
        `Hola!`,
        "¿En que puedo ayudarte hoy?",
      ]);
      break;
    case "fr-FR":
      window.chatbase.setInitialMessages([
        `Bonjour!`,
        "Comment puis-je vous aider aujourd'hui?",
      ]);
      break;
    case "en-US":
      window.chatbase.setInitialMessages([
        `Hello!`,
        "How can I help you today?",
      ]);
      break;
    case "it-IT":
      window.chatbase.setInitialMessages([
        `Salve!`,
        "Come posso aiutarla oggi?",
      ]);
      break;
    case "pt-PT":
      window.chatbase.setInitialMessages([
        `Olá!`,
        "Como posso ajudá-lo hoje?",
      ]);
      break;
    default:
      window.chatbase.setInitialMessages([
        `Hello!`,
        "How can I help you today?",
      ]);
  }
  window.chatbase.close();// cerrar para actualizar los datos
  window.chatbase.open();
}


function abrirModal() {
  document.getElementById("chatbase-bubble-window").style.visibility = "hidden";
  document.body.style.pointerEvents = "none"; // Bloquea interacciones con el fondo
  document.getElementById("formInfoUser").style.pointerEvents = "auto"; // Permite solo en el iframe
}
function cerrarModal(modal) {
  document.body.style.pointerEvents = "auto"; // Reactiva la interacción con el fondo
  document.body.removeChild(modal);
  document.getElementById("chatbase-bubble-window").style.visibility =
    "visible";
}

function validarCorreoElectronico(correo) {
  // Expresión regular para validar correos electrónicos
  const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return expresionRegular.test(correo);
}
function validarNumeroTelefonico(numero) {
  // Expresión regular para números de teléfono de 10 dígitos
  const regex = /^\d{9}$/; 
  return regex.test(numero); // test() retorna true si el número coincide con el patrón, false de lo contrario.
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

