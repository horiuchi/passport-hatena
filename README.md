# Passport-Hatena
===============

OAuth1.0a npm package for [Hatena](http://www.hatena.ne.jp/)

[Passport](http://passportjs.org/) strategy for authenticating with [YConnect](http://developer.yahoo.co.jp/yconnect/) using the OAuth 2.0 API

This module can be used with passport in Node.js.
You can integrate into below applications or frameworks.
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-hatena

## Usage

### Configuration Strategy

This Hatena passport module requires your application' id. 
You can get this id from [Hatena Developer Center](http://developer.hatena.ne.jp/ja/documents/auth/apis/oauth)

### Authorization Endpoint

    passport.use(new HatenaStrategy({
        consumerKey: HATENA_CONSUMER_KEY,
        consumerSecret: HATENA_SECRET_KEY,
        callbackURL: "http://127.0.0.1:3000/auth/hatena/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ hatenaId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'hatena'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/hatena',
      passport.authenticate('hatena'), { scope: ['read_public'] });
    
    app.get('/auth/hatena/callback',
      passport.authenticate('hatena', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-tumblr/tree/master/examples/login).

### License

[The MIT License](http://opensource.org/licenses/MIT)

