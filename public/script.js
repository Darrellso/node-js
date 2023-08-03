document.addEventListener('DOMContentLoaded', () => {
  const registroForm = document.getElementById('registroForm');

  registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const puntos = parseInt(document.getElementById('puntos').value);

    try {
      const response = await fetch('/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardType: tipo,
          cardName: nombre,
          cardDescription: descripcion,
          cardBattlePoints: puntos,
        }),
      });

      if (response.ok) {
        alert('¡La carta se registró exitosamente!');
        registroForm.reset();
        cargarCartas(); 
      } else {
        alert('Ocurrió un error al registrar la carta.');
      }
    } catch (error) {
      console.error('Error al registrar la carta:', error);
      alert('Ocurrió un error al registrar la carta.');
    }
  });

  let currentPage = 1;
  let totalPages = 1;
  let sortBy = 'cardName';
  let sortOrder = 'asc';
  let cardType = '';

  async function cargarCartas() {
    try {
      let url = '/cards?page=1&limit=10'; 

      if (sortBy && sortOrder) {
        url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      }
  
      if (cardType) {
        url += `&cardType=${cardType}`;
      }
  
      const response = await fetch(url); 
      if (response.ok) {
        const data = await response.json();
        const cartas = data.docs; 
        totalPages = data.totalPages; 
        cartasList.innerHTML = '';
  
        if (cartas.length === 0) {
          cartasList.innerHTML = '<p>No hay cartas registradas.</p>';
        } else {
          cartas.forEach((carta) => {
            const cartaElement = document.createElement('div');
            cartaElement.dataset.cardId = carta._id;
            cartaElement.innerHTML = `
              <h3>${carta.cardName}</h3>
              <p><strong>Tipo:</strong> ${carta.cardType}</p>
              <p><strong>Descripción:</strong> ${carta.cardDescription}</p>
              <p><strong>Puntos de Batalla:</strong> ${carta.cardBattlePoints}</p>
              <button data-action="editar" data-card-id="${carta._id}">Editar</button>
              <button data-action="eliminar" data-card-id="${carta._id}">Eliminar</button>
            `;
            cartasList.appendChild(cartaElement);
          });
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');

        const prevButton = document.createElement('button');
        prevButton.innerText = 'Anterior';
        prevButton.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            cargarCartas();
          }
        });
        paginationContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Siguiente';
        nextButton.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            cargarCartas();
          }
        });
        paginationContainer.appendChild(nextButton);

        cartasList.appendChild(paginationContainer);
      }
    } else {
      alert('Ocurrió un error al cargar las cartas.');
    }
  } catch (error) {
    console.error('Error al cargar las cartas:', error);
    alert('Ocurrió un error al cargar las cartas.');
  }
}

function llenarFormularioEdicion(carta) {
  document.getElementById('edit-tipo').value = carta.cardType;
  document.getElementById('edit-nombre').value = carta.cardName;
  document.getElementById('edit-descripcion').value = carta.cardDescription;
  document.getElementById('edit-puntos').value = carta.cardBattlePoints;
  document.getElementById('edit-id').value = carta._id;
  document.getElementById('editarForm').style.display = 'block';
}

  const buscarButton = document.getElementById('buscar-button');

  buscarButton.addEventListener('click', async () => {
    const searchTerm = document.getElementById('buscar-input').value;
    if (searchTerm.trim() !== '') {
      try {
        const response = await fetch('/cards/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm: searchTerm,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const cartasList = document.getElementById('cartasList');
          cartasList.innerHTML = '';

          if (data.length === 0) {
            cartasList.innerHTML = '<p>No se encontraron cartas con el término de búsqueda.</p>';
          } else {
            data.forEach((carta) => {
              const cartaElement = document.createElement('div');
              cartaElement.innerHTML = `
                <h3>${carta.cardName}</h3>
                <p><strong>Tipo:</strong> ${carta.cardType}</p>
                <p><strong>Descripción:</strong> ${carta.cardDescription}</p>
                <p><strong>Puntos de Batalla:</strong> ${carta.cardBattlePoints}</p>
              `;
              cartasList.appendChild(cartaElement);
            });
          }
        } else {
          alert('Ocurrió un error al realizar la búsqueda.');
        }
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        alert('Ocurrió un error al realizar la búsqueda.');
      }
    } else {
      alert('Por favor, ingrese un término de búsqueda válido.');
    }
  });
  const cartasList = document.getElementById('cartasList');
  const editarForm = document.getElementById('editarForm');

  editarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const tipo = document.getElementById('edit-tipo').value;
    const nombre = document.getElementById('edit-nombre').value;
    const descripcion = document.getElementById('edit-descripcion').value;
    const puntos = parseInt(document.getElementById('edit-puntos').value);
    const id = document.getElementById('edit-id').value;
  
    try {
      const response = await fetch(`/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardType: tipo,
          cardName: nombre,
          cardDescription: descripcion,
          cardBattlePoints: puntos,
        }),
      });
  
      if (response.ok) {
        alert('¡La carta se actualizó exitosamente!');
        editarForm.reset();
        editarForm.style.display = 'none';
        cargarCartas(); 
      } else {
        alert('Ocurrió un error al actualizar la carta.');
      }
    } catch (error) {
      console.error('Error al actualizar la carta:', error);
      alert('Ocurrió un error al actualizar la carta.');
    }
  });


cartasList.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.tagName === 'BUTTON') {
    const action = target.dataset.action;
    if (action === 'editar') {

      const cartaElement = target.parentNode;
      const cardId = cartaElement.dataset.cardId;

      try {
        const response = await fetch(`/cards/${cardId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            llenarFormularioEdicion(data);
          }
        } else {
          alert('Ocurrió un error al obtener los detalles de la carta.');
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la carta:', error);
        alert('Ocurrió un error al obtener los detalles de la carta.');
      } editarForm.style.display = 'block';
      } else if (action === 'eliminar') {
        const cardId = target.dataset.cardId;
        if (confirm('¿Estás seguro de que deseas eliminar esta carta?')) {
          try {
            const response = await fetch(`/cards/${cardId}`, {
              method: 'DELETE',
            });
  
            if (response.ok) {
              alert('¡La carta se eliminó exitosamente!');
              cargarCartas(); 
            } else {
              alert('Ocurrió un error al eliminar la carta.');
            }
          } catch (error) {
            console.error('Error al eliminar la carta:', error);
            alert('Ocurrió un error al eliminar la carta.');
          }
        }
      }
    }
  });

  editarForm.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON' && target.dataset.action === 'cancelar') {
      editarForm.style.display = 'none';
    }
  });

  function ordenarCartas() {
    sortBy = document.getElementById('sortBy').value;
    sortOrder = document.getElementById('sortOrder').value;
    cargarCartas();
  }
  
  function filtrarCartas() {
    cardType = document.getElementById('cardType').value;
    cargarCartas();
  }
  
  const ordenarButton = document.getElementById('ordenar-button');
  ordenarButton.addEventListener('click', () => {
    ordenarCartas();
  });


  const filtrarButton = document.getElementById('filtrar-button');
  filtrarButton.addEventListener('click', () => {
    filtrarCartas();
  });

  cargarCartas();

});