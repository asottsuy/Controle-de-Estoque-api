const restify = require('restify');
const path = require('path');
const prodRoutes = require('./routes/prodRoutes');

const server = restify.createServer({
    name: "Controle de lucros e estoque",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Configuração das rotas
prodRoutes(server);

// Serve o arquivo index.html da pasta public
server.get('/', restify.plugins.serveStatic({
    directory: path.join(__dirname, 'public'),
    default: 'index.html'
}));

// Inicia o servidor
server.listen(8001, function () {
    console.log("%s executando em: %s", server.name, server.url);
});
