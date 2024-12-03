let editOrAdd = null;

function carregarProdutos() {
    fetch('http://localhost:8001/api/produtos')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('dataContainer');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>Não há produtos para exibir.</p>';
            } else {
                data.forEach(produto => {
                    const produtoDiv = document.createElement('div');
                    produtoDiv.classList.add('produto');
                    produtoDiv.innerHTML = `
                        <strong>ID:</strong> ${produto.id_produto} <br>
                        <strong>Nome:</strong> ${produto.nome_produto} <br>
                        <strong>Preço:</strong> R$ ${produto.preco} <br>
                        <strong>Tipo:</strong> ${produto.tipo} <br>
                        <strong>Quantidade:</strong> ${produto.quantidade} <br><br>
                        <button class="editButton" data-id="${produto.id_produto}">Editar</button>
                        <button class="deleteButton" data-id="${produto.id_produto}">Deletar</button>
                    `;
                    container.appendChild(produtoDiv);
                });

                const editButtons = document.querySelectorAll('.editButton');
                editButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const id = this.getAttribute('data-id');
                        console.log(id);
                        editarProduto(id);
                        console.log('Botão Editar clicado. ID:', id);
                    });
                });

                const deleteButtons = document.querySelectorAll('.deleteButton');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const id = this.getAttribute('data-id');
                        console.log(id);
                        deletarProduto(id);
                        console.log('Botão Deletar clicado. ID:', id);
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
    carregarProdutos();
});

function adicionarProdutos() {
    const form = document.getElementById('productForm');
    editOrAdd = "add";

    const nome_produto = document.getElementById('nome_produto').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const produto = { nome_produto, preco, tipo, quantidade };

    fetch('http://localhost:8001/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar produto');
            }
            return response.json();
        })
        .then(data => {
            alert('Produto adicionado com sucesso!');
            form.reset();
            carregarProdutos(); 
        })
        .catch(error => {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao salvar produto.');
        });
}

function editarProduto(id) {
    editOrAdd = "edit";
    fetch(`http://localhost:8001/api/produtos/${id}`)
        .then(response => response.json())

        .then(produto => {

            console.log('Preenchendo formulário com:', produto);

            if (Array.isArray(produto)) {
                produto = produto[0];
            }

            document.getElementById('editId').value = produto.id_produto;
            document.getElementById('nome_produto').value = produto.nome_produto;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('tipo').value = produto.tipo;
            document.getElementById('quantidade').value = produto.quantidade;

            document.querySelector('#formContainer h2').textContent = 'Editar Produto';
            document.querySelector('.submit-button').textContent = 'Atualizar Produto';

            document.getElementById('formContainer').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar produto para edição:', error);
            alert('Erro ao carregar produto para edição.');
        });
}

function salvarProduto(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const nome_produto = document.getElementById('nome_produto').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const produto = { nome_produto, preco, tipo, quantidade };

    let url = 'http://localhost:8001/produtos';
    let method = 'POST';

    if (id) {
        url += `/update/${id}`;
        method = 'PUT';
    }

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
            document.getElementById('productForm').reset();
            document.getElementById('formContainer').style.display = 'none';
            carregarProdutos();
        })
        .catch(error => {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto.');
        });
}


function deletarProduto(id) {
    const confirmar = confirm("Tem certeza de que deseja remover este produto?");

    if (confirmar) {
        fetch(`http://localhost:8001/produtos/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao remover produto');
                }
                return response.json();
            })
            .then(data => {
                alert('Produto removido com sucesso!');
                carregarProdutos();
            })
            .catch(error => {
                console.error('Erro ao remover produto:', error);
                alert('Erro ao remover produto.');
            });
    } else {
        alert('A remoção foi cancelada.');
    }
}


document.getElementById('productForm').addEventListener('submit', salvarProduto);

document.getElementById('addData').addEventListener('click', () => {
    const formContainer = document.getElementById('formContainer');

    document.getElementById('productForm').reset();

    editOrAdd = "add";

    document.querySelector('#formContainer h2').textContent = 'Adicionar Produto';
    document.querySelector('.submit-button').textContent = 'Adicionar Produto';

    formContainer.style.display = 'block';
});
