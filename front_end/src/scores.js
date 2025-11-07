"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const scoresBody = document.querySelector("table tbody");
    const gameType    = document.querySelectorAll(".mode-btn");
    const modoLinks   = document.querySelectorAll(".stats-item");
    const username    = sessionStorage.getItem("username") || "Anônimo";
    const idJogador   = 1; // Temporário, substituir depois pela variável correta

    let currentType = 0;
    let currentMode = "2";

    function obtainScore(gameSize, scoreType) {
        let xhttp = new XMLHttpRequest();
        console.log(gameSize, scoreType);

        if (!xhttp) {
            alert("Erro ao criar objeto XMLHttpRequest.");
            return;
        }

        xhttp.open("GET", "../../back_end/score/scores.php?game_size="+encodeURIComponent(gameSize)+"&game_mode="+encodeURIComponent(scoreType)+"&id_jogador="+encodeURIComponent(idJogador), true);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                try {
                    const response = JSON.parse(xhttp.responseText);
                    if (!response.success) {
                        console.error("Erro na resposta do servidor:", response.error);
                        return;
                    }
                    updateTableBody(response.data);
                } catch (e) {
                    console.error("Erro ao analisar o JSON:", e);
                }
            }
        };
        xhttp.send();
    }

    function updateTableBody(players) {
        const h2 = document.querySelector(".wrap-table h2");
        h2.textContent = `Histórico de Partidas - ${username}`;

        scoresBody.innerHTML = "";
        players.forEach(player => {
            if (!player) 
                return;

            const row = document.createElement("tr");
            const tempo = formatTime(player.tempo_segundos);
            const dataConclusao = formatDate(player.data_conclusao);
            row.innerHTML = `
                <td>${dataConclusao}</td>
                <td>${player.modo_jogo}</td>
                <td>${tempo}</td>
                <td>${player.quantidade_movimentos}</td>
                <td>${player.resultado}</td>
            `;
            scoresBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = formatGameSize(link.textContent.trim());
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

    function formatTime(seconds) {
        if (seconds === '-' || seconds === null)
            return '-';

        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    function formatGameSize(size) {
        switch(size) {
            case "2x2": return "2";
            case "4x4": return "4";
            case "6x6": return "6";
            case "8x8": return "8";
            default: return "2";
        }
    }
    obtainScore(currentMode, currentType);
});