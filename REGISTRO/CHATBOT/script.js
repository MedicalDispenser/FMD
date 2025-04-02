window.onload = function () {
    console.log("Todos los recursos de la página han sido cargados.");

    document.getElementById("bubbleChat").onclick = function () {
        console.log("Frame click");
    };

    // Observador de cambios en el DOM
    const observer = new MutationObserver((mutations, obs) => {
        let bubble = document.getElementById("chatbase-bubble-button");
        if (bubble) {
            console.log("Elemento encontrado, asignando evento.");
            bubble.onclick = function () {
                console.log("bubble click");
            };
            obs.disconnect(); // Dejar de observar una vez encontrado
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};
console.log(fetch(window.location.href)
.then(response => response.text())
.then(html => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  console.log(doc.documentElement.lang); // Esto debería mostrar el idioma original
}));