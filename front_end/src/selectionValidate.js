"use strict";

function saveForms(event) {
  const mode = document.getElementById("mode").value;
  const radioSelected = document.querySelector('input[name="table"]:checked');

  if (!radioSelected) {
    alert("Selecione um tabuleiro!");
    event.preventDefault(); 
    return;
  }

  const checkBtn = radioSelected.value;

  sessionStorage.setItem("modoJogo", mode);
  sessionStorage.setItem("tamanhoTabuleiro", checkBtn);
}

