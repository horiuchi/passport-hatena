/**
 * Module dependencies.
 */
var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Hatena authentication strategy authenticates requests by delegating to
 * Hatena using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Hatena
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Hatena will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new HatenaStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/hatena/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://www.hatena.com/oauth/initiate';
  options.accessTokenURL = options.accessTokenURL || 'https://www.hatena.com/oauth/token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://www.hatena.ne.jp/oauth/authorize';
  options.sessionKey = options.sessionKey || 'oauth:hatena';

  OAuthStrategy.call(this, options, verify);
  this.name = 'hatena';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Hatena.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `username`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.get('http://n.hatena.com/applications/my.json', token, tokenSecret, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'hatena' };
      profile.id = json.url_name;
      profile.displayName = json.display_name;
      profile.photos = [{
        value: json.profile_image_url
      }];

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Return extra Hatena-specific parameters to be included in the request token
 * request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.requestTokenParams = function(options) {
  var params = options || {};

  var scope = options.scope;
  if (scope) {
    if (Array.isArray(scope)) { scope = scope.join(','); }
    params['scope'] = scope;
  }
  return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
