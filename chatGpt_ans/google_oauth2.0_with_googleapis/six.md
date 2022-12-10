can u give me a express js api with google oauth2.0 which use jwt  without passport  and cookies or session using googleapis
Here is an example of an express.js API that uses Google OAuth2.0 with JWT without using passport or cookies or session:

```js
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const google = require('googleapis')
const OAuth2 = google.auth.OAuth2

const clientId = '<your-client-id>'
const clientSecret = '<your-client-secret>'
const redirectUrl = '<your-redirect-url>'
const scope = ['https://www.googleapis.com/auth/userinfo.email']

// Create an OAuth2 client object
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

app.get('/google-auth', (req, res) => {
// Generate the URL for authentication
const url = oauth2Client.generateAuthUrl({
access_type: 'offline', // Indicates that we need a refresh token
scope: scope
})

// Redirect the user to the authentication URL
res.redirect(url)
})

app.get('/oauth2callback', (req, res) => {
// Get the authorization code from the query string
const code = req.query.code

// Exchange the code for an access and refresh token
oauth2Client.getToken(code, (err, tokens) => {
if (err) {
res.send('An error occurred while getting the access token: ' + err)
} else {
// Set the access token on the OAuth2 client
oauth2Client.setCredentials(tokens)


  // Use the OAuth2 client to get the user's profile information
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  })
  oauth2.userinfo.get((err, profile) => {
    if (err) {
      res.send('An error occurred while getting the user profile: ' + err)
    } else {
      // Generate a JSON Web Token (JWT) with the user's profile information
      const jwtToken = jwt.sign(profile, '<your-jwt-secret>')

      // Send the JWT to the client
      res.send(jwtToken)
    }
  })
}
})
})

app.listen(3000, () => {
console.log('Server listening on port 3000')
})



Try again
