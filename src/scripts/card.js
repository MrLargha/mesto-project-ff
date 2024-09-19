import {
  deleteCardFromServer,
  likeCardOnServer,
  dislikeCardOnServer,
} from "./api.js";

// Темлпейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Функция удаления карточки
export function deleteCard(event, card) {
  const deleteItem = event.target.closest(".card");
  deleteCardFromServer(card)
    .then(() => {
      deleteItem.remove();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    });
}

// Функция лайка карточки
export function likeCard(event, card) {
  const likeButton = event.currentTarget;
  const likeContainer = likeButton
    .closest(".card__description")
    .querySelector(".card__like-container");
  const likeCountElement = likeContainer.querySelector(
    ".card__like-button_likes"
  );

  likeButton.classList.toggle("card__like-button_is-active");

  // Ставим/убираем лайк
  if (likeButton.classList.contains("card__like-button_is-active")) {
    likeCardOnServer(card)
      .then((data) => {
        likeCountElement.textContent = data.likes.length;
      })
      .catch((error) => {
        likeButton.classList.toggle("card__like-button_is-active");
        console.log(`Ошибка: ${error.message}`);
      });
  } else {
    dislikeCardOnServer(card)
      .then((data) => {
        if (data.likes.length > 0) {
          likeCountElement.textContent = data.likes.length;
        } else {
          likeCountElement.textContent = "";
        }
      })
      .catch((error) => {
        likeButton.classList.toggle("card__like-button_is-active");
        console.log(`Ошибка: ${error.message}`);
      });
  }
}

// Функция получения шаблона карточки
function getCardTemplate() {
  return cardTemplate.querySelector(".card").cloneNode(true);
}

// Функция создания карточки
export function createCard(
  userId,
  card,
  deleteCallback,
  likeCallBack,
  openCallback
) {
  const cardElement = getCardTemplate();
  const cardImage = cardElement.querySelector(".card__image"); // Выносим поиск элемента в отдельную переменную
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = card.name;
  cardImage.src = card.link; 
  cardImage.alt = "Изображение " + card.name; 

  // Отображение лайков на карточке
  if (card.likes.length > 0) {
    cardElement.querySelector(".card__like-button_likes").textContent =
      card.likes.length;
  }

  card.likes.forEach((like) => {
    // Проверяем совпадение id пользователя
    if (like._id === userId) {
      likeButton.classList.add("card__like-button_is-active");
    }
  });

  // Установка слушателей
  cardElement.addEventListener("click", openCallback);
  likeButton.addEventListener("click", () => {
    likeCallBack(event, card);
  });
  if (userId === card.owner._id) {
    deleteButton.addEventListener("click", () => deleteCallback(event, card));
  } else {
    deleteButton.remove();
  }

  return cardElement;
}
