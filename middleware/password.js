  
const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {          
    if (!passwordSchema.validate(req.body.password)) {  
        
        res.writeHead(400, 'Votre mot de passe n\'a pas le format approprié, il doit contenir au moins 8 caractère, un maximum de 50 carractères, au moins une majuscule, une minuscule, 3 chiffres et pas d\'espace', {
            'content-type': 'application/json'
        });
        res.end('Votre mot de passe n\'a pas le format approprié');
    } else {
        next();
    }
};