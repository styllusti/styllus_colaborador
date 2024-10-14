document.addEventListener("DOMContentLoaded", function() {
    let abaAtual = ''; 
    const SHEET_ID = '1xJR50ekmwsZ1F2aCGqujaPvCZsW-iquWuyVPGyIg01o';
    const API_KEY = 'AIzaSyAEYoX7AH_0ZjCU7utv8JND73qAOdLSG3Q';
    let RANGE = ''; 
    let itemsList = [];
    let checkedItems = new Set(); 
    let checkedItemsArray = []; 
    let pedidosEncontrados = 0; 
    let pedidosNaoEncontrados = 0;

    function habilitarCampos() {
        const selectCidade = document.getElementById('select-cidade');
        const nomeInput = document.getElementById('nome-input');
        const dataInput = document.getElementById('data-input');
        const itemInput = document.getElementById('item-input');
        
        if (selectCidade.value) {
            abaAtual = selectCidade.value;
            RANGE = `${abaAtual}!A:C`;
            nomeInput.disabled = false;
            dataInput.disabled = false;
            itemInput.disabled = false;
        } else {
            nomeInput.disabled = true;
            dataInput.disabled = true;
            itemInput.disabled = true;
        }
    }
    
    function setDataAtual() {
        const dataInput = document.getElementById('data-input');
        const hoje = new Date().toISOString().split('T')[0];
        dataInput.value = hoje;
    }
    
    function verificarItem() {
        if (!abaAtual) {
            alert("Selecione a sua região");
            return;
        }
    
        const nomeInput = document.getElementById('nome-input');
        const itemInput = document.getElementById('item-input');
        const nome = nomeInput.value.trim();
        const item = itemInput.value.trim();
    
        if (!nome || !item.match(/^\d+$/)) {
            alert("Por favor, preencha o nome e insira apenas números no campo de item.");
            return;
        }
    
        if (checkedItems.has(item)) {
            alert("Este código já foi verificado.");
            itemInput.value = ''; // Limpa a caixa de digitação
            return;
        }
    
        if (itemsList.length === 0) {
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                itemsList = data.values ? data.values.flat() : [];
                verificarItemContinua(nome, item);
            })
            .catch(error => {
                console.error('Erro ao carregar lista de itens:', error);
            });
        } else {
            verificarItemContinua(nome, item);
        }
    }
    
    function verificarItemContinua(nome, item) {
        const resultList = document.getElementById('result-list');
        const listItem = document.createElement('li');
        if (itemsList.includes(item)) {
            listItem.textContent = `${item} - Encontrado`;
            pedidosEncontrados++; // Incrementa o contador de pedidos encontrados
        } else {
            listItem.textContent = `${item} - Não encontrado`;
            listItem.classList.add('nao-listado');
            pedidosNaoEncontrados++; // Incrementa o contador de pedidos não encontrados
        }
        resultList.appendChild(listItem);
        checkedItems.add(item); // Adiciona o item ao Set de itens verificados
        checkedItemsArray.push({ nome, item, status: listItem.textContent.split(' - ')[1] }); // Adiciona o item ao Array
        document.getElementById('item-input').value = ''; // Limpa a caixa de digitação
    
        // Atualiza os contadores na interface
        document.getElementById('pedidos-encontrados').textContent = `Pedidos encontrados: ${pedidosEncontrados}`;
        document.getElementById('pedidos-nao-encontrados').textContent = `Pedidos não encontrados: ${pedidosNaoEncontrados}`;
    }
    
    function gerarCSV() {
        if (!abaAtual) {
            alert("Selecione a sua região");
            return;
        }
    
        if (checkedItemsArray.length === 0) {
            alert("Não há itens para gerar o CSV.");
            return;
        }
    
        const nome = document.getElementById('nome-input').value.trim();
        const data = document.getElementById('data-input').value;
        const header = ["Nome", "Data", "Aba", "Item", "Status"];
        const rows = checkedItemsArray.map(e => [nome, data, abaAtual, e.item, e.status]);
        const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "itens_verificados.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        enviarArquivoTelegram(csvContent);
    }
    
    function enviarArquivoTelegram(csvContent) {
        const formData = new FormData();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        formData.append('chat_id', '-1002150505138'); // Substitua pelo ID do chat desejado
        formData.append('document', blob, 'itens_verificados.csv');
    
        fetch(`https://api.telegram.org/bot6817295152:AAHcj6ywagCTX3susM3XwKMpb6LLxIgAm8o/sendDocument`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar documento via Telegram');
            }
            console.log('Documento enviado via Telegram com sucesso!');
            alert("CSV enviado com sucesso!");
            // Limpar a lista de itens verificados após o envio bem-sucedido
            const resultList = document.getElementById('result-list');
            resultList.innerHTML = '';
            checkedItemsArray = [];
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro ao enviar documento via Telegram:', error);
            alert("Erro ao enviar CSV via Telegram.");
        });
    
        enviarMensagemTelegram();
        
    }
    
    function enviarMensagemTelegram() {
        const nome = document.getElementById('nome-input').value.trim();
        const data = document.getElementById('data-input').value;
        const aba = abaAtual;
        const status = "Sucesso";
        let mensagem = `Nome: ${nome}\nData: ${data}\nAba: ${aba}\nPedidos Encontrados: ${pedidosEncontrados}\nPedidos não encontrados: ${pedidosNaoEncontrados}\nStatus: ${status}`;
        fetch(`https://api.telegram.org/bot6817295152:AAHcj6ywagCTX3susM3XwKMpb6LLxIgAm8o/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '-1002150505138',
                text: mensagem
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem via Telegram');
            }
            console.log('Mensagem enviada via Telegram com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem via Telegram:', error);
        });
    
    }
    
    
    function atualizarAba(aba) {
        document.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
        abaAtual = aba;
        RANGE = `${aba}!A:C`;
        itemsList = []; // Limpa a lista de itens para forçar atualização na próxima verificação
        checkedItems.clear(); // Limpa o Set de itens verificados
        document.getElementById(`btn${aba.replace(/\s/g, '')}`).classList.add('selected');
    }

    

    window.verificarItem = verificarItem;
    window.habilitarCampos = habilitarCampos;
    window.setDataAtual = setDataAtual;
    window.gerarCSV = gerarCSV;
});

function verificarTecla(event) {
    if (event.key === "Enter") {
        verificarItem();
    }
}


