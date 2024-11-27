const knex = require('../config/dbConfig');

exports.getProdutos = (req, res, next) => {
    knex('produtos')
        .select('*')
        .then((produtos) => {
            res.send(produtos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        });
};

exports.addProduto = (req, res, next) => {
    const { nome_produto, preco, tipo } = req.body;

    knex('produtos')
        .insert({ nome_produto, preco, tipo }, ['id_produto', 'nome_produto', 'preco', 'tipo'])
        .then(([newProduto]) => {
            res.send(201, newProduto);
            return next();
        })
        .catch((error) => {
            res.send(500, { message: 'Erro ao adicionar produto', error });
            return next();
        });
};

exports.deleteProduto = (req, res, next) => {
    const id = req.params.id;

    knex('produtos')
        .where('id_produto', id)
        .delete()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError('Este produto não foi encontrado'));
            }
            res.send(200, `Produto com ID ${id} foi deletado com sucesso!`);
        })
        .catch(next);
};