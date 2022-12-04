const jwt = require('jsonwebtoken');


// Generate an Access Token for the given User ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  generateToken: generateToken
}
