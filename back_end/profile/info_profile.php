<?php
header('Content-Type: application/json');
session_start();

try {
    include('../connect.php');

    if (!isset($_SESSION['username'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Usuário não autenticado.'
        ]);
        exit;
    }

    $usuario = $_SESSION['username'];

    $sql = (object) [
        'queryData' => "SELECT 
                            nome, email, telefone, usuario, DATE_FORMAT(data_nascimento, '%d/%m/%Y') AS data_nascimento, cpf
                        FROM mo_jogador
                        WHERE usuario = ?
                        LIMIT 1;",
        'binds' => [$usuario]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Usuário não encontrado.']);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao buscar dados: ' . $e->getMessage()
    ]);
}
