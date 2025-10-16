"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const rankingData = JSON.parse(localStorage.getItem("ranking")) || {
        "2x2": [],
        "4x4": [],
        "6x6": [],
        "8x8": []
    };

    const gameType    = document.querySelectorAll(".mode-btn");
    const rankingBody = document.querySelector("table tbody");
    const modoLinks   = document.querySelectorAll(".stats-item");
    const podium      = document.querySelectorAll(".podium-card .text");

    let currentType = 0;
    let currentMode = "2x2";

    function obtainRanking(mode, rankingType) {
        updateTableHead(rankingType);
        let players = rankingData[mode] || [];
        
        if (rankingType == 1)
            players = players.filter(player => player.tempo > 0);
        if (rankingType == 0)
            players = players.filter(player => player.tempo == 0);
        players = players.filter(player => player.resultado === true);

        const bestScore = [];
        players.forEach(player => {
            const exists = bestScore.find(p => p.jogador === player.jogador);    
            if (!exists) {
                bestScore.push(player);
                return;
            }

            const changeTimeMode =
                (rankingType == 0 && player.movimentos < exists.movimentos) ||
                (rankingType == 1 && player.tempo < exists.tempo);
            if (changeTimeMode) {
                const index = bestScore.indexOf(exists);
                bestScore[index] = player;
            }
        });

        if (rankingType == 0) {
            bestScore.sort((a, b) => {
                if (a.movimentos !== b.movimentos)
                    return a.movimentos - b.movimentos;
                return b.pontuacao - a.pontuacao;
            });
        }

        if (rankingType == 1) {
            bestScore.sort((a, b) => {
                if (a.tempo !== b.tempo)
                    return a.tempo - b.tempo;
                return a.movimentos - b.movimentos;
            });
        }

        updateTableBody(bestScore);
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
        const positions = {first: 0, second: 1, third: 2};
        
        podium.forEach((element) => {
            let podiumPosition;
            switch (true) {
                case element.parentElement.classList.contains("first"):
                    podiumPosition = "first";
                    break;
                case element.parentElement.classList.contains("second"):
                    podiumPosition = "second";
                    break;
                case element.parentElement.classList.contains("third"):
                    podiumPosition = "third";
                    break;
                default:
                    podiumPosition = "third";
            }

            const position = positions[podiumPosition];
            const player = bestScore[position];

            if (player) {
                if (currentType == 0) {
                    element.innerHTML = `
                        <h3>${position + 1}ª Lugar</h3>
                        <p>${player.jogador}</p>
                        <p>${player.movimentos} movimentos</p>
                        <p>${player.pontuacao} pontos</p>`;
                }

                if (currentType == 1) {
                    element.innerHTML = `
                        <h3>${position + 1}ª Lugar</h3>
                        <p>${player.jogador}</p>
                        <p>${player.tempo} segundos</p>
                        <p>${player.movimentos} movimentos</p>`;
                }
                
                return;
            }
            element.innerHTML = `
                <h3>${position + 1}ª Lugar</h3>
                <p>--</p>
                <p>--</p>
                <p>--</p>`;
        });

        rankingBody.innerHTML = "";
        bestScore.slice(3).forEach((element, index) => {
            if (!element)
                return;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 4}º</td>
                <td>${element.jogador}</td>
                <td>${element.movimentos}</td>
                <td>${element.pontuacao}</td>`;
            rankingBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = link.textContent.trim();
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

    obtainRanking(currentMode, currentType);
});