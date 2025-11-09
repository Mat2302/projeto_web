<?php
header('Content-Type: application/json');
session_start();
try {
    include('../connect.php');
    $username = isset($_POST['username']) ? ($_POST['username']) : null;
    $pssd = isset($_POST['pssd']) ? ($_POST['pssd']) : null;

    $sql = (object) [
        'queryData' => "SELECT
                            id_jogador,
                            usuario
                        FROM
                            mo_jogador
                        WHERE
                            BINARY usuario = ?
                            AND BINARY senha = ?
                        LIMIT 1;",
        'binds' => [$username, $pssd]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode([
            'success' => false,
            'data' => 'Usuário ou senha inválidos.'
        ]);
        exit;
    }

    $_SESSION['username'] = $username;
    echo json_encode([
        'success' => true,
        'data' => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'data' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
    ]);
}
?>