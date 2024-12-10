const restify = require('restify');
const path = require('path');
const prodRoutes = require('./routes/prodRoutes');
const oauth2Routes = require('./routes/oauth2Routes'); // Importa as rotas OAuth2

require('./config/oauth2Config');

const server = restify.createServer({
    name: "Controle de lucros e estoque",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Configuração das rotas
prodRoutes(server);
oauth2Routes(server); // Registra as rotas OAuth2

server.get('/*', restify.plugins.serveStatic({
    directory: path.join(__dirname, '..', 'public'),
    default: 'index.html'
}));

// Inicia o servidor
server.listen(8001, function () {
    console.log("%s executando em: %s", server.name, server.url);
});
