"use strict";

(() => {
  const select = document.getElementById("history-mode");
  const requested = new URLSearchParams(window.location.search).get("game");

  if (
    requested &&
    [...select.options].some(option => option.value === requested)
  ) {
    select.value = requested;
  }
})();
