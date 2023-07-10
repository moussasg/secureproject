import express from 'express';
import nodemailer from "nodemailer"; // on l'utilise quand on créer Transport
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.DBU, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Unable to connect to the database', error);
  });
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);
/// envoyé email par node.js ; sendMail on l'introduit dans le Post requette
const sendMail = (receiver) => { // sendMail on la réutilise  aprés tranporter ndiroha dakhel to
  return new Promise((resolve, reject) => { // resolve en cas de réussite // reject if error
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'moussaswag5@gmail.com',
        pass: 'omxwbebucpedfgcb' // security dans google acount il faut activé 2 authentification
      }
    });
    transporter.sendMail({
      from: 'moussaswag5@gmail.com',
      to: receiver,
      subject: 'Registration Hydra smartphones',
      text: 'Thank you for registration',
    }, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  } // fin de promise
  );
};//// fin de sendmail
/// post un email sur le serveur
app.post('/send_mail', (req, res) => {
  sendMail(req.body.receiver)
    .then((response) => res.send(response.messageId))
    .catch((error) => res.status(500).send(error.message));
});
/////
app.post('/api/users/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({ email, password });
    await newUser.save();
    console.log(`email: ${email}, password: ${password} / inserted into "test" collection with ID ${newUser._id}`);
    res.send(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/api/users/', async (req, res) => {
  const { email, password } = req.query;
  try {
    const existingUser = await User.findOne({ email, password });
    res.json({ exists: existingUser !== null });
  } catch (err) {
    console.error('Une erreur s\'est produite lors de la vérification de l\'utilisateur', err);
    res.status(500).send(err);
  }
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.listen(3002, () => {
  console.log('Server started on port 3002');
});