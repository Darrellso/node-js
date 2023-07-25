const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;
const LIMIT_PER_PAGE = 10; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

  const cards = [];

  app.post('/cartas', (req, res) => {
    const nuevaCarta = req.body;
    cards.push(nuevaCarta);
    res.json({ message: 'Carta registrada correctamente', carta: nuevaCarta });
  });
  
  app.get('/cartas', (req, res) => {
    res.json(cards);
  });
  
  app.put('/cartas/:id', (req, res) => {
    const cartaId = req.params.id;
    const cartaActualizada = req.body;
    const index = cards.findIndex((carta) => carta._id === cartaId);

    if (index !== -1) {
      cards[index] = { ...cards[index], ...cartaActualizada };
      res.json({ message: 'Carta actualizada correctamente', carta: cards[index] });
    } else {
      res.status(404).json({ error: 'Carta no encontrada' });
    }
  });

  app.delete('/cartas/:id', (req, res) => {
    const cartaId = req.params.id;
    res.json({ message: 'Carta eliminada correctamente' });
  });

  app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
  });

  app.use(express.static(path.join(__dirname)));

  app.use(express.static(path.join(__dirname), { 
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'text/javascript');
        }
      }
    }));
    
    $(document).ready(() => {
      obtenerCartas();

      $("#registroForm").submit((e) => {
        e.preventDefault();
        const formData = $("#registroForm").serialize();
        $.post("/cartas", formData, (data) => {
          console.log(data.message);
          obtenerCartas();
        });
      });
    });

app.get('/cartas', (req, res) => {
  const { page = 1, limit = LIMIT_PER_PAGE, sort, filter } = req.query;

  let filteredCards = cards;
  if (filter) {
    filteredCards = cards.filter(carta => carta.tipo === filter);
  }

  if (sort) {
    filteredCards.sort((a, b) => a[sort] - b[sort]);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  res.json({
    totalCards: filteredCards.length,
    totalPages: Math.ceil(filteredCards.length / limit),
    currentPage: parseInt(page),
    cards: paginatedCards,
  });
});

app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
 function mostrarCartas() {
  $.get("/cartas", (cartas) => {
    const cartasList = $("#cartasList");
    cartasList.empty();
    cartas.forEach((carta) => {
      const cardHtml = `<div class="card">
        <h3>${carta.nombre}</h3>
        <p>Tipo: ${carta.tipo}</p>
        <p>${carta.descripcion}</p>
        <p>Puntos de Batalla: ${carta.puntos}</p>
        <button onclick="editarCarta('${carta._id}')">Editar</button>
        <button onclick="eliminarCarta('${carta._id}')">Eliminar</button>
      </div>`;
      cartasList.append(cardHtml);
    });
  });
}

function editarCarta(id) {
  $.get(`/cartas/${id}`, (carta) => {
    // Rellenar el formulario con los detalles de la carta
    $("#edicionForm #nombre").val(carta.nombre);
    $("#edicionForm #tipo").val(carta.tipo);
    $("#edicionForm #descripcion").val(carta.descripcion);
    $("#edicionForm #puntos").val(carta.puntos);
    $("#edicionForm #cartaId").val(carta._id);

    $("#edicionForm").show();
  });
}

$("#edicionForm").submit((e) => {
  e.preventDefault();
  const formData = $("#edicionForm").serialize();
  const cartaId = $("#edicionForm #cartaId").val();
  $.ajax({
    url: `/cartas/${cartaId}`,
    type: "PUT",
    data: formData,
    success: (data) => {
      console.log(data.message);
      mostrarCartas();
      $("#edicionForm").hide();
    },
    error: (error) => {
      console.error("Error al editar la carta:", error.responseText);
    },
  });
});

function eliminarCarta(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta carta?")) {
    $.ajax({
      url: `/cartas/${id}`,
      type: "DELETE",
      success: (data) => {
        console.log(data.message);
        mostrarCartas();
      },
      error: (error) => {
        console.error("Error al eliminar la carta:", error.responseText);
      },
    });
  }
}

