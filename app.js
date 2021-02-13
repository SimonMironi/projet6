const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const limiter = require('express-rate-limit');
const helmet = require('helmet');

//Router
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://Simon:RLqPPavlk8dbIx3R@cluster0.8izt8.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { 
    //Paramètrage de mongoose
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(cors());
app.options('*', cors());

//HTTP headers protections
app.use(helmet());

//DDOS
app.use(limiter({
  windowMs: 5000,
  max: 20,
  message: {
    code: 429,
    message: 'Trop de requêtes, réessayez plus tard'
  }
}));

//Transforme les requêtes en format exploitable
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;