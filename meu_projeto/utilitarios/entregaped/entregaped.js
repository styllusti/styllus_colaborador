document.getElementById("enviar").addEventListener("click", async function() {
    const pedido = document.getElementById("pedido").value;
    const cpf = document.getElementById("cpf").value;
    const nome = document.getElementById("nome").value;
    const imagem = document.getElementById("imagem").files[0];

    if (!imagem) {
        document.getElementById("resultado").innerText = "Por favor, selecione uma imagem.";
        return;
    }

    // Mostrar o loading
    document.getElementById("loading").style.display = "block";

    // Enviar dados para o WBuy
    try {
        const response = await fetch(`https://sistema.sistemawbuy.com.br/api/v1/order/status/${pedido}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer Y2MwNGNiMWUtYzA3Ni00NzE1LWExOTEtZmZlNDVmYjFhNzNmOjljYjhmNDA5OTYwOTQxMmFiODhjYjJkNDM1MTlhOWYz",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "status": "7",
                "observacoes": "",
                "info": `Entregue por ${cpf}`
            })
        });

        const responseData = await response.json();
        console.log("Resposta da WBuy:", responseData);

        if (!response.ok) throw new Error(`Erro ao atualizar status no WBuy: ${response.status} - ${responseData.message || responseData}`);

        // Enviar imagem para o Telegram
        const formData = new FormData();
        formData.append("chat_id", "-4584132034");
        formData.append("photo", imagem);
        formData.append("caption", `Nome do Cliente: ${nome}\nPedido: ${pedido}\nCPF: ${cpf}`);

        const telegramResponse = await fetch(`https://api.telegram.org/bot8038542552:AAHUWWTvO2L9Ts4lU15ZOApbGway7isQ7CQ/sendPhoto`, {
            method: "POST",
            body: formData
        });

        const telegramResponseData = await telegramResponse.json();
        console.log("Resposta do Telegram:", telegramResponseData);

        if (!telegramResponse.ok) {
            throw new Error(`Erro ao enviar imagem para Telegram: ${telegramResponse.status} - ${telegramResponseData.description}`);
        }

        document.getElementById("resultado").innerText = "Pedido atualizado e imagem enviada com sucesso!";
        
        // Atualizar a página após um pequeno atraso para visualizar a mensagem de sucesso
        setTimeout(() => {
            location.reload();
        }, 2000); // 2 segundos

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("resultado").innerText = error.message;
    } finally {
        // Esconder o loading
        document.getElementById("loading").style.display = "none";
    }
});
