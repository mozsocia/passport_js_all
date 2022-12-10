can u give me a express js api with google oauth2.0 without passport 
Sure, here is an example of a simple Express.js API that uses Google OAuth 2.0 for authentication without using the Passport.js library:

Copy code
```js
const express = require('express')
const https = require('https')
const querystring = require('querystring')

const app = express()

app.get('/google-oauth2-callback', (req, res) => {
  // Extract the code from the query string
  const code = req.query.code

  // Construct the request options for exchanging the code for an access token
  const options = {
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // Create the request object
  const req = https.request(options, (response) => {
    let data = ''
    response.on('data', (chunk) => {
      data += chunk
    })
    response.on('end', () => {
      // Parse the response data as JSON
      const json = JSON.parse(data)

      // Extract the access token from the response
      const accessToken = json.access_token

      // Use the access token to authenticate requests to your API
    })
  })

  // Construct the request body
  const body = querystring.stringify({
    code: code,
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    redirect_uri: 'http://localhost:3000/google-oauth2-callback',
    grant_type: 'authorization_code'
  })

  // Write the request body to the request object
  req.write(body)

  // End the request
  req.end()
})

app.listen(3000)
```
This example defines a single route /google-oauth2-callback that is used as the redirect URI when authenticating with Google. When a user is redirected back to this route after authenticating, the code query parameter is extracted from the request and exchanged for an access token using the https module. Once the access token is obtained, it can be used to authenticate requests to your API.

You will need to replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with the client ID and client secret for your Google OAuth 2.0 app.

I hope this helps! Let me know if you have any other questions.



Try again