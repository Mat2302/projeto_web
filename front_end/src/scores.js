"use strict";

// Implementar o thead dinamico com base no modo de jogo selecionado (com tempo / clássico)
document.addEventListener("DOMContentLoaded", () => {
    const scoresData = JSON.parse(localStorage.getItem("ranking")) || {
        "2x2": [],
        "4x4": [],
        "6x6": [],
        "8x8": []
    };

    const scoresBody = document.querySelector("table tbody");
    const gameType    = document.querySelectorAll(".mode-btn");
    const modoLinks   = document.querySelectorAll(".stats-item");
    const idJogador    = sessionStorage.getItem("username") || "Anônimo";

    let currentType = 0;
    let currentMode = "2x2";

    function obtainScore(gameSize, scoreType) {
        let players = scoresData[gameSize] || [];
        let xhttp = new XMLHttpRequest();

        if (!xhttp) {
            alert("Erro ao criar objeto XMLHttpRequest.");
            return;
        }

        // Alterar identificação do usuário (username -> id_jogador)
        // xhttp.open("GET", "../../back_end/score/scores.php?size="+encodeURIComponent(gameSize)+"&type="+encodeURIComponent(scoreType)+"&id_jogador="+encodeURIComponent(idJogador), true);
        // xhttp.onreadystatechange = function() {
        //     if (xhttp.readyState === 4 && xhttp.status === 200) {
        //         try {
        //             const response = JSON.parse(xhttp.responseText);
        //             if (!response.success) {
        //                 console.error("Erro na resposta do servidor:", response.error);
        //                 return;
        //             }
        //             updateTableBody(response.data);
        //         } catch (e) {
        //             console.error("Erro ao analisar o JSON:", e);
        //         }
        //     }
        // };
        // xhttp.send();
        
        if (scoreType == 1)
            players = players.filter(player => player.tempo > 0);
        if (scoreType == 0)
            players = players.filter(player => player.tempo == 0);
        players = players.filter(player => player.jogador === username);
        updateTableBody(players);
    }

    function updateTableBody(players) {
        const h2 = document.querySelector(".wrap-table h2");
        h2.textContent = `Histórico de Partidas - ${username}`;

        scoresBody.innerHTML = "";
        players.forEach(player => {
            if (!player) 
                return;

            const row = document.createElement("tr");
            const typeText = currentType == 0 ? "Clássico" : "Com Tempo";
            const resultText = player.resultado ? "Vitória" : "Derrota";
            row.innerHTML = `
                <td>${player.data}</td>
                <td>${typeText}</td>
                <td>${player.tempo}</td>
                <td>${player.movimentos}</td>
                <td>${resultText}</td>
            `;
            scoresBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = link.textContent.trim();
            obtainScore(currentMode, currentType);
        });
    });
    
    gameType.forEach(button => {
        button.addEventListener("click", () => {
            gameType.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            currentType = button.value;
            obtainScore(currentMode, currentType);
        });
    });

    obtainScore(currentMode, currentType);
});