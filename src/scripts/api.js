export const config = {
  baseUrl: "https://nomoreparties.co/v1/cohort-bac-2",
  headers: {
    authorization: "90452c92-776a-4c8d-9f54-cdf664e8b999",
    "Content-Type": "application/json",
  },
};

// Обработка ответа от сервера
export const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Неверный код ответа сервера");
  }
};

// Получение карточек
export const getCardsFromServer = () => {
  return fetch(config.baseUrl + "/cards", {
    headers: config.headers
  }).then(handleResponse);
};

// Получение данных пользователя
export const getUserData = () => {
  return fetch(config.baseUrl + "/users/me", {
    headers: config.headers
  }).then(handleResponse);
};

// Запрос на изменение данных пользователя
export const editUserData = (newName, newDescription) => {
  return fetch(config.baseUrl + "/users/me", {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newDescription,
    }),
  }).then(handleResponse);
};

// Запостить еще карточку
export const postNewCard = (newCard) => {
  return fetch(config.baseUrl + "/cards", {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: newCard.name,
      link: newCard.link,
    }),
  }).then(handleResponse);
};

// Удалить карточку из сервера
export const deleteCardFromServer = (card) => {
  return fetch(config.baseUrl + "/cards/" + card._id, {
    method: "DELETE",
    headers: config.headers
  }).then(handleResponse);
};

// Поставить лайк карточке на сервере
export const likeCardOnServer = (card) => {
  // Хз откуда взять card._id после публикации карты
  // Возможно, от сервака ответ приходит
  return fetch(config.baseUrl + "/cards/likes/" + card._id, {
    method: "PUT",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Убрать лайк
export const dislikeCardOnServer = (card) => {
  return fetch(config.baseUrl + "/cards/likes/" + card._id, {
    method: "DELETE",
    headers: {
      authorization: config.headers.authorization,
    },
  }).then(handleResponse);
};

// Обновить аватарку
export const postNewAvatar = (url) => {
  return fetch(config.baseUrl + "/users/me/avatar", {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": config.headers["Content-Type"],
    },
    body: JSON.stringify({
      avatar: url,
    }),
  }).then(handleResponse);
};
