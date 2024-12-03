const knex = require('../config/dbConfig');

exports.getProdutos = (req, res, next) => {
    knex('produtos')
        .select('*')
        .then((produtos) => {
            res.send(200, produtos);
        })
        .catch((error) => {
            res.send(500, { message: 'Erro ao buscar produtos', error: error.message });
        });
};

exports.addProduto = (req, res, next) => {
    const { nome_produto, preco, tipo, quantidade } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!nome_produto || !preco || !tipo) {
        res.send(400, { message: 'Todos os campos são obrigatórios.' });
        return next();
    }

    knex('produtos')
        .insert({ nome_produto, preco, tipo, quantidade }, ['id_produto', 'nome_produto', 'preco', 'tipo', 'quantidade'])
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
                return res.send(400, 'Este produto não foi encontrado');
            }
            res.send(200, `Produto com ID ${id} foi deletado com sucesso!`);
        })
        .catch(next);
};

exports.updateProduto = (req, res, next) => {
    const { id_produto } = req.params; // Obtém o ID do produto dos parâmetros da URL
    const produtoData = req.body; // Obtém os dados do produto a partir do corpo da requisição

    if (!id_produto) {
        return res.send(400, 'Este produto não foi encontrado');
    }

    knex('produtos')
        .where('id_produto', id_produto) // Filtra pelo ID do produto
        .update(produtoData) // Atualiza os dados do produto
        .then((dados) => {
            if (dados) {
                res.send({ message: 'Produto atualizado com sucesso!', dados });
            } else {
                return res.send(404, 'Este produto não foi encontrado');
            }
        })
        .catch(error => {
            console.error(error);
            res.send(500, { message: 'Erro ao atualizar produto', error });
        });
}

exports.getProdutosbyId = (req, res, next) => {
    const { id_produto } = req.params;

    if (!id_produto) {
        return res.send(400, 'Este produto não foi encontrado');
    }
    knex('produtos')
        .where('id_produto', id_produto)
        .first()
        .then((produto) => {
            if (!produto) {
                return res.send(404, { message: 'Produto não encontrado' });
            }
            res.send(200, produto);
            console.log('Produto recebido da API:', produto);

        })
        .catch((error) => {
            res.send(500, { message: 'Erro ao buscar produtos', error: error.message });
        });
};
