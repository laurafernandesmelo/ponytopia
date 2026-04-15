/**
 * controller.js - Ponte entre HTML e Banco de Dados
 */

document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');
    const displayDB = document.getElementById('dados-salvos-db');

    // Função para listar os dados na tela
    async function listarDados() {
        if (!displayDB) return;
        
        try {
            const itens = await buscarItens();
            displayDB.innerHTML = '<h3 style="color: #800080; margin-top: 20px;">Exploradores no Banco (IndexedDB):</h3>';
            
            if (itens.length === 0) {
                displayDB.innerHTML += '<p style="font-size: 14px; color: #666;">Nenhum dado salvo no banco ainda.</p>';
                return;
            }

            itens.forEach(item => {
                const card = document.createElement('div');
                card.style.cssText = `
                    background: #fcfaff;
                    border: 1px solid #eee;
                    padding: 10px;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    text-align: left;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;
                
                card.innerHTML = `
                    <div>
                        <strong>${item.nome}</strong><br>
                        <small>Pônei: ${item.poney} | Gênero: ${item.genero}</small>
                    </div>
                    <button onclick="removerDoBanco(${item.id})" style="width: auto; padding: 5px 10px; background: #dc3545; font-size: 12px; margin: 0;">Excluir</button>
                `;
                displayDB.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao listar dados:", error);
        }
    }

    // Evento de envio do formulário
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Captura dos dados
            const nome = document.getElementById('nome').value;
            const nascimento = document.getElementById('nascimento').value;
            const genero = document.getElementById('genero').value;
            const senha = document.getElementById('senha').value;

            // poneySelecionado é uma variável global definida no script.js
            if (!poneySelecionado) {
                alert("Por favor, selecione um pônei antes de salvar!");
                return;
            }

            // Monta o objeto
            const novoRegistro = {
                nome,
                nascimento,
                genero,
                senha: btoa(senha), // Simulação de hash
                poney: poneySelecionado,
                dataRegistro: new Date().toLocaleString()
            };

            try {
                // Envia para o db.js
                await adicionarItem(novoRegistro);
                alert("Dados salvos com sucesso no IndexedDB! ✨");
                
                // Limpa o formulário e atualiza a lista
                formCadastro.reset();
                listarDados();
                
                // Opcional: Chama a função original de cadastro se quiser manter o localStorage também
                // cadastrar(); 
            } catch (error) {
                alert("Erro ao salvar no banco de dados.");
                console.error(error);
            }
        });
    }

    // Função global para deletar (acessível pelo onclick do botão gerado dinamicamente)
    window.removerDoBanco = async (id) => {
        if (confirm("Deseja excluir este registro do banco?")) {
            await deletarItem(id);
            listarDados();
        }
    };

    // Inicializa a listagem ao carregar a página
    listarDados();
});
