"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const editable = ["name", "tel", "email"];

  const input = document.querySelectorAll(".profile-info input");
  input.forEach((input) => {
    if (!editable.some((cls) => input.classList.contains(cls))) {
      input.setAttribute("tabindex", "-1");
      input.addEventListener("focus", (e) => e.target.blur());
    } else {
      input.style.backgroundColor = "transparent";
      input.style.color = "#FFF";
      input.style.cursor = "default";
    }
  });

  const editBtn = document.querySelectorAll(".edit-profile");

  editBtn.forEach((button) => {
    const inputEditable = button.previousElementSibling;

    if (editable.some((cls) => inputEditable.classList.contains(cls))) {
      button.addEventListener("click", () => {
        const editing = !inputEditable.readOnly;
        inputEditable.readOnly = editing;

        if (!editing) {
          inputEditable.style.backgroundColor = "rgba(56, 163, 165, 0.7)";
          inputEditable.style.borderRadius = "20px";
          inputEditable.style.textDecoration = "none";
          inputEditable.style.color = "#FFF";
          inputEditable.style.cursor = "text";
          inputEditable.focus();
          button.src = "../../img/check.svg";
        } else {
          inputEditable.style.backgroundColor = "transparent";
          inputEditable.style.textDecoration = "underline";
          inputEditable.style.color = "#FFF";
          inputEditable.style.cursor = "default";
          button.src = "../../img/edit.svg";
        }
      });
    }
  });
});
