import "../pages/index.css"; 
import { renderLoadingForm } from "./utils.js";
import { deleteCard, createCard, likeCard } from "./card.js"; 
import { openModal, closeModal } from "./modal.js"; 
import { clearValidation, enableValidation } from "./validation.js";
import {
  getCardsFromServer,
  getUserData,
  editUserData,
  postNewCard,
  postNewAvatar,
} from "./api.js";

// DOM Для карточек
const content = document.querySelector(".places");
const cardList = content.querySelector(".places__list");

// DOM Для edit button
const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const newProfileNameInput = editModal.querySelector(".popup__input_type_name");
const newProfileDescriptionInput = editModal.querySelector(
  ".popup__input_type_description"
);

// DOM Для add button
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const newCardNameInput = newCardModal.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardModal.querySelector(".popup__input_type_url");
const newCardFormElement = newCardModal.querySelector(".popup__form");

// DOM для открытия карточек
const cardModal = document.querySelector(".popup_type_image");
const imageElement = cardModal.querySelector(".popup__image");
const captionElement = cardModal.querySelector(".popup__caption");

// DOM для edit image button
const avatarImage = document.querySelector(".profile__image");
const newImageModal = document.querySelector(".popup_type_new-image");
const newImageModalInput = newImageModal.querySelector(
  ".popup__input_type_url"
);
const newImageButton = document.querySelector(".profile__image-edit-button");
const newImageFormElement = newImageModal.querySelector(".popup__form");

let userId;

// Элемент настроек валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

editButton.addEventListener("click", () => {
  clearValidation(editModal, validationConfig);
  editModalFunction(editModal);
});

// Добавить слушатель на кнопку add
newCardButton.addEventListener("click", () => {
  clearValidation(newCardModal, validationConfig);
  openModal(newCardModal);
});

// Добавить слушатель на кнопку edit image
newImageButton.addEventListener("click", () => {
  clearValidation(newImageModal, validationConfig);
  openModal(newImageModal);
});

// Добавить обработчик события submit для формы new card в модальном окне
newCardModal
  .querySelector(".popup__form")
  .addEventListener("submit", newCardFormHandler);

// Добавить обработчик события submit для формы edit в модальном окне
editModal
  .querySelector(".popup__form")
  .addEventListener("submit", editFormHandler);

// Добавить обработчик события submit для формы new image в модальном окне
newImageModal
  .querySelector(".popup__form")
  .addEventListener("submit", submitEditAvatarForm);

// Поведение попапа изменения профиля (edit)
function editModalFunction(modal) {
  newProfileNameInput.value = profileTitle.textContent;
  newProfileDescriptionInput.value = profileDescription.textContent;

  // Открываем модальное окно
  openModal(modal);
}

// Обработчики submit
function submitEditAvatarForm(event) {
  event.preventDefault();

  renderLoadingForm(true, newImageModal.querySelector(".popup__button"));
  postNewAvatar(newImageModalInput.value)
    .then((res) => {
      avatarImage.style.backgroundImage = `url(${res.avatar})`;
      newImageFormElement.reset();
      closeModal(newImageModal);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      renderLoadingForm(false, newImageModal.querySelector(".popup__button"));
    });
}

// Обработчик edit button
function editFormHandler(event) {
  event.preventDefault();
  renderLoadingForm(true, editModal.querySelector(".popup__button"));
  const newName = newProfileNameInput.value;
  const newDescription = newProfileDescriptionInput.value;

  //Изменяем настройки на сервере
  editUserData(newName, newDescription)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(editModal);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      renderLoadingForm(false, editModal.querySelector(".popup__button"));
    });
}

// Обработчик new button
function newCardFormHandler(event) {
  event.preventDefault();
  renderLoadingForm(true, newCardModal.querySelector(".popup__button"));
  const newCard = {
    name: newCardNameInput.value,
    link: newCardUrlInput.value,
  };

  postNewCard(newCard)
    .then((res) => {
      // Добавляем новую карточку в список
      const cardElement = createCard(
        userId,
        res,
        deleteCard,
        likeCard,
        openCard
      );

      // Добавление карточки в DOM
      cardList.prepend(cardElement);

      // Очищаем поля формы с помощью метода reset()
      newCardFormElement.reset();

      // Закрываем модальное окно
      closeModal(newCardModal);
    })
    // Не получилось запостить новую карточку
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      renderLoadingForm(false, newCardModal.querySelector(".popup__button"));
    });
}

// Функция открытия карточки
function openCard(event) {
  if (
    event.target.classList.contains("card__like-button") ||
    event.target.classList.contains("card__delete-button")
  ) {
    return;
  }

  const link = event.currentTarget.querySelector(".card__image").src;
  const caption = event.currentTarget.querySelector(".card__title").textContent;

  // Присваиваем значения карточки значению попапа
  imageElement.src = link;
  imageElement.alt = caption;
  captionElement.textContent = caption;

  openModal(cardModal);
}


// Ждём пока загрузится DOM
document.addEventListener("DOMContentLoaded", () => {
  // Вызываем функцию enableValidation с передачей объекта настроек
  enableValidation(validationConfig);
});


// Обработка карточек с сервера
function renderCardsFromServer(data, userId) {
  data.forEach((item) => {
    const cardElement = createCard(
      userId,
      item,
      deleteCard,
      likeCard,
      openCard
    );
    // Добавление карточки в DOM
    cardList.append(cardElement);
  });
}

// Обработка профиля с сервера
function renderUserFromServer(user) {
  avatarImage.style.backgroundImage = `url(${user.avatar})`;
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
}

// Базовая логика подгрузки информации о карточках и пользователе с сервера
Promise.all([getCardsFromServer(), getUserData()])
  .then(([data, user]) => {
    userId = user._id;
    renderCardsFromServer(data, user._id);
    renderUserFromServer(user);
  })
  .catch((error) => {
    console.log(`Ошибка: ${error.message}`);
  });
