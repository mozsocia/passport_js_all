const passport = require('passport');
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel')

const passportConfig = {
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
  callbackURL: `http://localhost:${process.env.PORT}/api/authentication/google/redirect`
};
// console.log(passportConfig);

if (passportConfig.clientID) {
  passport.use(new GoogleStrategy(passportConfig, async (request, accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    let name = profile.displayName
    let email = profile.emails[0].value
    let password = "123123123"

    // Check if user exists
    let user = await User.findOne({ email })
    if (!user) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user
      user = await User.create({
        name,
        email,
        googleid: profile.id,
        password: hashedPassword,
      })
    }
    // console.log(user);
    return done(null, user);
    
  }));
}
