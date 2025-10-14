"use strict";

/**
 * @file jogo-interface.js
 * @brief Interface do jogo de memória.
 * @details Este arquivo define a classe JogoView, que encapsula a interface do usuário para o jogo de memória.
 *          A classe JogoView gerencia a renderização do tabuleiro, a atualização dos estados das células e a exibição de mensagens ao usuário.
 */

/**
 * Classe que representa a interface do jogo de memória.
 * @class
 * @brief Representa a interface do jogo de memória.
 * @details A classe JogoView gerencia a renderização do tabuleiro, a atualização dos estados das células e a exibição de mensagens ao usuário.
 */
export class JogoView {
  /**
   * Construtor da classe JogoView.
   * @param {HTMLElement} container - Elemento HTML que contém o tabuleiro do jogo.
   * @param {HTMLElement} tempoElement - Elemento HTML que exibe o tempo decorrido (opcional).
   */
  constructor(container) {
    this.container = container;
    this.container.classList.add("game");
    this.tempoElement = null;
  }

  /**
   * @brief Cria um card (célula) no tabuleiro.
   * @param {Celula} celula - Célula a ser representada pelo card.
   * @param {number} index - Índice da célula no tabuleiro.
   * @param {function} onClick - Função de callback a ser chamada quando o card for clicado.
   * @returns {HTMLElement} Elemento HTML representando o card.
   */
  criarCard(celula, index, onClick) {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("cards");

    const img = document.createElement("img");
    img.src = celula.isVisivel() ? celula.getCaminho() : celula.getVerso();
    img.alt = "Carta do jogo";
    img.classList.add("img-cards");

    cardWrapper.appendChild(img);

    cardWrapper.addEventListener("click", () =>
      onClick(index, celula, img, cardWrapper)
    );

    return cardWrapper;
  }

  /**
   * @brief Renderiza o tabuleiro do jogo.
   * @param {Tabuleiro} tabuleiro - Tabuleiro a ser renderizado.
   * @param {function} onCardClick - Função de callback a ser chamada quando um card for clicado.
   */
  renderizarTabuleiro(tabuleiro, onCardClick) {
    this.container.innerHTML = "";
    const size = tabuleiro.getTamanho();

    let cardWidth;
    let cardHeight;

    switch (size) {
      case 2:
        cardWidth = "15vw";
        cardHeight = "27vh";
        break;
      case 4:
        cardWidth = "11vw";
        cardHeight = "19.6vh";
        break;
      case 6:
        cardWidth = "7.5vw";
        cardHeight = "13.35vh";
        break;
      case 8:
        cardWidth = "5.46vw";
        cardHeight = "9.7vh";
        break;
      default:
        cardWidth = "5.46vw";
        cardHeight = "9.7vh";
    }

    this.container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < tabuleiro.getTotalCelulas(); i++) {
      const celula = tabuleiro.getCelula(i);
      const card = this.criarCard(celula, i, onCardClick);
      card.style.width = cardWidth;
      card.style.height = cardHeight;
      this.container.appendChild(card);
    }
  }

  /**
   * @brief Atualiza a imagem de um card com base no estado da célula.
   * @param {Celula} celula - Célula cujo estado foi alterado.
   * @param {HTMLElement} imgElement - Elemento HTML da imagem do card a ser atualizado.
   */
  atualizarCard(celula, imgElement) {
    imgElement.src = celula.isVisivel()
      ? celula.getCaminho()
      : celula.getVerso();
  }

  /**
   * @brief Atualiza o status do jogo exibido na interface.
   * @param {number} movimentos - Número de movimentos realizados pelo jogador.
   * @param {boolean} usarTimer - Indica se o modo de jogo com timer está ativo. Se true, exibe o timer; caso contrário, oculta-o.
   */
  atualizarStatus(movimentos, usarTimer) {
    document.getElementById("movimentos").textContent =
      "Movimentos: " + movimentos;

    if (usarTimer) {
      document.getElementById("modo").textContent = "Modo Tempo";
      document.getElementById("tempo-wrapper").style.display = "inline";

      if (!this.tempoElement) {
        this.criarTimer();
      }
    } else {
      document.getElementById("modo").textContent = "Clássico";
      document.getElementById("tempo-wrapper").style.display = "none";
    }
  }

  /**
   * @brief Atualiza o elemento de tempo decorrido na interface.
   * @param {number} segundos - Tempo decorrido em segundos.
   */
  atualizarTempo(segundos) {
    if (this.tempoElement) {
      const min = Math.floor(segundos / 60);
      const sec = segundos % 60;
      this.tempoElement.textContent = `${min}:${sec
        .toString()
        .padStart(2, "0")}`;
    }
  }

  /**
   * @brief Exibe uma mensagem final ao jogador quando ele encontra todos os pares.
   * @param {number} movimentos - Número de movimentos realizados pelo jogador. Um movimento é contado cada vez que o jogador seleciona duas células, independentemente de serem um par ou não.
   * @param {number} [tempo] - Tempo decorrido em segundos (opcional).
   * @details A mensagem inclui o número de movimentos e, se fornecido, o tempo decorrido formatado em minutos e segundos.
   */
  mostrarMensagemFinal(movimentos, tempo) {
    let mensagem = `Parabéns! Você encontrou todos os pares em ${movimentos} movimentos`;

    if (tempo !== null && tempo !== undefined) {
      const minutos = Math.floor(tempo / 60);
      const segundos = tempo % 60;

      if (minutos > 0) {
        mensagem += ` e ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
        if (segundos > 0) {
          mensagem += ` e ${segundos} ${
            segundos === 1 ? "segundo" : "segundos"
          }`;
        }
      } else {
        mensagem += ` e ${segundos} ${segundos === 1 ? "segundo" : "segundos"}`;
      }
    }

    mensagem += "!";
    alert(mensagem);
  }

  /**
   * @brief Cria o elemento de timer na interface.
   * @returns {HTMLElement} Elemento HTML do timer criado.
   */
  criarTimer() {
    this.tempoElement = document.createElement("span");
    this.tempoElement.id = "tempo-decorrido";
    this.tempoElement.textContent = "0:00";

    const statusJogo = document.getElementById("status-jogo");
    statusJogo.appendChild(document.createTextNode(" | Tempo: "));
    statusJogo.appendChild(this.tempoElement);

    return this.tempoElement;
  }
}

