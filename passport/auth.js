var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var userController = require('../controllers/userController')

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/user/facebook/callback",
    profileFields : ['displayName','name','picture.type(large)','email']
  }, 
  async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value
      const username = profile.name.givenName + profile.name.familyName
      var user = await userController.findUserByEmail(email)
      if(!user){
        const newUser = await userController.createNewUser({
          username: username,
          password: '1234',
          email: email
        })
        await  newUser.save()
        user = newUser
      }
      done(null, user) 
  }
));

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser(async (id, done) => {
  const user = await userController.findById(id)
  done(null, user);
});
