const oauth2Controller = require('../controllers/oauth2Controller'); // Importa o controlador

module.exports = (server) => {
    // Rota para redirecionar o usuário para o provedor OAuth2
    server.get('/auth', oauth2Controller.redirectToAuth);

    // Rota de callback para lidar com o retorno do OAuth2
    server.get('/callback', oauth2Controller.handleCallback);

    // Rota para logout
    server.get('/logout', oauth2Controller.logout);
};
