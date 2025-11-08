<?php
header('Content-Type: application/json');
try {
    include('../connect.php');

    $id_jogador = $_GET['id_jogador'];
    $game_mode = isset($_GET['game_mode']) ? $_GET["game_mode"] : null;
    $game_size = isset($_GET['game_size']) ? $_GET["game_size"] : null;

    $sql = (object) [
        'queryData' => "SELECT
                            mj.usuario,
                            mo.data_conclusao,
                            IF(mo.modo_jogo = 0, 'Clássico', 'Com Tempo') AS modo_jogo,
                            IF(mo.tempo_segundos IS NULL, '-', mo.tempo_segundos) AS tempo_segundos,
                            mo.quantidade_movimentos,
                            IF(mo.resultado = 1, 'Vitoria', 'Derrota') AS resultado
                        FROM
                            mo_jogo AS mo
                        INNER JOIN
                            mo_jogador AS mj ON mo.id_jogador = mj.id_jogador
                        WHERE
                            mo.id_jogador = ?",
        'binds' => [$id_jogador]
    ];

    if (!is_null($game_mode)) {
        $sql->queryData .= " AND mo.modo_jogo = ?";
        $sql->binds[] = $game_mode;
    }

    if (!is_null($game_size)) {
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