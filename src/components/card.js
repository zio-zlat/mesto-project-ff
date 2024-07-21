export function createCard(userID, dataCard, deleteCard, openImage, likeButton, openModal, closeModal) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardImage = cardElement.querySelector('.card__image');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const quantityLikes = cardElement.querySelector('.quantity__likes');
  
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

  deleteButton.addEventListener('click', () => { deleteCard(dataCard._id, cardElement) });
  cardImage.addEventListener('click', () => { openImage(dataCard) });
  cardLikeButton.addEventListener('click', (evt) => { likeButton(dataCard._id, quantityLikes, closeModal, openModal, cardLikeButton, evt) });

  return cardElement;
};