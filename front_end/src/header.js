"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.querySelector(".header-container");
  const username = sessionStorage.getItem("username");

  if (!username) {
    alert("Usuário não autenticado! Redirecionando para a página de login.");
    window.location.href = "../index.html";
    return;
  }

  if (!headerContainer) {
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
  headerContainer.appendChild(header);
  
  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("username");
  });
});