function login(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obtenha os valores do usuário e senha
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aqui você pode adicionar lógica de autenticação real
    // Simulando sucesso de login
    if (username === "admin" && password === "senha") {
        sessionStorage.setItem('nomeUsuario', username); // Armazena o nome do usuário na sessão
        window.location.href = "menu.html"; // Redireciona para a página de menu
    } else {
        alert("Usuário ou senha inválidos!"); // Mensagem de erro
    }
    
}
