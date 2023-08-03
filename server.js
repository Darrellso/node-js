
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PORT = 3000;
const MONGODB_URI = 'mongodb+srv://samael:cetav123@cluster0.ox7yybk.mongodb.net/';
const MAX_RETRIES = 3; 
let retries = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const cardSchema = new mongoose.Schema({
  cardType: String,
  cardName: String,
  cardDescription: String,
  cardBattlePoints: Number,
});

cardSchema.plugin(mongoosePaginate);

const Card = mongoose.model('Card', cardSchema);

function connectWithRetry() {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Conexión a MongoDB establecida.');
      app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error al conectar a MongoDB:', error);
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`Intentando reconectar a MongoDB (Intento ${retries})...`);
        setTimeout(connectWithRetry, 5000); 
      } else {
        console.error('Se superó el número máximo de intentos de reconexión. Saliendo...');
        process.exit(1); 
      }
    });
}


app.post('/cards/search', async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm.toLowerCase(); 

    const results = await Card.find({
      $or: [
        { cardName: { $regex: searchTerm, $options: 'i' } }, 
        { cardType: { $regex: searchTerm, $options: 'i' } }, 
      ],
    });

    res.json(results);
  } catch (error) {
    console.error('Error al buscar cartas:', error);
    res.status(500).json({ error: 'Error al buscar cartas' });
  }
});


 app.get('/cards', async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, cardType } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
    };

    const filters = {};
    if (cardType) {
      filters.cardType = cardType;
    }

    const cards = await Card.paginate(filters, options);
    res.json(cards);
  } catch (error) {
    console.log('Error al obtener la lista de cartas:', error);
    res.status(500).json({ error: 'Error al obtener la lista de cartas' });
  }
});


app.post('/cards', async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.sendStatus(200);
  } catch (error) {
    console.log('Error al registrar la carta', error);
    res.status(500).json({ error: 'Error al registrar la carta' });
  }
});



app.put('/cards/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const editedCard = req.body;
    const updatedCard = await Card.findByIdAndUpdate(cardId, editedCard, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al editar la carta:', error);
    res.status(500).json({ error: 'Error al editar la carta' });
  }
});

app.delete('/cards/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar la carta:', error);
    res.status(500).json({ error: 'Error al eliminar la carta' });
  }
});


app.get('/cards/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error al obtener la carta:', error);
    res.status(500).json({ error: 'Error al obtener la carta' });
  }
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer() {
  connectWithRetry(); 
}

startServer();