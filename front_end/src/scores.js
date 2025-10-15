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
    const username    = sessionStorage.getItem("username") || "Anônimo";

    let currentType = 0;
    let currentMode = "2x2";

    function obtainScore(mode, scoreType) {
        let players = scoresData[mode] || [];
        
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
            `; // Verificar como será a condição de vitória depois
            scoresBody.appendChild(row);
        });
    }

    modoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            modoLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentMode = link.textContent.trim();
            alertShow = false;
            obtainScore(currentMode, currentType);
        });
    });
    
    gameType.forEach(button => {
        button.addEventListener("click", () => {
            gameType.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            currentType = button.value;
            alertShow = false;
            obtainScore(currentMode, currentType);
        });
    });

    obtainScore(currentMode, currentType);
});