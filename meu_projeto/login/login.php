<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de Login</title>
    <link rel="stylesheet" href="login.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> <!-- Incluindo jQuery -->
</head>
<body>
    <div class="login-container">
        <img src="../imagens/logo.png" alt="Logo" class="logo"> <!-- Logo centralizada -->
        <form class="login-form" id="login-form" method="POST"> <!-- O formulário não aponta mais para login.php -->
            <h2 class="text-center">Login</h2>
            <div class="form-group">
                <input type="text" class="form-control" name="username" id="username" placeholder="Usuário" required>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" name="password" id="password" placeholder="Senha" required>
            </div>
            <div id="error-message" class="alert" style="display: none; color: red;"></div> <!-- Mensagem de erro -->
            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
        </form>
    </div>

    <script>
        $(document).ready(function() {
            $('#login-form').submit(function(event) {
                event.preventDefault(); // Impede o envio normal do formulário

                const username = $('#username').val();
                const password = $('#password').val();

                $.ajax({
                    type: 'POST',
                    url: 'login.php', // O mesmo PHP que você já tem
                    data: {
                        username: username,
                        password: password
                    },
                    success: function(response) {
                        // Converte a resposta JSON para um objeto
                        const result = JSON.parse(response);

                        if (result.success) {
                            window.location.href = '../menu.html'; // Redireciona em caso de sucesso
                        } else {
                            $('#error-message').text(result.message).show(); // Exibe a mensagem de erro
                        }
                    },
                    error: function() {
                        $('#error-message').text('Ocorreu um erro ao tentar fazer login.').show(); // Mensagem de erro genérica
                    }
                });
            });
        });
    </script>
</body>
</html>
