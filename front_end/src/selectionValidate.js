"use strict";

document.addEventListener("DOMContentLoaded", () => {
  dinamicLabel();
  const form = document.getElementById("formSelection");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mode = document.getElementById("mode").value;
    const radioSelected = document.querySelector('input[name="table"]:checked');

    if (!radioSelected) {
      alert("Selecione um tabuleiro!");
      return; // impede navegação
    }

    sessionStorage.setItem("modoJogo", mode);
    sessionStorage.setItem("tamanhoTabuleiro", radioSelected.value);

    window.location.href = "board-game.html";
  });

  function dinamicLabel() {
    const username = sessionStorage.getItem("username");
    const label = document.querySelector(".welcome");
    label.textContent = `Bem-vindo, ${username}!`;
  }
});
