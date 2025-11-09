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

    $sql = (object) [
            'queryData' => "UPDATE mo_jogador 
                            SET 
                                nome = ?, email = ?, telefone = ?
                            WHERE usuario = ?",
            'binds' => [$nome, $email, $telefone, $usuario]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);

    echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso.']);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao atualizar perfil: ' . $e->getMessage()
    ]);
}
