require('dotenv').config();
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        user: process.env.DB_USER,          // Usuário do PostgreSQL
        host: process.env.DB_HOST,            // Host do banco de dados (pode ser localhost ou IP do servidor)
        database: process.env.DB_NAME,    // Nome do banco de dados
        password: process.env.DB_PASSWORD,        // Senha do usuário do banco de dados
        port: 5432,
    }
});

module.exports = db;

