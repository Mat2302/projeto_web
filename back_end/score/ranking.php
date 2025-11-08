<?php
header('Content-Type: application/json');
try {
    include('../connect.php');
    $game_mode = isset($_GET['game_mode']) ? $_GET["game_mode"] : null;
    $game_size = isset($_GET['game_size']) ? $_GET["game_size"] : null;

    if (!is_null($game_mode) && $game_mode == "0") {
        $sql = (object) [
            'queryData' => "SELECT
                                mj.usuario,
                                mr.melhores_movimentos AS quantidade_movimentos,
                                MIN(mo.pontuacao) AS pontuacao,
                                MIN(mo.tempo_segundos) AS tempo_segundos
                            FROM (
                                SELECT
                                    id_jogador,
                                    MIN(quantidade_movimentos) AS melhores_movimentos
                                FROM
                                    mo_jogo
                                WHERE
                                    modo_jogo = ?
                                    AND resultado = 1
                                    AND tamanho_tabuleiro = ?
                                GROUP BY
                                    id_jogador
                            ) AS mr
                            INNER JOIN mo_jogo mo
                                ON mo.id_jogador = mr.id_jogador
                                AND mo.quantidade_movimentos = mr.melhores_movimentos
                            INNER JOIN mo_jogador mj
                                ON mj.id_jogador = mo.id_jogador
                            GROUP BY
                                mr.id_jogador
                            ORDER BY
                                mr.melhores_movimentos ASC
                            LIMIT 10;",
            'binds' => [$game_mode, $game_size]
        ];

        $stmt = $pdo->prepare($sql->queryData);
        $stmt->execute($sql->binds);
    }

    if (!is_null($game_mode) && $game_mode == "1") {
        $sql = (object) [
            'queryData' => "SELECT
                                mj.usuario,
                                MIN(mo.quantidade_movimentos) AS quantidade_movimentos,
                                MIN(mo.pontuacao) AS pontuacao,
                                mr.melhores_tempos AS tempo_segundos
                            FROM (
                                SELECT
                                    id_jogador,
                                    MIN(tempo_segundos) AS melhores_tempos
                                FROM
                                    mo_jogo
                                WHERE
                                    modo_jogo = ?
                                AND
                                    resultado = 1
                                AND
                                    tamanho_tabuleiro = ?
                                GROUP BY
                                    id_jogador
                            ) AS mr
                            INNER JOIN mo_jogo mo
                                ON mo.id_jogador = mr.id_jogador
                                AND mo.tempo_segundos = mr.melhores_tempos
                            INNER JOIN mo_jogador mj
                                ON mj.id_jogador = mo.id_jogador
                            GROUP BY
                                mr.id_jogador
                            ORDER BY
                                mr.melhores_tempos ASC
                            LIMIT 10;",
            'binds' => [$game_mode, $game_size]
        ];

        $stmt = $pdo->prepare($sql->queryData);
        $stmt->execute($sql->binds);
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao realizar a busca: ' . $e->getMessage()
    ]);
}
?>