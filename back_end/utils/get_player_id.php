<?php
header('Content-Type: application/json');
try {
    include('../connect.php');
    $username = $_GET['username'];

    $sql = (object) [
        'queryData' => "SELECT
                            id_jogador
                        FROM
                            mo_jogador
                        WHERE
                            usuario = ?",
        'binds' => [$username]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'success' => true,
            'id_jogador' => $result['id_jogador']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Jogador não encontrado'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao realizar busca: ' . $e->getMessage()
    ]);
}
?>