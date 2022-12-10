can u give me a express js api with google oauth2.0 which use jwt  without passport  and cookies or session
Sure, here is an example of an Express JS API using Google OAuth 2.0 with JWT authentication without using Passport or cookies/sessions:

First, we will need to install the necessary packages for handling OAuth and JWT authentication:

Copy code
npm install express google-auth-library jsonwebtoken
Then, in our Express app, we will set up our OAuth configuration and JWT secret:

Copy code
```js
const express = require('express')
const app = express()
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')

const client = new OAuth2Client(CLIENT_ID)
const JWT_SECRET = 'my-secret-key'
Next, we will create a route for handling the OAuth authentication and token exchange:

Copy code
app.get('/auth/google', async (req, res) => {
  try {
    const token = req.query.code
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    })
    const payload = ticket.getPayload()
    const user = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub
    }
    // Create JWT token
    const accessToken = jwt.sign(user, JWT_SECRET)
    res.json({ accessToken })
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' })
  }
})
Finally, we can create a middleware for validating JWT tokens on protected routes:

Copy code
app.use((req, res, next) => {
  const token = req.headers['x-access-token']
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Invalid token' })
      }
      req.user = decoded
      next()
    })
  } else {
    res.status(401).send({ error: 'No token provided' })
  }
})
This middleware will check for the presence of a JWT token in the request headers and verify its validity. If the token is valid, it will add the decoded user information to the request object for use in the protected routes. Otherwise, it will return an error.

With this setup, we can now create protected routes that require JWT authentication:

Copy code
app.get('/profile', (req, res) => {
  res.json({ user: req.user })
})
This route will only be accessible if a valid JWT token is provided in the request headers.

Hope this helps!



Try again
