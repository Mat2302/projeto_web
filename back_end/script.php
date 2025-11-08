<?php
    try {
        include('connect.php');
        
        $sql1 = "CREATE TABLE IF NOT EXISTS mo_jogador (
            id_jogador INT PRIMARY KEY AUTO_INCREMENT,
            cpf VARCHAR(11) NOT NULL UNIQUE,
            usuario VARCHAR(50) NOT NULL UNIQUE,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            data_nascimento DATE NOT NULL,
            telefone VARCHAR(11) NOT NULL,
            senha VARCHAR(255) NOT NULL
        );";
        $sql2 = "CREATE TABLE IF NOT EXISTS mo_jogo (
            id_jogo INT PRIMARY KEY AUTO_INCREMENT,
            id_jogador INT NOT NULL,
            tamanho_tabuleiro INT NOT NULL,
            quantidade_movimentos INT NOT NULL,
            pontuacao INT NOT NULL,
            modo_jogo BOOLEAN NOT NULL,
            tempo_segundos INT,
            resultado BOOLEAN NOT NULL,
            data_conclusao DATETIME NOT NULL,
            FOREIGN KEY (id_jogador) REFERENCES mo_jogador(id_jogador)
        );";

        $pdo->exec($sql1);
        $pdo->exec($sql2);

        echo "Tabelas criadas com sucesso! <br>";
    } catch (PDOException $e) {
        die("Erro ao criar tabelas: " . $e->getMessage() . "<br>");
    }
?>