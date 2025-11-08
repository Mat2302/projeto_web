"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const gameType    = document.querySelectorAll(".mode-btn");
    const rankingBody = document.querySelector("table tbody");
    const modoLinks   = document.querySelectorAll(".stats-item");

    let currentType = 0;
    let currentMode = "2";

    function obtainRanking(mode, rankingType) {
        updateTableHead(rankingType);
        let xhttp = new XMLHttpRequest();

        if (!xhttp) {
            alert("Erro ao criar objeto XMLHttpRequest.");
            return;
        }

        xhttp.open("GET", "../../back_end/score/ranking.php?game_mode="+encodeURIComponent(rankingType)+"&game_size="+encodeURIComponent(mode), true);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                try {
                    const response = JSON.parse(xhttp.responseText);
                    if (!response.success) {
                        console.error("Erro na resposta do servidor: ", response.error);
                        return;
                    }
                    updateTableBody(response.data);
                } catch (e) {
                    console.error("Erro ao analisar o JSON: ", e)
                }
            }
        };
        xhttp.send();
    }

    function updateTableHead(rankingType) {
        const timerBtn     = document.getElementById("timer-btn");
        const classicBtn   = document.getElementById("classic-btn");
        const thead        = document.querySelector("table thead");

        if (rankingType == 0) {
            classicBtn.classList.add("active");
            timerBtn.classList.remove("active");
            thead.innerHTML = `
                <th>Ranking</th>
                <th>Jogador</th>
                <th>Movimentos</th>
                <th>Pontuação</th>`;
        }

        if (rankingType == 1) {
            classicBtn.classList.remove("active");
            timerBtn.classList.add("active");
            thead.innerHTML = `
                <th>Ranking</th>
                <th>Jogador</th>
                <th>Movimentos</th>
                <th>Tempo</th>`;
        }
    }

    function updateTableBody(bestScore) {
        const rankingPodium = bestScore.slice(0, 3);
        const rankingOthers = bestScore.slice(3);

        const podiumMap = {
            0: document.querySelector(".podium-card.first .text"),
            1: document.querySelector(".podium-card.second .text"),
            2: document.querySelector(".podium-card.third .text"),
        };
        
        Object.entries(podiumMap).forEach(([index, card]) => {
            const player = rankingPodium[index];

            if (player) {
                if (currentType == 0) {
                    card.innerHTML = `
                        <h3>${parseInt(index) + 1}ª Lugar</h3>
                        <p>${player.usuario}</p>
                        <p>${player.quantidade_movimentos} movimentos</p>
                        <p>${player.pontuacao} pontos</p>`;
                }

                if (currentType == 1) {
                    card.innerHTML = `
                        <h3>${parseInt(index) + 1}ª Lugar</h3>
                        <p>${player.usuario}</p>
                        <p>${player.tempo_segundos} segundos</p>
                        <p>${player.quantidade_movimentos} movimentos</p>`;
                }
            } else {
                card.innerHTML = `
                    <h3>${parseInt(index) + 1}ª Lugar</h3>
                    <p>--</p>
                    <p>--</p>
                    <p>--</p>`;
            }
        });

        rankingBody.innerHTML = "";
        rankingOthers.forEach((player, index) => {
            const row = document.createElement("tr");
            if (currentType == 0) {
                row.innerHTML = `
                    <td>${index + 4}º</td>
                    <td>${player.usuario}</td>
                    <td>${player.quantidade_movimentos}</td>
                    <td>${player.pontuacao}</td>`;
            }

            if (currentType == 1) {
                row.innerHTML = `
                    <td>${index + 4}º</td>
                    <td>${player.usuario}</td>
                    <td>${player.quantidade_movimentos}</td>
                    <td>${player.tempo_segundos} segundos</td>`;
            }
            rankingBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = formatGameSize(link.textContent.trim());
            obtainRanking(currentMode, currentType);
        });
    });

    gameType.forEach(button => {
        button.addEventListener("click", () => {
            gameType.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            currentType = button.value;
            obtainRanking(currentMode, currentType);
        });
    });

    function formatGameSize(size) {
        switch(size) {
            case "2x2": return "2";
            case "4x4": return "4";
            case "6x6": return "6";
            case "8x8": return "8";
            default: return "2";
        }
    }

    obtainRanking(currentMode, currentType);
});