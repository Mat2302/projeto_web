"use strict";

/**
 * @file celula-model.js
 * @brief Modelo que representa uma célula (carta) no jogo de memória.
 * @details Este arquivo define a classe Celula, que encapsula o estado e o comportamento de uma célula no jogo de memória.
 *          Cada célula possui um caminho para a imagem, um verso padrão, e estados de visibilidade e se foi encontrada.
 */

/**
 * Classe que representa uma célula (carta) no jogo de memória.
 * @class
 * @brief Representa uma célula no jogo de memória.
 * @details Cada célula possui um caminho para a imagem, um verso padrão, e estados de visibilidade e se foi encontrada.
 * */
export class Celula {

    /**
     * @brief Caminho da imagem da célula.
     * @type {string}
     */
    caminho;

    /**
     * @brief Caminho da imagem do verso da célula.
     * @type {string}
     * @default "../../img/game-board/robot-card.svg"
     */
    verso = "../../img/game-board/robot-card.svg";

    /**
     * @brief Indica se a célula está visível (revelada).
     * @type {boolean}
     * @default false
     */
    visivel = false;
    
    /**
     * @brief Indica se a célula foi encontrada (par correspondente).
     * @type {boolean}
     * @default false
     */
    encontrada = false;

    /**
     * @brief Construtor da classe Celula, gerenciado pelo Tabuleiro.
     * @param {string} caminho - Caminho da imagem da célula.
     */
    constructor(caminho) {
        this.caminho = caminho;
    }

    /**
     * @brief Revela a célula, tornando-a visível.
     * @returns {boolean} true se a célula foi revelada, false se já estava visível ou se já foi encontrada (ficando permanentemente revelada).
     */
    revelar() {
        if (!this.visivel && !this.encontrada) {
            this.visivel = true;
            return true;
        }
        return false;
    }

    /**
     * @brief Esconde a célula, tornando-a invisível (se não foi encontrada).
     */
    esconder() {
        if (!this.encontrada) {
            this.visivel = false;
        }
    }

    /**
     * @brief Marca a célula como encontrada, tornando-a permanentemente visível.
     */
    marcarComoEncontrada() {
        this.encontrada = true;
        this.visivel = true;
    }

    /**
     * @brief Reseta a célula para o estado inicial (invisível e não encontrada).
     */
    reset() {
        this.visivel = false;
        this.encontrada = false;
    }

    /**
     * 
     * @returns {string} Caminho da imagem da célula.
     */
    getCaminho() {
        return this.caminho;
    }

    /**
     * @returns {string} Caminho da imagem do verso da célula.
     */
    getVerso() {
        return this.verso;
    }

    /**
     * @returns {boolean} true se a célula está visível, false caso contrário.
     */
    isVisivel() {
        return this.visivel;
    }

    /**
     * @returns {boolean} true se a célula foi encontrada, false caso contrário.
     */
    isEncontrada() {
        return this.encontrada;
    }
}