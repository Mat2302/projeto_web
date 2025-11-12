<?php
header('Content-Type: application/json');
session_start();

try {
    include('../connect.php'); 

 
    if (!isset($_SESSION['player']) && !isset($_SESSION['username'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Não autenticado.']);
        exit;
    }


    if (isset($_SESSION['player']['id'])) {
        $idJogador = (int) $_SESSION['player']['id'];
    } else {

        $username = $_SESSION['username'] ?? null;
        if (!$username) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Sessão inválida.']);
            exit;
        }
        $st = $pdo->prepare("SELECT id_jogador FROM mo_jogador WHERE BINARY usuario = ? LIMIT 1");
        $st->execute([$username]);
        $row = $st->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Jogador não encontrado.']);
            exit;
        }
        $idJogador = (int) $row['id_jogador'];
    }


    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        throw new Exception('JSON inválido.');
    }


    $req = ['tamanho_tabuleiro','quantidade_movimentos','pontuacao','modo_jogo','resultado'];
    foreach ($req as $k) {
        if (!array_key_exists($k, $input)) {
            throw new Exception("Campo obrigatório ausente: {$k}");
        }
    }

    $sql = "INSERT INTO mo_jogo
            (id_jogador, tamanho_tabuleiro, quantidade_movimentos, pontuacao,
             modo_jogo, tempo_segundos, resultado, data_conclusao)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $idJogador,
        (int) $input['tamanho_tabuleiro'],
        (int) $input['quantidade_movimentos'],
        (int) $input['pontuacao'],
        (int) (!!$input['modo_jogo']),                     // BOOLEAN -> 0/1
        isset($input['tempo_segundos']) ? (int) $input['tempo_segundos'] : null,
        (int) (!!$input['resultado']),                     // BOOLEAN -> 0/1
    ]);

    echo json_encode(['success' => true, 'id_jogo' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro DB: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
