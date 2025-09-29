"use strict";

/**
 * @file timer-model.js
 * @brief Modelo que representa o temporizador do jogo de memória.
 * @details Este arquivo define a classe Timer, que encapsula o estado e o comportamento do temporizador do jogo de memória.
 *          A classe Timer gerencia o tempo decorrido, iniciando, pausando e resetando o temporizador.
 */

/**
 * Classe que representa o temporizador do jogo de memória.
 * @class
 * @brief Representa o temporizador do jogo de memória.
 * @details O temporizador gerencia o tempo decorrido, iniciando, pausando e resetando o temporizador.
 */
export class Timer {

    /**
     * @brief Tempo inicial em milissegundos.
     * @type {number}
     */
    tempoInicial;

    /**
     * @brief Tempo decorrido em milissegundos.
     * @type {number}
     * @default 0
     */
    tempoDecorrido = 0;

    /**
     * @brief Intervalo do temporizador.
     * @type {number}
     */
    intervalo;

    /**
     * @brief Indica se o temporizador está ativo.
     * @type {boolean}
     * @default false
     */
    ativo = false;

    /**
     * @brief inicializa o temporizador.
     */
    iniciar() {
        if (this.ativo) return;
        this.tempoInicial = Date.now() - this.tempoDecorrido;
        this.ativo = true;
    }

    /**
     * @brief Pausa o temporizador.
     */
    pausar() {
        if (!this.ativo) return;
        clearInterval(this.intervalo);
        this.ativo = false;
    }

    /**
     * @brief Reseta o temporizador.
     */
    resetar() {
        clearInterval(this.intervalo);
        this.tempoDecorrido = 0;
        this.ativo = false;
    }

    /**
     * @brief Retorna o tempo decorrido em segundos.
     * @returns {number} Tempo decorrido em segundos.
     */
    getTempoDecorrido() {
        if (this.ativo) {
            return Math.floor((Date.now() - this.tempoInicial) / 1000);
        }
        return Math.floor(this.tempoDecorrido / 1000);
    }
}