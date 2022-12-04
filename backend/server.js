const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const passport = require('passport');
const { generateToken } = require('./util/tokenGen')
require('./config/google');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


function generateUserToken(req, res) {
  // const accessToken = token.generateAccessToken(req.user.id);

  console.log("id",req.user._id);
  let obj = {
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    token: generateToken(req.user._id),
  }
  const query = '?' + new URLSearchParams(obj).toString();
 
  res.redirect(`http://localhost:3000/login-google${query}`);

}

app.get('/api/authentication/google/start',
  passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));

app.get('/api/authentication/google/redirect',
  passport.authenticate('google', { session: false }),
  generateUserToken);


app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
