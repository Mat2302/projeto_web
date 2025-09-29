"use-strict";

/**
 * @file tabuleiro-model.js
 * @brief Modelo que representa o tabuleiro do jogo de memória.
 * @details Este arquivo define a classe Tabuleiro, que encapsula o estado e o comportamento do tabuleiro do jogo de memória. Também inclui a lógica para inicializar as células, embaralhá-las e verificar o estado do jogo.
 */

import { Celula } from "./celula-model.js";

/**
 * Classe que representa o tabuleiro do jogo de memória.
 * @class
 * @brief Representa o tabuleiro do jogo de memória.
 * @details O tabuleiro é composto por várias células (cartas) que podem ser reveladas, escondidas e marcadas como encontradas.
 *          A classe Tabuleiro gerencia a criação, embaralhamento e estado das células.
 * */
export class Tabuleiro {

    /**
     * @brief Array de células que compõem o tabuleiro.
     * @type {Celula[]}
     */
    celulas = [];

    /**
     * @brief Total de células no tabuleiro.
     * @type {number}
     */
    totalCelulas;

    /**
     * @brief Tamanho do tabuleiro (quadrado, NxN).
     * @type {number}
     */
    tamanho;

    /**
     * @brief Construtor da classe Tabuleiro.
     * @param {number} totalCelulas - Total de células no tabuleiro (deve ser um número par).
     * @param {Object.<number, string>} imagensDict - Dicionário de imagens disponíveis para o jogo.
     * @see imagens-dict.js
     */
    constructor(totalCelulas, imagensDict) {
        this.totalCelulas = totalCelulas;
        this.tamanho = Math.sqrt(totalCelulas);
        this.inicializarCelulas(imagensDict);
    }

    /**
     * @brief Inicializa as células do tabuleiro, criando pares de imagens e embaralhando-as.
     * @param {Object.<number, string>} imagensDict - Dicionário de imagens disponíveis para o jogo.
     * @see imagens-dict.js
     */
    inicializarCelulas(imagensDict) {

        const paresNecessarios = this.totalCelulas / 2;
        const imagensArray = Object.entries(imagensDict);
        const embaralhadas = this.embaralhar([...imagensArray]);
        const escolhidas = embaralhadas.slice(0, paresNecessarios).map(([_, v]) => v);

        let pares = [];
        escolhidas.forEach(img => pares.push(img, img));
        pares = this.embaralhar(pares);

        this.celulas = pares.map(caminho => new Celula(caminho));
    }

    /**
     * @brief Embaralha um array usando o algoritmo de Fisher-Yates.
     * @param {Array} array - Array a ser embaralhado.
     * @returns {Array} Novo array embaralhado.
     * @src https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * */
    embaralhar(array) {
        const novoArray = [...array];
        for (let i = novoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
        }
        return novoArray;
    }

    /**
     * @brief Retorna a célula no índice especificado.
     * @param {number} index - Índice da célula a ser retornada.
     * @returns {Celula} Célula no índice especificado.
     */
    getCelula(index) {
        return this.celulas[index];
    }

    /**
     * @brief Retorna todas as células que estão visíveis (reveladas) e não foram encontradas.
     * @returns {Celula[]} Array de células visíveis e não encontradas.
     */
    getCelulasVisiveis() {
        return this.celulas.filter(celula => celula.isVisivel() && !celula.isEncontrada());
    }

    /**
     * @brief Retorna todas as células que foram encontradas.
     * @returns {Celula[]} Array de células encontradas.
     */
    getCelulasEncontradas() {
        return this.celulas.filter(celula => celula.isEncontrada());
    }

    /**
     * @brief Verifica se todas as células foram encontradas.
     * @returns {boolean} true se todas as células foram encontradas, false caso contrário.
     */
    todasCelulasEncontradas() {
        return this.getCelulasEncontradas().length === this.totalCelulas;
    }

    /**
     * @brief Retorna o total de células no tabuleiro.
     * @returns {number} Total de células.
     */
    getTotalCelulas() {
        return this.totalCelulas;
    }

    /**
     * @brief Retorna o tamanho do tabuleiro (NxN).
     * @returns {number} Tamanho do tabuleiro.
     */
    getTamanho() {
        return this.tamanho;
    }

    /**
     * @brief Reseta o tabuleiro, escondendo todas as células e reembaralhando-as.
     * @param {Object.<number, string>} imagensDict - Dicionário de imagens disponíveis para o jogo.
     * @see imagens-dict.js
     */
    reset() {
        this.celulas.forEach(celula => celula.reset());
        this.inicializarCelulas(imagensDict);
    }
}