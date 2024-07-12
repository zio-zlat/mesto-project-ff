export function createCard (item, deleteCard, openImage, likeButton) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardImage = cardElement.querySelector('.card__image');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
    
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardElement.querySelector('.card__title').textContent = item.name;
    
  deleteButton.addEventListener('click', deleteCard);
  cardImage.addEventListener('click', () => { openImage (item) });
  cardLikeButton.addEventListener('click', likeButton)

  return cardElement;
};
  
export function deleteCard (evt) {
  const cardItem = evt.target.closest('.places__item');
  cardItem.remove();
};

export function likeButton (evt) {
    evt.target.classList.toggle('card__like-button_is-active');
};