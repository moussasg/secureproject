const express = require('express');
const app = express(); // Add parentheses to call the express function
const mongoose = require('mongoose');
require('dotenv').config(); // Chargez les variables d'environnement du fichier .env
const authController = require('./src/controllers/authController')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {checkUser } = require('./src/controllers/authController')
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.post('/signup', authController.signup_post);
app.post('/login', authController.login_post);
app.post('/MesSmartphones/:id', authController.commands_post)
app.get('/users', authController.users_get); // get all users
app.get('/user', authController.user_get); // get spécifique user
/*
app.get('/logout', authController.requireAuth, (req, res) => {
  res.render('logout');
});
*/
// Route '/logout' - GET route for user logout
/*
app.get('/logout', authController , (req,res)=> {
  res.render('logout');
});
*/
// Middleware
app.get('*', checkUser);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
const dburi = process.env.DBURI;
mongoose.connect(dburi ,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { /// je peut faire ici connect aprés les autre collection createconnection
  console.log('Connected to userauth and commands');  
})
.catch((error) => {
  console.error('erreur userauth', error);
})
const PORT = process.env.PORT 
app.listen(PORT, ()=> {
  console.log('serveur started') 
})


