```js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

// Set up the express app
const app = express();
app.use(bodyParser.json());



// Set up the Google OAuth2.0 client
const oauth2Client1 = new google.auth.OAuth2(
  'CLIENT_ID', // Replace with your client ID
  'CLIENT_SECRET', // Replace with your client secret
  'REDIRECT_URI' // Replace with your redirect URI
);

//another way 
const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri)


// route to redirect user to google oauth page
app.get('/google-oauth', (req, res) => {
  // create the authorization url for google oauth
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // enables refresh token
    scope: 'https://www.googleapis.com/auth/userinfo.email' // request access to user email
    // scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  });

  res.redirect(authorizationUrl);
});


// route to handle callback from google oauth
app.get('/google-oauth/callback', async (req, res) => {
  // get the authorization code from query params
  const code = req.query.code;

  // use the authorization code to get access token
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // use the access token to get user info
  const userInfo = await google.oauth2('v2').userinfo.get({
    auth: oauth2Client
  });

  // create a JWT token with user info
  const token = jwt.sign(userInfo.data, process.env.JWT_SECRET);

  // return the JWT token to client
  res.send(token);
});

```

###  another way 

```js
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const OAuth2Client = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URL;

// Create an OAuth2 client object
const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

// Generate the url that will be used for authorization
const authorizationUrl = oauth2Client.generateAuthUrl({
access_type: 'offline',
scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
});

router.get('/', (req, res) => {
// Redirect user to the authorization url
res.redirect(authorizationUrl);
});

router.get('/callback', (req, res) => {
// Extract the authorization code from the query parameters
const code = req.query.code;

// Use the code to get an access token
oauth2Client.getToken(code, (err, tokens) => {
if (err) {
return res.status(500).send('Error getting access token');
}


// Set the access token and refresh token
oauth2Client.setCredentials(tokens);

// Use the access token to get user information
const oauth2 = google.oauth2({
  version: 'v2',
  auth: oauth2Client
});
oauth2.userinfo.get((err, user) => {
  if (err) {
    return res.status(500).send('Error getting user information');
  }

  // Generate a JWT with user information as the payload
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Return the JWT to the client
  res.send(token);
});
});
});

module.exports = router;

```