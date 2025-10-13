"use strict";

function saveForms() {
//   event.preventDefault();
  const mode = document.getElementById("mode").value;
  const radioSelected = document.querySelector('input[name="table"]:checked');

  if (!radioSelected) {
    alert("Selecione um tabuleiro!");
    return;
  }

  const checkBtn = radioSelected.value;

  
  window.iniciarJogo(mode, checkBtn);
  window.location.href = "game-board.html";
}
