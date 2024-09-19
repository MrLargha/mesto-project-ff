"use strict"; 

const cardTemplate = document.querySelector("#card-template").content;

export function deleteCard(event) {
  const deleteItem = event.target.closest(".card");
  deleteItem.remove();
}

export function likeCard(event) {
  event.currentTarget.classList.toggle("card__like-button_is-active");
}

export function createCard(
  name,
  link,
  deleteCallback,
  likeCallBack,
  openCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = name;
  cardElement.querySelector(".card__image").src = link;
  cardElement.querySelector(".card__image").alt = "Изображение " + name;

  likeButton.addEventListener("click", likeCallBack);
  deleteButton.addEventListener("click", deleteCallback);
  cardElement.addEventListener("click", openCallback);

  return cardElement;
}