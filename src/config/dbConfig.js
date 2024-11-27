const knex = require('knex');
require('dotenv').config();

// Configuração da conexão com o banco de dados PostgreSQL
const db = knex({
    client: 'pg',
    connection: {
        user: process.env.DB_USER,          // Usuário do PostgreSQL
        host: process.env.DB_HOST,            // Host do banco de dados (pode ser localhost ou IP do servidor)
        database: process.env.DB_PASSWORD,    // Nome do banco de dados
        password: process.env.DB_NAME,        // Senha do usuário do banco de dados
        port: 5432,
    }
});

module.exports = db;
