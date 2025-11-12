<?php
header('Content-Type: application/json');
session_start();

try {
    include('../connect.php');

    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'error' => 'Usuário não autenticado.']);
        exit;
    }

    $usuario = $_SESSION['username'];
    $data = json_decode(file_get_contents("php://input"), true);

    $nome = $data['nome'] ?? null;
    $email = $data['email'] ?? null;
    $telefone = $data['telefone'] ?? null;

    if (!$nome || !$email || !$telefone) {
        echo json_encode(['success' => false, 'error' => 'Campos obrigatórios não preenchidos.']);
        exit;
    }

    $regex_nome = '/^(?=.{3,20}$)(?=.*\s)[A-Za-zÀ-ÿÇç\s]+$/u'; 
    $regex_email = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    $regex_telefone = '/^\d{10,11}$/'; 

    if(!preg_match($regex_nome, $nome)) {
        echo json_encode(['sucess' => false, 'field' => 'name', 'error' => 'O nome deve conter apenas letras, pelo menos 3 caracteres e um espaço!']);
        exit;
    }

    if(!preg_match($regex_email, $email)) {
        echo json_encode(['sucess' => false, 'field' => 'email', 'error' => 'Email inválido!']);
        exit;
    }

    if(!preg_match($regex_telefone, $telefone)) {
        echo json_encode(['sucess' => false, 'field' => 'tel', 'error' => 'O telefone inserido não é válido (aceita apenas números)!']);
        exit;
    }

    $sql = (object) [
            'queryData' => "UPDATE mo_jogador 
                            SET 
                                nome = ?, email = ?, telefone = ?
                            WHERE usuario = ?",
            'binds' => [$nome, $email, $telefone, $usuario]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);

    echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso!']);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao atualizar perfil: ' . $e->getMessage()
    ]);
}
