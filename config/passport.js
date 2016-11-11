var passport =require('passport');
var LocalStrategy =require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function(user,done) {
  done(null,user._id);
});

passport.deserializeUser(function(id,done) {
  User.findById(id, function(err, user){
      done(err,user);
  });
});

passport.use('local-login',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
}, function(req,email,password,done) {
    User.findOne({email:email},function(err, user) {
      console.log(err);
      if (err) return done(err);
      if(!user){
        console.log('fff');
        return done(null,false,req.flash('loginMessage','No use found'));
      }
      if(!user.comparePassword(password)) {
        console.log('ccc');
        return done(null,false,req.flash('loginMessage','No use found'));
      }

      return done(null,user);
    });
}));

exports.isAuthenticated = function(req,res,next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}