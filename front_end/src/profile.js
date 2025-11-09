"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const inputs = {
    name: document.querySelector(".name"),
    email: document.querySelector(".email"),
    tel: document.querySelector(".tel"),
    username: document.querySelector(".username"),
    birth: document.querySelector(".birth"),
    cpf: document.querySelector(".cpf"),
  };

  const editButtons = document.querySelectorAll(".edit-profile");
  const editableFields = ["name", "email", "tel"];

  function loadProfile() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../../back_end/profile/info_profile.php", true);
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const res = JSON.parse(xhttp.responseText);
          if (!res.success) {
            console.error("Erro no servidor:", res.error);
            return;
          }

          const d = res.data;
          inputs.name.value = d.nome || "";
          inputs.email.value = d.email || "";
          inputs.tel.value = d.telefone || "";
          inputs.username.value = d.usuario || "";
          inputs.birth.value = d.data_nascimento || "";
          inputs.cpf.value = d.cpf || "";
        } catch (e) {
          console.error("Erro ao analisar JSON:", e);
        }
      }
    };
    xhttp.send();
  }

  function updateProfile(nome, email, telefone) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "../../back_end/profile/update-jogador.php", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const payload = JSON.stringify({ nome, email, telefone });

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const res = JSON.parse(xhttp.responseText);
          if (res.success) {
            alert("Perfil atualizado com sucesso!");
          } else {
            alert("Erro: " + res.error);
          }
        } catch (e) {
          console.error("Erro ao interpretar resposta:", e);
        }
      }
    };
    xhttp.send(payload);
  }

  function toggleEdit(input, button) {
    const isEditing = !input.readOnly;

    if (!isEditing) {
      input.readOnly = false;
      input.style.backgroundColor = "rgba(56, 163, 165, 0.7)";
      input.style.borderRadius = "20px";
      input.style.cursor = "text";
      button.src = "../../img/check.svg";
      input.focus();
    } else {
      input.readOnly = true;
      input.style.backgroundColor = "transparent";
      input.style.cursor = "default";
      button.src = "../../img/edit.svg";

      updateProfile(inputs.name.value, inputs.email.value, inputs.tel.value);
    }
  }

  editButtons.forEach((button) => {
    const input = button.previousElementSibling;
    if (editableFields.some((cls) => input.classList.contains(cls))) {
      button.addEventListener("click", () => toggleEdit(input, button));
    } else {
      input.addEventListener("focus", (e) => e.target.blur());
    }
  });

  loadProfile();
});
