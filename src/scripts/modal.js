"use strict";

export function closeModal(modal) {
  modal.classList.add("popup_is-animated");
  modal.classList.remove("popup_is-opened");

  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".popup__close")
    .removeEventListener("click", handleCloseButtonClick);

  setTimeout(function () {
    modal.classList.remove("popup_is-animated");
  }, 600);
}

// Открыть модальное окно
export function openModal(modal) {
  modal.classList.add("popup_is-animated");
  setTimeout(function () {
    modal.classList.add("popup_is-opened");
  }, 1);
  modal.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleKeyDown);
  modal
    .querySelector(".popup__close")
    .addEventListener("click", handleCloseButtonClick);
}

// Закрытие через оверлей
function handleOverlayClick(event) {
  const modal = event.currentTarget;
  if (event.target === modal) {
    closeModal(modal);
  }
}

// Закрытие через кнопку крестика
function handleCloseButtonClick(event) {
  const modal = event.target.closest(".popup");
  closeModal(modal);
}

// Закрытие через Esc
function handleKeyDown(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    closeModal(openedModal);
  }
}