"use strict";

document.addEventListener("DOMContentLoaded", () => {
    checkSession();
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

/**
 * @file main.js
 * @brief Arquivo principal que inicia o jogo de memória.
 * @details Este arquivo importa o controlador do jogo e inicia uma nova instância do jogo quando a página é carregada.
 *          Também define a função para sair do jogo, retornando à tela de seleção.
 *          A função iniciarJogo pode ser chamada com diferentes modos de jogo (com ou sem timer).
 *          O tamanho do tabuleiro é recuperado do sessionStorage.
 *          A função sair exibe uma confirmação antes de redirecionar o usuário para a tela de seleção.
 * 
 * @see controllers/jogo-logica.js
 * @see views/jogo-interface.js
 * @see models/tabuleiro-model.js
 * @see models/celula-model.js
 * @see models/timer-model.js
 * @see config/imagens-dict.js
 */

import { JogoController } from './controllers/jogo-logica.js';

/**
 * Inicia uma nova instância do jogo de memória.
 * @param {number} modo - Modo de jogo
 * @details O tamanho do tabuleiro é recuperado do sessionStorage.
 *          A função pode ser chamada com diferentes modos de jogo.
 * @todo Atualmente, a pagina selection.html salva o tamanho do tabuleiro no sessionStorage, mas não o modo de jogo. Adicionar essa funcionalidade.
 */
function iniciarJogo() {
    const container = document.querySelector('.game');

    const total = parseInt(sessionStorage.getItem("tamanhoTabuleiro"));
    const modo = sessionStorage.getItem("modoJogo");

    if (modo == "classic") {
        window.jogo = new JogoController(container, total, false);
    }
    else if (modo == "timer") {
        window.jogo = new JogoController(container, total, true);
    }
}

/**
 * @brief Sai do jogo, retornando à tela de seleção.
 * @details Exibe uma confirmação antes de redirecionar o usuário para a tela de seleção.
 */
function sair() {
    if (jogo.isJogoAtivo() == true) {
        const confirmar = confirm("Tem certeza que deseja sair? O progresso atual será perdido.");
        if (confirmar) {
            jogo.finalizarJogoPorDesistencia();
            window.location.href = 'selection.html';
            // sessionStorage.clear();
        }
    }
    }

window.onload = iniciarJogo;

window.sair = sair;
