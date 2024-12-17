/*QUESTÃO 1 - VIEW
Construir uma view capaz de listar todos os clientes e seus respectivos pets. A view deve apresentar as
informações de: código e nome do cliente e ainda o nome, tipo e raça de cada pet do cliente. Todos os dados
devem estar ordenados pelo nome do cliente. */
SELECT * FROM MYPET.TIPO_PETS;
SELECT * FROM MYPET.PETS;
SELECT * FROM MYPET.CLIENTES;

CREATE VIEW vwClientePets AS
SELECT 
	C.CLIENTE_ID AS CODIGO_CLIENTE,
	C.NOME AS NOME_CLIENTE,
	P.NOME AS NOME_PET,
	TP.NOME_TIPO AS TIPO_PET,
	TP.RACA AS RACA_PET
FROM 
	MYPET.CLIENTES C
LEFT JOIN
	MYPET.PETS P ON C.CLIENTE_ID = P.CLIENTE_ID
LEFT JOIN
	MYPET.TIPO_PETS TP ON P.TIPO_PETS_ID = TP.TIPO_PETS_ID
ORDER BY
	C.NOME;
	
SELECT * FROM vwClientePets;

/* QUESTÃO 2 - FUNCTION
Construir uma função capaz de obter a quantidade de pets que um cliente possui. A pesquisa será baseada no
código do cliente e o retorno desta função deve ser somente um valor numérico com a quantidade de pets
que o cliente informado possuir. */

CREATE OR REPLACE FUNCTION QuantidadePetsPorCliente (p_cliente_id NUMBER) 
RETURN NUMBER IS 
    qtd_de_pets NUMBER; -- Declare a variável
BEGIN
    SELECT COUNT(*) -- Conta a quantidade de pets por id
    INTO qtd_de_pets -- Variável onde vou armazenar a contagem
    FROM MYPET.PETS -- Base de dados que vou resgatar
    WHERE CLIENTE_ID = p_cliente_id; -- Condição de quando a lógica da contagem deve ser acionada

    RETURN qtd_de_pets; -- Retorna a quantidade de pets
END QuantidadePetsPorCliente;

SELECT QuantidadePetsPorCliente(9) AS QUANTIDADE_PETS FROM DUAL;

/* QUESTÃO 3 - FUNCTION
Criar uma função que totalize os gastos de cliente considerando as notas emitidas para ele. A função deve
considerar separadamente as notas de produtos e serviços, ou seja, ao usar a função devemos informar qual
totalizador desejamos obter. Ou seja, ao pesquisar o total deve ser possível identificar se o total de gastos será
de produtos ou se será de serviços. */

-- CLIENTES => NOTAS_FISCAIS => NOTAS_FISCAIS_ITENS => SERVICOS

SELECT * FROM MYPET.CLIENTES;
SELECT * FROM MYPET.NOTAS_FISCAIS;
SELECT * FROM MYPET.NOTAS_FISCAIS_ITENS;
SELECT * FROM MYPET.SERVICOS;
SELECT * FROM MYPET.CLIENTES;
SELECT * FROM MYPET.PRODUTOS;

CREATE OR REPLACE FUNCTION GastoTotal (nt_cliente_id NUMBER, gasto_tipo VARCHAR)
RETURN NUMBER IS 
	gastoTotal NUMBER := 0;
BEGIN
	IF gasto_tipo = 'P' THEN
		SELECT SUM(VALOR_TOTAL) 
		INTO gastoTotal
		FROM MYPET.NOTAS_FISCAIS
		WHERE CLIENTE_ID = nt_cliente_id AND TIPO_NOTA_FISCAL = 'P';
	ELSIF gasto_tipo = 'S' THEN
		SELECT SUM(VALOR_TOTAL) 
		INTO gastoTotal
		FROM MYPET.NOTAS_FISCAIS
		WHERE CLIENTE_ID = nt_cliente_id AND TIPO_NOTA_FISCAL = 'S';
	END IF;

	RETURN gastoTotal;
END GastoTotal;

SELECT GastoTotal(2, 'P') AS TotalProdutos FROM DUAL;
SELECT GastoTotal(2, 'S') AS TotalServicos FROM DUAL;

/*QUESTÃO 4
A empresa MYPET deseja realizar uma campanha de marketing com seus clientes. Nesta campanha será
efetuado o contato com estes clientes, a fim de obter um maior engajamento é importante saber qual o
montante médio gasto pelos clientes. Para atender essa necessidade devemos criar uma view que apresente
a listagem de todos os clientes da MYPET informando o seu nome, telefone e e-mail. Esta mesma listagem
deve apresentar o número total de pets que cada cliente possui (utilizar a função da Questão 2), os dados de
gastos com produtos e serviços individualizados (utilizar a função da Questão 3). Por fim deve informar o ticket
médio de gastos de cada cliente (total de gastos / nº de pets).*/

-- montante medio dos clientes
-- criar uma view que liste: nome, telefone, email, num total de pets que cada cli possui (QuantidadePetsPorCliente), dados de gastos de prod ou serv (GastoTotal), ticket medio de cada cliente (GastoTotal / QuantidadePetsPorCliente)

CREATE OR REPLACE VIEW vwticketMedio AS
SELECT 
    C.NOME AS NOME_CLIENTE,
    C.TELEFONE AS TELEFONE_CLIENTE,
    C.EMAIL AS EMAIL_CLIENTE,
    QuantidadePetsPorCliente(C.CLIENTE_ID) AS QUANTIDADE_PETS,
    GastoTotal(C.CLIENTE_ID, 'P') AS TotalProdutos,
    GastoTotal(C.CLIENTE_ID, 'S') AS TotalServicos,
    (GastoTotal(C.CLIENTE_ID, 'P') + GastoTotal(C.CLIENTE_ID, 'S')) / NULLIF(QuantidadePetsPorCliente(C.CLIENTE_ID), 0) AS TICKET_MEDIO
FROM 
    MYPET.CLIENTES C;

SELECT * FROM vwticketMedio;


/* QUESTÃO 5 - PROCEDURE
Cria uma procedure que realize o cadastro de agendamento de serviços para a empresa MYPET. Sempre neste
tipo de operação é importante cuidar os campos necessários para o cadastramento na tabela. É importante
que neste procedimento de cadastro seja utilizado os controles de exceções prevenindo erros indesejados. */

SELECT * FROM MYPET.AGENDAMENTOS

CREATE OR REPLACE PROCEDURE CadastrarAgendamento (
    p_CLIENTE_ID NUMBER,
    p_PET_ID NUMBER,
    p_VETERINARIO_ID NUMBER,
    p_SERVICO_ID NUMBER,
    p_DATA_HORA TIMESTAMP,
    p_STATUS VARCHAR2
) 
IS 
    v_agendamento_id NUMBER; -- Variável para armazenar o ID do agendamento
BEGIN 
    -- Obter o próximo ID de agendamento
    SELECT NVL(MAX(AGENDAMENTO_ID), 0) + 1
    INTO v_agendamento_id
    FROM MYPET.AGENDAMENTOS;

    -- Inserir o novo agendamento
    INSERT INTO MYPET.AGENDAMENTOS (AGENDAMENTO_ID, CLIENTE_ID, PET_ID, VETERINARIO_ID, SERVICO_ID, DATA_HORA, STATUS)
    VALUES (v_agendamento_id, p_CLIENTE_ID, p_PET_ID, p_VETERINARIO_ID, p_SERVICO_ID, p_DATA_HORA, p_STATUS);
    
    COMMIT; -- Confirmar a transação
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK; -- Reverte em caso de erro
        RAISE_APPLICATION_ERROR(-20001, 'Erro: ID de agendamento já existe.');
    WHEN OTHERS THEN
        ROLLBACK; -- Reverte em caso de erro
        RAISE_APPLICATION_ERROR(-20000, 'Erro ao cadastrar agendamento: ' || SQLERRM);
END CadastrarAgendamento;
/


BEGIN
    CadastrarAgendamento(
        p_CLIENTE_ID => 5, -- Exemplo de cliente
        p_PET_ID => 36,    -- Exemplo de pet
        p_VETERINARIO_ID => 2, -- Exemplo de veterinário
        p_SERVICO_ID => 17,  -- Exemplo de serviço
        p_DATA_HORA => TO_TIMESTAMP('2024-11-10 14:00:00.000', 'YYYY-MM-DD HH24:MI:SS.FF'),
        p_STATUS => 'A'    -- Status de agendamento
    );
    DBMS_OUTPUT.PUT_LINE('Agendamento cadastrado com sucesso!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Erro ao cadastrar agendamento: ' || SQLERRM);
END;



