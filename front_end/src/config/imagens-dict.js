"use strict";

/**
 * @file imagens-dict.js
 * @brief Arquivo de configuração que contém o dicionário de imagens para o jogo de memória.
 * @details Este arquivo define um objeto que mapeia números inteiros a caminhos de imagens.
 *          Essas imagens são usadas para representar as cartas no jogo de memória.
 */

/**
 * Imagens disponíveis para o jogo de memória, organizadas em um dicionário.
 * As chaves são números inteiros que são usados para identificar cada imagem e em funções de embaralhamento.
 * 
 * @todo Adicionar as imagens faltantes ao dicionário.
 * 
 * @type {Object.<number, string>} 
 * @const
 */
export const imagensDict = {
    1: "../../img/game-board/go.svg",
    2: "../../img/game-board/julia.svg",
    3: "../../img/game-board/kotlin.svg",
    4: "../../img/game-board/perl.svg",
    5: "../../img/game-board/python.svg",
    6: "../../img/game-board/ruby.svg",
    7: "../../img/game-board/rust.svg",
    8: "../../img/game-board/swift.svg"
};