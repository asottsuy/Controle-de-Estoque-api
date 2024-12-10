const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
require('dotenv').config();  // Carrega variáveis do .env

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    callbackURL: process.env.OAUTH2_REDIRECT_URI,
    scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    const user = { accessToken, profile }; // Cria um objeto representando o usuário autenticado
    return done(null, user);
}));

module.exports = passport;
