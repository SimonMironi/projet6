const passwordValidator = require('password-validator');        

const passwordSchema = new passwordValidator();     

passwordSchema
.is().min(8)
.is().max(50)                                     
.has().uppercase()                              
.has().lowercase()                              
.has().digits(3)                                 
.has().not().spaces()                           
.is().not().oneOf(['Admin12345', 'Motdepasse123', 'Password123', 'Admin12345', 'Azerty123', 'Qwerty123']); 

module.exports = passwordSchema;