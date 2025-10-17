"use strict";

function switchType(id) {
  if (document.getElementById(id).getAttribute("type") == "password") {
    document.getElementById(id).setAttribute("type", "text");
  } else {
    document.getElementById(id).setAttribute("type", "password");
  }
}
