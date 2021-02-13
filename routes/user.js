const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passValidator = require('../middleware/password');
const ExpressBrute = require('express-brute');

var store = new ExpressBrute.MemoryStore(); //ne pas utiliser en prod
var bruteforce = new ExpressBrute(store);

router.post('/signup', passValidator, userCtrl.signup);
router.post('/login', bruteforce.prevent, userCtrl.login);

module.exports = router;