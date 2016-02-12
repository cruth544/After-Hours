var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('facebook', new FacebookStrategy({
    clientID        : "211605595851273",
    clientSecret    : "16036851e83f19820752cb80450b4caf",
    callbackURL     : 'http://after-hours-now.herokuapp.com/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails']
  }, function(access_token, refresh_token, profile, done) {

    // // Use this to see the information returned from Facebook
    console.log(profile)

    process.nextTick(function() {
      //find the user in the database based on their facebook id
      User.findOne({ 'fb.id' : profile.id }, function(err, user) {
        //if there is an error, stop everything and return error
        if (err) {
          return done(err);
        }
        //else if user is found, log them in
        if (user) {
          return done(null, user);

        } else {
          //if there is no user in the database, make a new User
          //LEFT SIDE YOUR INFO = RIGHT SIDE FACEBOOK profile.x info/
          var newUser = new User();
          newUser.fb.id           = profile.id;
          newUser.fb.access_token = access_token;
          newUser.fb.firstName    = profile.name.givenName;
          newUser.fb.lastName     = profile.name.familyName;
          newUser.fb.email        = profile.emails[0].value;

          newUser.save(function(err) {
            if (err)
              throw err;
              return done(null, newUser);
          });
        }
      });
    });
  }));

};
