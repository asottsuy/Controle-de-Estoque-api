// Importa a configuração do Knex
const knex = require('./src/config/dbConfig');

// Testando a conexão
knex.raw('SELECT 1 + 1 AS result')
  .then(result => {
    console.log('Conexão bem-sucedida!', result); // Se a conexão funcionar
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err); // Se houver erro na conexão
  })
  .finally(() => {
    knex.destroy(); // Fechar a conexão após o teste
  });
