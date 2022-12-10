Here is a simple express js app that uses Google OAuth 2.0 for authentication:

First, we will require the necessary modules and initialize the express app:

Copy code
```js
const express = require('express')
const app = express()
const request = require('request')
const querystring = require('querystring')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
Next, we will define the necessary constants and variables, including the client ID and client secret that we obtained from the Google API Console:

Copy code
const GOOGLE_CLIENT_ID = 'Your client ID here'
const GOOGLE_CLIENT_SECRET = 'Your client secret here'
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/oauth2callback'

let accessToken = ''
let refreshToken = ''
Then, we will define the routes for the app. The first route is for the authorization URL, which will redirect the user to the Google login page:

Copy code
app.get('/authorize', (req, res) => {
  const query = querystring.stringify({
    response_type: 'code',
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    scope: 'https://www.googleapis.com/auth/calendar',
    access_type: 'offline'
  })

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${query}`)
})
The next route is the callback URL that will be called by Google after the user has logged in and granted access to the app. This route will exchange the authorization code for an access token and a refresh token:

Copy code
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code

  request.post({
    url: 'https://oauth2.googleapis.com/token',
    form: {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
  }, (err, response, body) => {
    if (err) {
      res.status(500).send('Error')
      return
    }

    const data = JSON.parse(body)
    accessToken = data.access_token
    refreshToken = data.refresh_token

    res.send('Successfully authenticated')
  })
})
Finally, we can add a route that uses the access token to make an API call to the Google Calendar API:

Copy code
app.get('/calendar', (req, res) => {
  if (!accessToken) {
    res.status(401).send('Not authenticated')
    return
  }

  request.get({
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    headers: {
      'Authorization


Try again