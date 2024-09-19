// Анимация загрузки ответа от сервера на кнопках "Сохранить" в модальных окнах
export function renderLoadingForm(isLoading, popupButton) {
    if (isLoading) {
      popupButton.textContent = "Сохранение...";
    } else {
      popupButton.textContent = "Сохранить";
    }
  }