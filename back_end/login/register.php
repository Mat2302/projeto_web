<?php
header('Content-Type: application/json');
try {
    include('../connect.php');
    $name = isset($_POST['name']) ? ($_POST['name']) : null;
    $username = isset($_POST['username']) ? ($_POST['username']) : null;
    $email = isset($_POST['email']) ? ($_POST['email']) : null;
    $birth = isset($_POST['birth']) ? ($_POST['birth']) : null;
    $telephone = isset($_POST['telephone']) ? ($_POST['telephone']) : null;
    $cpf = isset($_POST['cpf']) ? ($_POST['cpf']) : null;
    $pssd = isset($_POST['pssd']) ? ($_POST['pssd']) : null;

    $sql = (object) [
        'queryData' => 'INSERT INTO
                            mo_jogador
                            (nome, usuario, email, data_nascimento, telefone, cpf, senha)
                        VALUES
                            (?, ?, ?, ?, ?, ?, ?);',
        'binds' => [$name, $username, $email, $birth, $telephone, $cpf, $pssd]
    ];

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);

    echo json_encode([
        'success' => true,
        'data' => 'Jogador cadastrado com sucesso!'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao realizar a busca: ' . $e->getMessage()
    ]);
}
