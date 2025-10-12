"use strict";

document.addEventListener("DOMContentLoaded", () => {
  var form = document.getElementById("registerForm");

  var inputs = {
    name: {
      input: document.getElementById("name"),
      span: document.getElementById("alertName"),
      message: "O nome deve ser preenchido!",
    },

    username: {
      input: document.getElementById("username"),
      span: document.getElementById("alertUser"),
      message: "O usuário deve ser preenchido!",
    },

    email: {
      input: document.getElementById("email"),
      span: document.getElementById("alertEmail"),
      message: "O email deve ser válido!",
    },

    birth: {
      input: document.getElementById("birth"),
      span: document.getElementById("alertBirth"),
      message: "A data de nascimento deve ser válida!",
    },

    tel: {
      input: document.getElementById("telephone"),
      span: document.getElementById("alertTel"),
      message: "O telefone deve ser preenchido!",
    },

    cpf: {
      input: document.getElementById("cpf"),
      span: document.getElementById("alertCPF"),
      message: "O CPF deve ser preenchido!",
    },

    pssd: {
      input: document.getElementById("pssd"),
      span: document.getElementById("alertPssd"),
      message: "A senha deve ser preenchida!",
    },

    file: {
      input: document.getElementById("photo"),
      span: document.getElementById("alertFile"),
      message: "A foto deve ser inserida!",
    },
  };

  Object.values(inputs).forEach(({ input, span, message }) => {
    input.addEventListener("blur", () => validateInput(input, span, message));
  });

  form.addEventListener("submit", (e) => {
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

  if (values == "" || values == null) {
    span.innerHTML = `<img src="../../img/danger.png" class="img-icon-alert" alt="Ícone de alerta"/> ${message}`;
    input.style.borderColor = "#d00000";
    validate = false;
  } else {
    span.innerHTML = "";
    input.style.borderColor = "#b5e48c";
  }

  return validate;
}

function saveLogin() {
  const username = document.getElementById("username").value;
  sessionStorage.setItem("username", username);
}