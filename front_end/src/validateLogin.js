"use strict";

document.addEventListener("DOMContentLoaded", () => {
  var form = document.getElementById("registerForm");

  var inputs = {
    username: {
      input: document.getElementById("username"),
      span: document.getElementById("alertUser"),
      message: "O usuário deve ser preenchido!",
    },
  };

  Object.values(inputs).forEach(({ input, span, message }) => {
    input.addEventListener("blur", () => validateInput(input, span, message));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    var validate = true;

    Object.values(inputs).forEach(({ input, span, message }) => {
      if (!validateInput(input, span, message)) {
        validate = false;
      }
    });

    if (!validate) {
      e.preventDefault();
    } else {
      saveLogin();
    }
  });
});

function validateInput(input, span, message) {
  var values = input.value;
  var validate = true;
  var regex;

  switch (input.id) {
    case "username":
      regex = /^[A-Za-z0-9._]{3,20}$/;
      if (!regex.test(values)) {
        message = "O usuário deve ser preenchido!";
        validate = false;
      }
      break;
  }

  if (!validate || values == "") {
    span.innerHTML = `<img src="../../img/danger.png" class="img-icon-alert" alt="Ícone de alerta"/> ${message}`;
    input.style.borderColor = "#d00000";
    return false;
  } else {
    span.innerHTML = "";
    input.style.borderColor = "#b5e48c";
    return true;
  } 
}

function saveLogin() {
  const info_login = new FormData();
  info_login.append("username", document.getElementById("username").value);
  info_login.append("pssd", document.getElementById("pssd").value);

  let xhttp = new XMLHttpRequest();

  if (!xhttp) {
    alert("Erro ao criar objeto XMLHttpRequest.");
    return;
  }

  xhttp.open("POST", "../../back_end/login/login.php", true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      try {
        const response = JSON.parse(xhttp.responseText);
        console.log(response.data);
        if (!response.success) {
          alert(response.data);
          return;
        }
        sessionStorage.setItem("username", response.data.usuario);
        sessionStorage.setItem("idJogador", response.data.id_jogador);
        window.location.href = "../pages/selection.html";
      } catch (e) {
        console.error("Erro ao analisar o JSON: ", e);
      }
    }
  };
  xhttp.send(info_login);
}
