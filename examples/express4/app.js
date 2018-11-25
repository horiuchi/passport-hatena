const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const HatenaStrategy = require('passport-hatena').Strategy;

const HATENA_CONSUMER_KEY = '--insert-hatena-consumer-key-here--';
const HATENA_SECRET_KEY = '--insert-hatena-secret-key-here--';
const CALLBACK_URL = 'http://localhost:3000/auth/hatena/callback';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Hatena profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the HatenaStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Hatena profile), and
//   invoke a callback with a user object.
passport.use(
  new HatenaStrategy(
    {
      consumerKey: HATENA_CONSUMER_KEY,
      consumerSecret: HATENA_SECRET_KEY,
      callbackURL: CALLBACK_URL
    },
    (token, tokenSecret, profile, done) => {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's Hatena profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Hatena account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

const app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }));
app.use(express.static(__dirname + '/public'));

// Initialize Passport!
// Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// GET /auth/hatena
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Hatena authentication will involve redirecting
//   the user to hatena.ne.jp.  After authorization, Hatena will redirect the user
//   back to this application at /auth/hatena/callback
app.get(
  '/auth/hatena',
  passport.authenticate('hatena', { scope: ['read_public', 'write_public'] }),
  (req, res) => {
    // The request will be redirected to Hatena for authentication, so this
    // function will not be called.
  }
);

// GET /auth/hatena/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/hatena/callback',
  passport.authenticate('hatena', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
