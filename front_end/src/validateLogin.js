"use strict";

document.addEventListener("DOMContentLoaded", () => {
  var form = document.getElementById("registerForm");

  var inputs = {
    username: {
      input: document.getElementById("username"),
      span: document.getElementById("alertUser"),
      message: "O usuário deve ser preenchido!",
    },
    // email: {
    //   input: document.getElementById("email"),
    //   span: document.getElementById("alertEmail"),
    //   message: "O email deve ser válido!",
    // },

    pssd: {
      input: document.getElementById("pssd"),
      span: document.getElementById("alertPssd"),
      message: "A senha deve ser preenchida!",
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
  var regex;

  switch (input.id) {
    case "username":
      regex = /^[A-Za-z0-9._]{3,20}$/;
      if (!regex.test(values)) {
        message = "O username deve ter entre 3 e 20 caracteres, sem espaços!";
        validate = false;
      }
      break;
    // case "email":
    //   regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   if (!regex.test(values)) {
    //     message = "Email inválido!";
    //     validate = false;
    //   }
    //   break;
    case "pssd":
      regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;
      if (!regex.test(values)) {
        message =
          "A senha deve conter ao menos 8 caracteres, com letras e números!";
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
  const username = document.getElementById("username").value;
  sessionStorage.setItem("username", username);
}
