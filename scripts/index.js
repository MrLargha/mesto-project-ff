const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

function createCard(cardData, deleteCallback) {
    const cardInstance = cardTemplate.cloneNode(true);
    const image = cardInstance.querySelector('.card__image');
    const deleteButton = cardInstance.querySelector('.card__delete-button');
    const title = cardInstance.querySelector('.card__title');

    title.textContent = cardData.name;
    image.src = cardData.link;
    image.alt = "Картинка с изображением " + cardData.name;
    deleteButton.addEventListener('click', deleteCallback)

    return cardInstance;
}

function deleteCard(evt) {
    evt.target.closest('.card').remove()
}

initialCards.forEach((card) => {
    const newCard = createCard(card, deleteCard);
    placesList.append(newCard);
})
