<?php
header('Content-Type: application/json');
try {
    include('../connect.php');

    $id_jogador = $_GET['id_jogador'];
    $mode = isset($_GET['mode']) ? $_GET["mode"] : null;
    $game_size = isset($_GET['game_size']) ? $_GET["game_size"] : null;

    $sql = (object) [
        'queryData' => "SELECT
                            mo.data_conclusao,
                            mo.modo_jogo,
                            mo.tempo_segundos,
                            mo.quantidade_movimentos,
                            mo.resultado
                        FROM mo_jogo AS mo
                        WHERE mo.id_jogador = ?",
        'binds' => [$id_jogador]
    ];

    if (!is_null($mode)) {
        $sql->queryData .= " AND mo.modo_jogo = ?";
        $sql->binds[] = $mode;
    }

    if (!empty($game_size)) {
        $sql->queryData .= " AND mo.tamanho_tabuleiro = ?";
        $sql->binds[] = $game_size;
    }

    $stmt = $pdo->prepare($sql->queryData);
    $stmt->execute($sql->binds);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao realizar busca: ' . $e->getMessage()
    ]);
}
?>