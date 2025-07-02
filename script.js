const formulario = document.getElementById("formulario");
const inputCiudad = document.getElementById("ciudad");
const resultado = document.getElementById("resultado");

const apiKey = "dc636bf85241618c19d02e844ba2e108"; // MI Api-Key

formulario.addEventListener("submit", async (evento) => { // Submit se usa cuando quiero que pase algo al enviar un formulario, async "Esta función puede tener tareas que toman tiempo, y quiero esperar el resultado antes de seguir".
  evento.preventDefault(); // Evita que se recargue la página

  const ciudad = inputCiudad.value.trim(); // .Trim elimina espacios al inicio y al final

  if (ciudad === "") { // Verifica igualdad estricta
    resultado.textContent = "Por favor escribe una ciudad."; // TextContent Sirve para agregar mensajes en el div que lo contenga
    return;
  }

  resultado.textContent = "Buscando clima...";

  try {
    const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`); // Await se usa siempre en un async Esto espera a que fetch(...) termine y devuelva algo, en lugar de seguir inmediatamente. Fetch permite hacer peticiones HTTP a servidores web. Lo usamos para obtener datos, enviar datos, subir archivos, etc.

    //En la variable respiesta se guarda el resultado que devuelve fetch(). No contiene directamente los datos (como JSON), sino un objeto Response (como un paquete con archivos comprimidos) que describe la respuesta HTTP.

    if (!respuesta.ok) { // El .ok accede a una propiedad ok del objeto Response y comprueba su valor (true o false).
      throw new Error("Ciudad no encontrada"); //La palabra clave throw lanza un error.Cuando se lanza un error dentro de un bloque try, se interrumpe el código y se pasa directamente al bloque catch. new error Crea un nuevo objeto de tipo Error con un mensaje
    }

    const datos = await respuesta.json(); // Convierte el cuerpo de la respuesta HTTP en un objeto JavaScript. Analogia fetch() te da una caja (response). Dentro de la caja hay un papel con texto JSON (el cuerpo de la respuesta). .json() abre la caja y traduce ese texto a un objeto JavaScript real.

    const temp = datos.main.temp; // Recorre el json que ahora es tipo js y accede a sus propiedades
    const descripcion = datos.weather[0].description; // weather[0] accede al primer objeto dentro del arreglo weather Luego .description obtiene el campo "lluvia ligera" de ese primer objeto.
    const nombreCiudad = datos.name;
    const pais = datos.sys.country;
    const humedad = datos.main.humidity;
    const tempMin = datos.main.temp_min;
    const tempMax = datos.main.temp_max;

    const icono = datos.weather[0].icon;
    const urlIcono = `https://openweathermap.org/img/wn/${icono}@2x.png`;

    resultado.innerHTML = `
    <h2>${nombreCiudad}, ${pais}</h2>
    <img src="${urlIcono}" alt="Icono del clima">
    <p><strong>Clima:</strong> ${descripcion}</p>
    <p><strong>Temperatura:</strong> ${temp}°C</p>
    <p><strong>Mín:</strong> ${tempMin}°C &nbsp; | &nbsp; <strong>Máx:</strong> ${tempMax}°C</p>
    <p><strong>Humedad:</strong> ${humedad}%</p>
    `; // innerHTML Es una forma rápida de inyectar HTML dinámico dentro de un elemento.

    guardarCiudad(nombreCiudad);
    
    function guardarCiudad(ciudad) {
      let historial = JSON.parse(localStorage.getItem("historial")) || [];
      // Evita duplicados
      if (!historial.includes(ciudad)) {
        historial.unshift(ciudad); // Agrega al principio
        if (historial.length > 5) historial.pop(); // Limita a 5 ciudades
        localStorage.setItem("historial", JSON.stringify(historial));
        mostrarHistorial();
      }
}

  } catch (error) {
    resultado.textContent = "Error: " + error.message;
  }
});


