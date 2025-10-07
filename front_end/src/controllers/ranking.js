document.addEventListener("DOMContentLoaded", () => {
    const rankingData = JSON.parse(localStorage.getItem("ranking")) || {
        "2x2": [],
        "4x4": [],
        "6x6": [],
        "8x8": []
    };

    const modoLinks   = document.querySelectorAll(".stats-item");
    const podium      = document.querySelectorAll(".podium-card .text");
    const rankingBody = document.querySelector("table tbody");
    const classicBtn   = document.getElementById("classic-btn");
    const timerBtn     = document.getElementById("timer-btn");

    let currentMode = "2x2";
    let currentType = "classico";

    function obtainRanking(mode, rankingType) {
        let players = rankingData[mode] || [];

        if (rankingType === "com tempo") {
            players = players.filter(player => player.tempo > 0);
            classicBtn.classList.remove("active");
            timerBtn.classList.add("active");
        } else {
            classicBtn.classList.add("active");
            timerBtn.classList.remove("active");
        }

        players.sort((a, b) => {
            if (b.pontuacao !== a.pontuacao)
                return b.pontuacao - a.pontuacao;
            return a.tempo - b.tempo;
        });
        podium.forEach((element, index) => {
            const player = players[index];
            if (player) {
                element.innerHTML = `
                    <h3>${index + 1}ª Lugar</h3>
                    <p>${player.jogador}</p>
                    <p>${player.pontuacao} pontos</p>
                    <p>${player.tempo} segundos</p>`;
            } else {
                element.innerHTML = `
                    <h3>${index + 1}ª Lugar</h3>
                    <p>--</p>
                    <p>--</p>
                    <p>--</p>`;
            }
        });

        rankingBody.innerHTML = "";
        players.slice(3).forEach((element, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 4}º</td>
                <td>${element.jogador}</td>
                <td>${element.pontuacao}</td>
                <td>${element.tempo} segundos</td>`;
            rankingBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = link.textContent.trim();
            obtainRanking(currentMode);
        });
    });

    const gameType = document.querySelectorAll(".mode-btn");
    gameType.forEach(btn => {
        btn.addEventListener("click", () => {
            gameType.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const rankingType = btn.textContent.trim().toLowerCase();
            obtainRanking(currentMode, rankingType);
        });
    });

    obtainRanking(currentMode, currentType);
});