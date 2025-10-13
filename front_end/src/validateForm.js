// https://www.w3schools.com/js/js_regexp.asp
// https://medium.com/xp-inc/regex-um-guia-pratico-para-expressões-regulares-1ac5fa4dd39f
// https://medium.com/@sketch.paintings/email-validation-with-javascript-regex-e1b40863ed23
// https://pt.stackoverflow.com/questions/130541/regex-para-validar-data-yyyy-mm-dd

"use strict";

var isValid = false;

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

    if (!validate || !isValid) {
      e.preventDefault();
      if (!isValid) {
        var photoAlert = document.getElementById("alertFile");
        photoAlert.innerHTML = `<img src="../../img/danger.png" class="img-icon-alert"/> A imagem deve ter 1x1 (quadrada)!`;
        document.getElementById("photo").style.borderColor = "#d00000";
      }
      return;
    }
    saveLogin();
  });
});

function validateInput(input, span, message) {
  var values = input.value;
  var validate = true;
  var regex;

  switch (input.id) {
    case "name":
      regex = /^(?=.*[\s])[A-Za-zÀ-ü\s]{3,}$/;
      if (!regex.test(values)) {
        message = "O nome deve conter apenas letras e pelo menos 3 caracteres!";
        validate = false;
      }
      break;

    case "username":
      regex = /^[A-Za-z0-9._]{3,20}$/;
      if (!regex.test(values)) {
        message = "O username deve ter entre 3 e 20 caracteres, sem espaços!";
        validate = false;
      }
      break;
    case "email":
      regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(values)) {
        message = "Email inválido!";
        validate = false;
      }
      break;
    case "birth":
      if (!validateDate(values)) {
        message = "A data de nascimento deve ser válida! (xx/xx/xxxx)";
        validate = false;
      }
      break;

    case "telephone":
      regex = /^\d{10,11}$/;
      if (!regex.test(values)) {
        message = "O telefone inserido não é válido (aceita apenas números)!";
        validate = false;
      }
      break;

    case "cpf":
      regex = /^\d{11}$/;
      if (!regex.test(values)) {
        message = "O CPF inserido não é válido (aceita apenas números)!";
        validate = false;
      }
      break;

    case "pssd":
      regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;
      if (!regex.test(values)) {
        message =
          "A senha deve conter ao menos 8 caracteres, com letras e números!";
        validate = false;
      }
      break;

    case "photo":
      var file = input.files[0];
      if (!file) {
        message = "Selecione uma imagem!";
        validate = false;
        isValid = false;
      } else {
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width != img.height) {
            span.innerHTML = `<img src="../../img/danger.png" class="img-icon-alert"/> A imagem deve ter 1x1 (quadrada)!`;
            input.style.borderColor = "d00000";
            isValid = false;
          } else {
            span.innerHTML = "";
            input.style.borderColor = "#b5e48c";
            isValid = true;
          }
        };
      }
      break;
  }

  if (!validate || values == "") {
    span.innerHTML = `<img src="../../img/danger.png" class="img-icon-alert" alt="Ícone de alerta"/> ${message}`;
    input.style.borderColor = "#d00000";
    return false;
  } else if (input.id !== "photo") {
    span.innerHTML = "";
    input.style.borderColor = "#b5e48c";
    return true;
  }

  return true;
}

function validateDate(date) {
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!regex.test(date)) {
    return false;
  }

  var [day, month, year] = date.split("/").map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  var daysMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysMonth) {
    return false;
  }

  var today = new Date();
  var date = new Date(year, month - 1, day);
  if (date > today) {
    return false;
  }

  return true;
}

function saveLogin() {
  const username = document.getElementById("username").value;
  sessionStorage.setItem("username", username);
}
