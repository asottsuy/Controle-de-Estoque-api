// Função para carregar produtos
function carregarProdutos() {
    // Fazendo a requisição para o servidor
    fetch('http://localhost:8001/api/produtos')
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            const container = document.getElementById('dataContainer');
            container.innerHTML = ''; // Limpa o conteúdo anterior

            // Verificando se há produtos para exibir
            if (data.length === 0) {
                container.innerHTML = '<p>Não há produtos para exibir.</p>';
            } else {
                // Exibe cada produto como um bloco separado
                data.forEach(produto => {
                    const produtoDiv = document.createElement('div');
                    produtoDiv.classList.add('produto'); // Adiciona uma classe para estilizar

                    // Adicionando as informações do produto no formato HTML
                    produtoDiv.innerHTML = `
                        <strong>ID:</strong> ${produto.id_produto} <br>
                        <strong>Nome:</strong> ${produto.nome_produto} <br>
                        <strong>Preço:</strong> R$ ${produto.preco} <br>
                        <strong>Tipo:</strong> ${produto.tipo} <br>
                        <strong>Quantidade:</strong> ${produto.quantidade} <br><br>
                        <button class="editButton" data-id="${produto.id_produto}">Editar</button>
                    `;

                    // Adiciona o produto no container
                    container.appendChild(produtoDiv);
                });
                const editButtons = document.querySelectorAll('.editButton');
                editButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const id = this.getAttribute('data-id');
                        editarProduto(id);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert('Erro ao carregar produtos.');
        });
}

document.getElementById('getData').addEventListener('click', () => {
    console.log('Botão foi clicado');
    carregarProdutos();
});

function adicionarProdutos() {
    const form = document.getElementById('productForm');

    // Captura os valores do formulário
    const nome_produto = document.getElementById('nome_produto').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    // Cria o objeto do produto
    const produto = {
        nome_produto,
        preco,
        tipo,
        quantidade
    };

    // Faz a requisição POST para o servidor
    fetch('http://localhost:8001/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto) // Envia o produto no corpo da requisição
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar produto');
            }
            return response.json();
        })
        .then(data => {
            alert('Produto adicionado com sucesso!');
            form.reset(); // Limpa o formulário
            carregarProdutos(); // Atualiza a lista de produtos
        })
        .catch(error => {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao salvar produto.');
        });
}
// Função para editar um produto
function editarProduto(id) {
    // Faz a requisição para pegar o produto pelo ID
    fetch(`http://localhost:8001/api/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            // Preenche o formulário com os dados do produto
            document.getElementById('editId').value = produto.id_produto;
            document.getElementById('nome_produto').value = produto.nome_produto;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('tipo').value = produto.tipo;
            document.getElementById('quantidade').value = produto.quantidade;

            // Exibe o formulário para edição
            document.getElementById('formContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar produto para edição:', error);
            alert('Erro ao carregar produto para edição.');
        });
}
// Função para adicionar ou atualizar um produto
function salvarProduto(event) {
    event.preventDefault(); // Impede o envio normal do formulário

    const id = document.getElementById('editId').value; // Obtém o ID do produto se estiver editando
    const nome_produto = document.getElementById('nome_produto').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const produto = {
        nome_produto,
        preco,
        tipo,
        quantidade
    };

    let url = 'http://localhost:8001/produtos';
    let method = 'POST';

    if (id) {
        // Se o ID estiver presente, é uma atualização
        url += `/${id}`;
        method = 'PUT'; // Muda o método para PUT para atualização
    }

    // Faz a requisição para adicionar ou atualizar o produto
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(data => {
            alert(id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
            document.getElementById('productForm').reset(); // Limpa o formulário
            document.getElementById('formContainer').style.display = 'none'; // Oculta o formulário
            carregarProdutos(); // Atualiza a lista de produtos
        })
        .catch(error => {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto.');
        });
}

// Adiciona o evento de submissão ao formulário
document.getElementById('productForm').addEventListener('submit', event => {
    event.preventDefault(); // Evita o envio padrão do formulário
    adicionarProdutos(); // Chama a função para adicionar o produto
});

// Adicionar evento para exibir o formulário ao clicar no botão "Adicionar Produtos"
document.getElementById('addData').addEventListener('click', () => {
    const formContainer = document.getElementById('formContainer');
    // Alternar a exibição do formulário (mostrar ou ocultar)
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
});