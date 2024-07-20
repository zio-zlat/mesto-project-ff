import { deleteCardToServer, addLikeButtonToServer, deleteLikeButtonToServer } from './api.js';

export function createCard (userID, dataCard, deleteCard, openImage, likeButton, openModal, closeModal) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardImage = cardElement.querySelector('.card__image');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const quantityLikes = cardElement.querySelector('.quantity__likes');
  const popupDeleteCard = document.querySelector('.popup_type_delete-card');
  if (userID !== dataCard.owner._id) {
    deleteButton.remove();
  };
    
  cardImage.src = dataCard.link;
  cardImage.alt = dataCard.name;
  cardElement.querySelector('.card__title').textContent = dataCard.name;
  quantityLikes.textContent = dataCard.likes.length;
  dataCard.likes.some((item) => {
    if (item._id === userID) {
      cardLikeButton.classList.add('card__like-button_is-active');
    }
  });
    
  deleteButton.addEventListener('click', (evt) => { openModal(popupDeleteCard, deleteCard(dataCard._id, popupDeleteCard, closeModal, openModal, evt)) });
  cardImage.addEventListener('click', () => { openImage(dataCard) });
  cardLikeButton.addEventListener('click', (evt) => { likeButton(dataCard._id, quantityLikes, closeModal, openModal, evt) });

  return cardElement;
};

const popupError = document.querySelector('.popup_type_error');
const textPopupError = popupError.querySelector('.popup__title');

export function deleteCard(cardID, popup, closeModal, openModal, evt) {
  const yesDelete = popup.querySelector('.popup__button');
  yesDelete.addEventListener('click', () => {
    deleteCardToServer(cardID) 
    .then(() => {
      const cardItem = evt.target.closest('.places__item');
      cardItem.remove();
      closeModal(popup);
    })
    .catch((err) => {
      closeModal(popup);
      openModal(popupError);
      textPopupError.textContent = err;
    })
    .finally(() => {
      setTimeout(() => closeModal(popupError), 1500);
    })
  })
};

export function likeButton(cardID, quantityLikes, closeModal, openModal, evt) {
  const cardLike = evt.target.classList.toggle('card__like-button_is-active');
  if(cardLike) {
    addLikeButtonToServer(cardID)
      .then((dataCard) => {
        quantityLikes.textContent = dataCard.likes.length;
      })
      .catch((err) => {
        openModal(popupError);
        textPopupError.textContent = err;
        evt.target.classList.remove('card__like-button_is-active');
      })
      .finally(() => {
        setTimeout(() => closeModal(popupError), 1500);
      })
  } else {
    deleteLikeButtonToServer(cardID)
      .then((dataCard) => {
        quantityLikes.textContent = dataCard.likes.length;
      })
      .catch((err) => {
        openModal(popupError);
        textPopupError.textContent = err;
        evt.target.classList.add('card__like-button_is-active');
      })
      .finally(() => {
        setTimeout(() => closeModal(popupError), 1500);
      })
  }
};