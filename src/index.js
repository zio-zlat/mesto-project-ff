import './pages/index.css';
import { createCard, updateLike } from './components/card.js';
import { openModal, closeModal, closeOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js'; 
import { getInfoMe, getInitialCards, updateProfile, addCardToServer, deleteCardToServer, addLikeButtonToServer, deleteLikeButtonToServer, changeAvatar } from './components/api.js';

const placesList = document.querySelector('.places__list');

// Открытие модальных окон
const buttonEdit = document.querySelector('.profile__edit-button');
const buttonAdd = document.querySelector('.profile__add-button');
const avatarProfile = document.querySelector('.profile__image');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_new-avatar');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

function openImage(item) {
  popupImage.src = item.link;
  popupImage.alt = item.name;
  popupCaption.textContent = item.name;

  openModal(popupTypeImage);
};

function saveByProfile() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
};

buttonEdit.addEventListener('click', () => { 
  openModal(popupEdit);
  saveByProfile();
  clearValidation(popupEdit, validationConfig) 
});

buttonAdd.addEventListener('click', () => { 
  openModal(popupNewCard);
  clearValidation(popupNewCard, validationConfig)  
});

avatarProfile.addEventListener('click', () => { 
  openModal(popupAvatar);
  clearValidation(popupAvatar, validationConfig) 
});

// Закрытие модальных окон на Х и оверлей
const popups = document.querySelectorAll('.popup');

popups.forEach(function(item) {
  const popupClose = item.querySelector('.popup__close');
  popupClose.addEventListener('click', () => { closeModal(item)});
  item.addEventListener('click', closeOverlay);
});

// Редактирование имени и информации о себе
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formProfile = document.forms['edit-profile'];
const nameInput = formProfile.elements.name;
const jobInput = formProfile.elements.description;

function renderLoading(isLouding, button) { // Функция для показа прелоудера
  if (isLouding) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = 'Сохранить';
  }
};

function performFormActions(evt, button) {
  evt.preventDefault();
  renderLoading(true, button);
  // Убрать возможность нажатия нескольких раз кнопку сохранения
  button.setAttribute('disabled', true);
  button.setAttribute('style', 'pointer-events: none');
}

function editProfile(evt) {
  const buttonPopup = evt.target.querySelector('.popup__button');
  performFormActions(evt, buttonPopup);
  updateProfile({
    name: nameInput.value,
    about: jobInput.value
  })
    .then(() => {
      profileName.textContent = nameInput.value;
      profileDescription.textContent = jobInput.value;
      closeModal(popupEdit);
      renderLoading(false, buttonPopup);
      buttonPopup.removeAttribute('disabled', true);
      buttonPopup.removeAttribute('style', 'pointer-events: none');
    })
    .catch((err) => {
      buttonPopup.textContent = err;
      setTimeout(() => renderLoading(false, buttonPopup), 1000);
      setTimeout(() => {
        buttonPopup.removeAttribute('disabled', true);
        buttonPopup.removeAttribute('style', 'pointer-events: none')
      }, 1000);
    })
};

formProfile.addEventListener('submit', editProfile);

//Изменение аватара пользователя
const formAvatar = document.forms['new-avatar'];
const linkAvatar = formAvatar.elements.link;

function editAvatar(evt) {
  const buttonPopup = evt.target.querySelector('.popup__button');
  performFormActions(evt, buttonPopup);
  changeAvatar({
    avatar: linkAvatar.value
  })
    .then(() => {
      avatarProfile.setAttribute('style', `background-image: url('${linkAvatar.value}')`)
      closeModal(popupAvatar);
      evt.target.reset();
      renderLoading(false, buttonPopup);
      buttonPopup.removeAttribute('disabled', true);
      buttonPopup.removeAttribute('style', 'pointer-events: none');
    })
    .catch((err) => {
      buttonPopup.textContent = err;
      setTimeout(() => renderLoading(false, buttonPopup), 1000);
      setTimeout(() => {
        buttonPopup.removeAttribute('disabled', true);
        buttonPopup.removeAttribute('style', 'pointer-events: none')
      }, 1000);
    })
};

formAvatar.addEventListener('submit', editAvatar);

// Добавление новых карточек
const formCard = document.forms['new-place'];
const nameCard = formCard.elements['place-name'];
const linkCard = formCard.elements.link;

function addCard(evt) {
  const buttonPopup = evt.target.querySelector('.popup__button');
  performFormActions(evt, buttonPopup);
  addCardToServer({
    name: nameCard.value,
    link: linkCard.value
  })
    .then((dataCard) => {
      placesList.prepend(createCard(userID, dataCard, deleteCard, openImage, likeButton));
      closeModal(popupNewCard);
      evt.target.reset();
      renderLoading(false, buttonPopup);
      buttonPopup.removeAttribute('disabled', true);
      buttonPopup.removeAttribute('style', 'pointer-events: none');
    })
    .catch((err) => {
      buttonPopup.textContent = err;
      setTimeout(() => renderLoading(false, buttonPopup), 1000);
      setTimeout(() => {
        buttonPopup.removeAttribute('disabled', true);
        buttonPopup.removeAttribute('style', 'pointer-events: none')
      }, 1000);
    })
};

formCard.addEventListener('submit', addCard);

// Удаление карточки
const popupDeleteCard = document.querySelector('.popup_type_delete-card')
const formDelete = document.forms['delete-card'];
const buttonYesDelete = popupDeleteCard.querySelector('.popup__button');
const popupError = document.querySelector('.popup_type_error');
const textPopupError = popupError.querySelector('.popup__title');
let idCardForDelete = null;
let cardForDelete = null;

const deleteCard = (cardID, cardElement) => { 
  openModal(popupDeleteCard);
  idCardForDelete = cardID;
  cardForDelete = cardElement;
};

formDelete.addEventListener('submit', () => { 
  deleteCardToServer(idCardForDelete) 
    .then(() => {
      cardForDelete.remove();
      closeModal(popupDeleteCard);
    })
    .catch((err) => {
      buttonYesDelete.textContent = err;
      setTimeout(() => {buttonYesDelete.textContent = 'Да'}, 1000);
    });
  })

// Лайк карточки
function likeButton(cardID, quantityLikes, evt) {
  const isLiked = evt.target.classList.contains('card__like-button_is-active');
  if(!isLiked) {
    addLikeButtonToServer(cardID)
      .then((dataCard) => {
        updateLike(quantityLikes, dataCard.likes.length, evt);
      })
      .catch((err) => {
        openModal(popupError);
        textPopupError.textContent = err;
        setTimeout(() => closeModal(popupError), 1500);
      })
  } else {
    deleteLikeButtonToServer(cardID)
      .then((dataCard) => {
        updateLike(quantityLikes, dataCard.likes.length, evt);
      })
      .catch((err) => {
        openModal(popupError);
        textPopupError.textContent = err;
        setTimeout(() => closeModal(popupError), 1500);
      })
  }
};
    
// Валидность форм
enableValidation(validationConfig);

// Загрузка данных с сервера
let userID = null;
const profileInfo = document.querySelector('.profile__info');

Promise.all([getInfoMe(), getInitialCards()])
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarProfile.setAttribute('style', `background-image: url('${userData.avatar}')`)
    userID = userData._id;
    cards.forEach((dataCard) => {
      placesList.append(createCard(userID, dataCard, deleteCard, openImage, likeButton));
    })
  })
  .catch((err) => {
    profileInfo.removeAttribute('class');
    profileName.textContent = err;
    buttonEdit.remove();
    buttonAdd.remove();
  })


