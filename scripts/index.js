// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

function addCard (item, deleteCard) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__image').src = item.link;
  cardElement.querySelector('.card__image').alt = item.name;
  cardElement.querySelector('.card__title').textContent = item.name;
  deleteButton.addEventListener('click', deleteCard);

  return cardElement;
};

function deleteCard (evt) {
  cardItem = evt.target.closest('.places__item');
  cardItem.remove();
};

initialCards.forEach(function (item) {
  const card = addCard(item, deleteCard);
  placesList.append(card);
});