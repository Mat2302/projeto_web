"use strict";

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  const headerDiv = document.querySelector(".header-container");
  const idJogador = sessionStorage.getItem("idJogador");
  obtainPlayerId(idJogador);
  
  if (!headerDiv) {
    alert("A div 'header-container' não foi encontrada!");
    return;
  }

  const header = document.createElement("header");

  header.innerHTML = `
    <h1 class="title-header">Memory Overflow</h1>
    <nav class="nav-header">
      <a href="selection.html">Jogar</a>
      <a href="ranking.html">Ranking</a>
      <a href="scores.html">Scores</a>
      <a href="profile.html">Perfil</a>
    </nav>
    <div class="exit-header">
      <a href="../index.html" id="logout">Sair <img src="../../img/exit.svg" alt="Sair"></a>
    </div>
  `;
  headerDiv.appendChild(header);
  
  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });

  function checkSession() {
    let xhttp = new XMLHttpRequest();

    if (!xhttp) {
      alert("Erro ao criar objeto XMLHttpRequest.");
      return;
    }

    xhttp.open("GET", "../../back_end/utils/check_login.php", true);
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const response = JSON.parse(xhttp.responseText);
          if (!response.loggedIn) {
            sessionStorage.removeItem("username");
            window.location.href = "not-login.html";
          }
          sessionStorage.setItem("username", response.username);
        } catch (e) {
          console.error("Erro ao analisar o JSON: ", e);
        }
    }
  }
  xhttp.send();
}

  function logout() {
    let xhttp = new XMLHttpRequest();

    if (!xhttp) {
      alert("Erro ao criar objeto XMLHttpRequest.");
      return;
    }

    xhttp.open("GET", "../../back_end/utils/logout.php", true);
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function () {
      console.log("Logout request state: ", xhttp.responseText);
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const response = JSON.parse(xhttp.responseText);
          if (response.success) {
            console.log('Logout bem-sucedido.');
            sessionStorage.clear();
            window.location.href = "../index.html";
          } else {
            console.log("Erro ao fazer logout.");
          }
        } catch(e) {
          console.error("Erro ao analisar o JSON: ", e);
        }
      }
    }
    xhttp.send();
  }

  function obtainPlayerId(idJogador) {
    if (idJogador) {
      return;
    }

    let xhttp = new XMLHttpRequest();

    if (!xhttp) {
      alert("Erro ao criar objeto XMLHttpRequest.");
      return;
    }

    xhttp.open("GET", `../../back_end/utils/get_player_id.php?username=${encodeURIComponent(sessionStorage.getItem("username"))}`, true);
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const response = JSON.parse(xhttp.responseText);
          if (response.success) {
            sessionStorage.setItem("idJogador", response.id_jogador);
          }
        } catch (e) {
          console.error("Erro ao analisar o JSON: ", e);
        }
      }
    };
    xhttp.send();
  }

  
});