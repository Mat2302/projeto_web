"use strict";

document.addEventListener("DOMContentLoaded", () => {
    var header = document.querySelector(".header-container");

    if(!header) {
        console.error("Div 'header-container' não encontrada!");
        return;
    }

    fetch("../components/header.html")
    .then(response =>  {
        if(!response.ok) { //http 
            throw new Error("Arquivo não encontrado! status: " + response.status);
        }
        return response.text();
    })

    .then(html => {
        header.innerHTML = html;
    })

    .catch(error => {
        console.error("Falha ao carregar o header: ", error);
    });
});