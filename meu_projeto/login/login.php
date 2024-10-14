<?php
session_start(); // Inicia a sessão

// Habilitar relatórios de erros
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "192.168.0.198";
$usernameDB = "SYSDBA";
$passwordDB = "masterkey";
$dbname = "BDCOLABORADOR";
$port = 3306;

// Criar conexão
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

// Verificar conexão
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Conexão falhou: ' . $conn->connect_error]));
}

// Verificar se os dados foram enviados
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Consultar o banco de dados
    $sql = "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        die(json_encode(['success' => false, 'message' => 'Erro na preparação da consulta: ' . $conn->error]));
    }

    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Usuário encontrado
        echo json_encode(['success' => true]);
    } else {
        // Usuário não encontrado
        echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos.']);
    }

    $stmt->close();
}

$conn->close();
?>
