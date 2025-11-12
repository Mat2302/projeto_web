"use strict";

/**
 * @file jogo-logica.js
 * @brief Controlador principal do jogo de memória.
 * @details Esse arquivo centraliza a lógica do jogo, gerenciando o estado do tabuleiro,
 *          as interações do usuário, o timer (se aplicável) e a comunicação com a interface do usuário.
 */

import { Tabuleiro } from "../models/tabuleiro-model.js";
import { JogoView } from "../views/jogo-interface.js";
import { Timer } from "../models/timer-model.js";
import { imagensDict } from "../config/imagens-dict.js";

/**
 * Controla a lógica do jogo de memória.
 *
 * @class JogoController
 * @brief Controlador principal do jogo de memória.
 * @details Gerencia o estado do tabuleiro, as interações do usuário, o timer (se aplicável)
 *
 */
export class JogoController {
  /**
   * @brief Elemento contêiner onde o jogo será renderizado.
   * @type {HTMLElement}
   */
  containerElement;

  /**
   * @brief Instância do tabuleiro do jogo.
   * @type {Tabuleiro}
   */
  tabuleiro;

  /**
   * @brief Instância da interface do jogo.
   * @type {JogoView}
   * @see JogoView
   */
  view;

  /**
   * @brief Instância do timer do jogo (se aplicável).
   * @type {Timer|null}
   * @see Timer
   */
  timer;

  /**
   * @brief Flag que indica se o timer deve ser usado.
   * @type {boolean}
   */
  usarTimer;

  /**
   * @brief Caso o jogo seja com tempo, define qual o tempo limite para que o jogo seja vencido (em segundos).
   * @type {number|null}
   * @see Timer
   */
  tempoLimite = null;

  /**
   * @brief Contador de movimentos realizados pelo jogador.
   * @type {number}
   */
  movimentos = 0;

  /**
   * @brief Contador de pares encontrados pelo jogador.
   * @type {number}
   */
  paresEncontrados = 0;

  /**
   * @brief Array que armazena as células atualmente selecionadas.
   * @type {Array}
   */
  celulasSelecionadas = [];

  /**
   * @brief Flag que indica se o jogo está ativo (aceitando jogadas).
   * @type {boolean}
   */
  jogoAtivo = true;

  /**
   * @brief Flag que indica se o modo trapaça está ativo.
   * @type {number} -1 para desativado, 1 para ativado.
   */
  trapaca = -1;

  /**
   * @brief Construtor do controlador do jogo.
   * @param {HTMLElement} containerElement - Elemento contêiner onde o jogo será renderizado.
   * @param {number} totalCelulas - Total de células no tabuleiro (deve ser um número par).
   * @param {boolean} usarTimer - Indica se o timer deve ser usado.
   */
  constructor(containerElement, totalCelulas, usarTimer) {
    this.tabuleiro = new Tabuleiro(totalCelulas, imagensDict);
    this.view = new JogoView(containerElement, this.reiniciar.bind(this));
    this.usarTimer = usarTimer;

    this.movimentos = 0;
    this.paresEncontrados = 0;
    this.celulasSelecionadas = [];
    this.jogoAtivo = true;
    this.trapaca = -1;

    if (this.usarTimer) {
      switch (totalCelulas) {
        case 4:
          this.tempoLimite = 30;
          break;
        case 16:
          this.tempoLimite = 90;
          break;
        case 36:
          this.tempoLimite = 180;
          break;
        case 64:
          this.tempoLimite = 300;
          break;
        default:
          this.tempoLimite = 120;
      }

      this.timer = new Timer();
      this.timer.iniciar();
    }
    this.inicializarJogo();
  }

  /**
   * @brief Inicializa o jogo, renderizando o tabuleiro e configurando o timer (se aplicável).
   *
   */
  inicializarJogo() {
    this.view.renderizarTabuleiro(
      this.tabuleiro,
      (index, celula, img, cardWrapper) => {
        this.processarJogada(index, celula, img, cardWrapper);
      }
    );

    if (this.usarTimer) {
      this.iniciarAtualizacaoTempo();
    }

    this.atualizarStatus();
  }

  /**
   * @brief Caso o jogo utilize timer, inicia o timer e notifica a view a cada segundo para atualizar o display do tempo.
   *
   * @see Timer
   * @see JogoView#atualizarTempo
   */
  iniciarAtualizacaoTempo() {
    this.intervaloTempo = setInterval(() => {
      if (this.timer && this.usarTimer) {
        const tempoDecorrido = this.timer.getTempoDecorrido();
        this.view.atualizarTempo(tempoDecorrido);

        if (this.tempoLimite && tempoDecorrido >= this.tempoLimite) {
          this.finalizarJogoPorTempo();
        }
      }
    }, 1000);
  }

  /**
   * @brief Processa a jogada do jogador ao clicar em uma célula.
   * @param {number} index - Índice da célula clicada.
   * @param {Celula} celula - Instância da célula clicada.
   * @param {HTMLElement} imgElement - Elemento de imagem da célula clicada.
   * @param {HTMLElement} cardWrapper - Elemento wrapper da célula clicada.
   *
   * @details Revela a célula, atualiza a interface e verifica se um par foi encontrado.
   *          Se dois pares forem selecionados, verifica se são iguais ou não e age de acordo.
   *
   * @see Celula
   * @see JogoView#atualizarCard
   * @see JogoController#verificarPar
   */
  processarJogada(index, celula, imgElement, cardWrapper) {
    if (!this.jogoAtivo || this.celulasSelecionadas.length >= 2) return;
    if (celula.isVisivel() || celula.isEncontrada()) return;

    if (celula.revelar()) {
      this.view.atualizarCard(celula, imgElement);

      this.celulasSelecionadas.push({
        celula,
        imgElement,
        index,
        cardWrapper,
      });

      if (this.celulasSelecionadas.length === 2) {
        this.verificarPar();
        this.movimentos++;
        this.atualizarStatus();
      }
    }
  }

  /**
   * @brief Verifica se as duas células selecionadas formam um par (se tem o mesmo caminho de imagem).
   *
   * @details Se formarem um par, marca-as como encontradas e verifica se o jogo terminou.
   *          Se não formarem um par, esconde-as novamente após um breve intervalo.
   *
   * @see Celula#marcarComoEncontrada
   * @see Celula#esconder
   * @see JogoController#finalizarJogo
   * @see JogoView#atualizarCard
   */
  verificarPar() {
    const [primeira, segunda] = this.celulasSelecionadas;

    if (primeira.celula.getCaminho() === segunda.celula.getCaminho()) {
      primeira.celula.marcarComoEncontrada();
      segunda.celula.marcarComoEncontrada();
      this.paresEncontrados++;

      this.celulasSelecionadas = [];

      if (this.tabuleiro.todasCelulasEncontradas()) {
        setTimeout(() => this.finalizarJogo(), 500);
      }
    } else {
      this.jogoAtivo = false;
      setTimeout(() => {
        primeira.celula.esconder();
        segunda.celula.esconder();

        this.view.atualizarCard(primeira.celula, primeira.imgElement);
        this.view.atualizarCard(segunda.celula, segunda.imgElement);

        this.celulasSelecionadas = [];
        this.jogoAtivo = true;
      }, 500);
    }
  }

  /**
   * @brief Finaliza o jogo, pausando o timer (se aplicável) e exibindo a mensagem de vitória.
   *
   * @details Salva as informações do jogo e exibe uma mensagem final com o número de movimentos e o tempo (se aplicável).
   *
   * @see salvarInformacoes
   * @see JogoView#mostrarMensagemFinal
   */
  finalizarJogo() {
    this.jogoAtivo = false;

    if (this.timer) {
      this.timer.pausar();
      clearInterval(this.intervaloTempo);
    }

    this.salvarInformacoes(true);

    setTimeout(() => {
      let tempo = null;
      if (this.usarTimer && this.timer) {
        tempo = this.timer.getTempoDecorrido();
      }

      this.view.mostrarMensagemFinal({
        movimentos: this.movimentos,
        tempo: tempo,
        vitoria: true,
      });
    }, 300);
  }

  finalizarJogoPorTempo() {
    this.jogoAtivo = false;

    this.timer.pausar();
    clearInterval(this.intervaloTempo);

    this.salvarInformacoes(false);

    setTimeout(() => {
      let tempo = null;

      this.view.mostrarMensagemFinal({
        movimentos: this.movimentos,
        tempo: tempo,
        vitoria: false,
        tempoLimite: this.tempoLimite,
      });
    }, 300);
  }

  finalizarJogoPorDesistencia() {
    this.jogoAtivo = false;

    if (this.timer) {
      this.timer.pausar();
      clearInterval(this.intervaloTempo);
    }

    this.salvarInformacoes(false);

    setTimeout(() => {
      let tempo = null;

      this.view.mostrarMensagemFinal({
        movimentos: this.movimentos,
        tempo: tempo,
        vitoria: null,
      });
    }, 300);
  }

  /**
   * @brief Salva as informações do jogo atual (tamanho do tabuleiro, movimentos, pontuação e tempo).
   *
   * @details As informações são enviadas para o back-end via requisição fetch.
   *
   */
  async salvarInformacoes(vitoria) {
  console.log("Salvando informações do jogo no servidor...");

  const tempo = (this.usarTimer && this.timer)
    ? this.timer.getTempoDecorrido()
    : null;

  const payload = {
    tamanho_tabuleiro: this.tabuleiro.tamanho,        
    quantidade_movimentos: this.movimentos,           
    pontuacao: this.paresEncontrados,                 
    modo_jogo: !!this.usarTimer,                      
    tempo_segundos: tempo,                            
    resultado: !!vitoria                             
  };

  try {
    const resp = await fetch('/projeto_web/back_end/score/save_game.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    , body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      console.error('Falha ao salvar jogo:', data.message || data);
      return;
    }

    console.log('Jogo salvo! id_jogo:', data.id_jogo);
  } catch (err) {
    console.error('Erro de rede ao salvar jogo:', err);
  }
}

  /**
   * @brief Reinicia o jogo, resetando o tabuleiro, os contadores e o timer (se aplicável).
   * @details Re-renderiza o tabuleiro e reinicia o timer.
   */
  reiniciar() {
    this.movimentos = 0;
    this.paresEncontrados = 0;
    this.celulasSelecionadas = [];
    this.jogoAtivo = true;
    this.tabuleiro.reset(imagensDict);

    if (this.timer) {
      this.timer.resetar();
      this.timer.iniciar();
      clearInterval(this.intervaloTempo);
      this.iniciarAtualizacaoTempo();
    }

    this.view.renderizarTabuleiro(
      this.tabuleiro,
      (index, celula, img, cardWrapper) => {
        this.processarJogada(index, celula, img, cardWrapper);
      }
    );

    this.atualizarStatus();
  }

  /**
   * @brief Notifica a view para atualizar o status do jogo (movimentos e modo).
   *
   * @see JogoView#atualizarStatus
   */
  atualizarStatus() {
    this.view.atualizarStatus(
      this.movimentos,
      this.usarTimer,
      this.tempoLimite
    );
  }

  /**
   * @brief Ativa ou desativa o modo trapaça, revelando ou escondendo todas as cartas não encontradas.
   *
   * @details trapaca = 1 ativa o modo trapaça (revela todas as cartas não encontradas).
   *          trapaca = -1 desativa o modo trapaça (esconde todas as cartas não encontradas).
   */
  modoTrapaca() {
    this.trapaca *= -1;

    const imagens = this.view.container.querySelectorAll(".img-cards");

    if (this.trapaca === -1) {
      for (let i = 0; i < this.tabuleiro.getTotalCelulas(); i++) {
        const celula = this.tabuleiro.getCelula(i);
        const img = imagens[i];
        if (!celula.isEncontrada()) {
          celula.revelar();
          this.view.atualizarCard(celula, img);
        }
      }
    } else {
      for (let i = 0; i < this.tabuleiro.getTotalCelulas(); i++) {
        const celula = this.tabuleiro.getCelula(i);
        const img = imagens[i];
        if (!celula.isEncontrada()) {
          celula.esconder();
          this.view.atualizarCard(celula, img);
        }
      }
    }
  }

  /**
   * @brief Retorna a pontuação atual (número de pares encontrados).
   *
   * @return {number} Número de pares encontrados.
   */
  getPontuacao() {
    return this.paresEncontrados;
  }

  /**
   * @brief Retorna o número de movimentos realizados.
   *
   * @return {number} Número de movimentos realizados.
   */
  getMovimentos() {
    return this.movimentos;
  }

  /**
   * @brief Verifica se o jogo ainda está ativo (aceitando jogadas).
   *
   * @return {boolean} true se o jogo estiver ativo e não tiver terminado, false caso contrário.
   */
  isJogoAtivo() {
    return this.jogoAtivo && !this.tabuleiro.todasCelulasEncontradas();
  }
}
