// Función para registrar una nueva carta
function registrarCarta(event) {
  event.preventDefault();

  const tipo = document.getElementById('tipo').value;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const puntos = document.getElementById('puntos').value;

  // Validar los datos si es necesario

  // Crear objeto con los datos de la carta
  const nuevaCarta = {
    cardType: tipo,
    cardName: nombre,
    cardDescription: descripcion,
    cardBattlePoints: parseInt(puntos),
  };

  // Enviar los datos al servidor mediante una solicitud POST utilizando Fetch API
  fetch('/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevaCarta),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error en la solicitud de registro de carta.');
    }
    return response.json(); // Analizar la respuesta JSON
  })
  .then((data) => {
    // Limpiar el formulario después de registrar la carta
    document.getElementById('registroForm').reset();

    // Actualizar la lista de cartas mostrando la nueva carta registrada
    cargarCartas();
  })
  .catch((error) => {
    console.error('Error al registrar la carta:', error);
  });
}

// Agregar el evento de submit al formulario para registrar una nueva carta
document.getElementById('registroForm').addEventListener('submit', registrarCarta);
// Función para cargar y mostrar la lista de cartas
function cargarCartas() {
  // Realizar una solicitud GET al servidor para obtener la lista de cartas
  fetch('/cards')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener la lista de cartas.');
      }
      return response.json(); // Analizar la respuesta JSON
    })
    .then((data) => {
      // Limpiar la lista de cartas antes de actualizarla
      const cartasListElement = document.getElementById('cartasList');
      cartasListElement.innerHTML = '';

      // Recorrer los datos de las cartas y agregarlos a la lista
      data.docs.forEach((carta) => {
        const cartaElement = document.createElement('div');
        cartaElement.classList.add('card');
        cartaElement.innerHTML = `
          <h3>${carta.cardName}</h3>
          <p><strong>Tipo:</strong> ${carta.cardType}</p>
          <p><strong>Descripción:</strong> ${carta.cardDescription}</p>
          <p><strong>Puntos de Batalla:</strong> ${carta.cardBattlePoints}</p>
          <button onclick="editarCarta('${carta._id}')">Editar</button>
          <button onclick="eliminarCarta('${carta._id}')">Eliminar</button>
        `;
        cartasListElement.appendChild(cartaElement);
      });
    })
    .catch((error) => {
      console.error('Error al obtener la lista de cartas:', error);
    });
}

// Llamar a la función para cargar y mostrar la lista de cartas al cargar la página
document.addEventListener('DOMContentLoaded', cargarCartas);

// Función para buscar cartas por nombre o tipo
function buscarCartas() {
  const searchTerm = document.getElementById('searchTerm').value.toLowerCase();

  // Enviar los datos al servidor mediante una solicitud POST utilizando Fetch API
  fetch('/cards/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchTerm }), // Enviar el término de búsqueda en el cuerpo de la solicitud
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error en la solicitud de búsqueda de cartas.');
    }
    return response.json(); // Analizar la respuesta JSON
  })
  .then((data) => {
    // Limpiar la lista de cartas antes de mostrar los resultados de la búsqueda
    const cartasListElement = document.getElementById('cartasList');
    cartasListElement.innerHTML = '';

    // Mostrar las cartas coincidentes en la lista
    data.forEach((carta) => {
      const cartaElement = document.createElement('div');
      cartaElement.classList.add('card');
      cartaElement.innerHTML = `
        <h3>${carta.cardName}</h3>
        <p><strong>Tipo:</strong> ${carta.cardType}</p>
        <p><strong>Descripción:</strong> ${carta.cardDescription}</p>
        <p><strong>Puntos de Batalla:</strong> ${carta.cardBattlePoints}</p>
        <button onclick="editarCarta('${carta._id}')">Editar</button>
        <button onclick="eliminarCarta('${carta._id}')">Eliminar</button>
      `;
      cartasListElement.appendChild(cartaElement);
    });
  })
  .catch((error) => {
    console.error('Error al buscar cartas:', error);
  });
}

// Agregar el evento de clic al botón de búsqueda
document.getElementById('mi-boton').addEventListener('click', miFuncion);


