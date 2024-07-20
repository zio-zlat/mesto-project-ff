import './pages/index.css';
import { createCard, deleteCard, likeButton } from './components/card.js';
import { openModal, closeModal, closeOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js'; 
import { getInfoMe, getInitialCards, updateProfile, addCardToServer, changeAvatar } from './components/api.js';

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

let timerFinallyClose = setTimeout(() => { closeModal }, 1500);

function performPopupActions(popup) {
  const button = popup.querySelector('.popup__button');
  clearTimeout(timerFinallyClose);
  openModal(popup);
  button.textContent = 'Сохранить'
  button.removeAttribute('disabled', true);
  button.removeAttribute('style', 'pointer-events: none');
  saveByProfile();
  clearValidation(popup, validationConfig);
};

buttonEdit.addEventListener('click', () => { performPopupActions(popupEdit) });
buttonAdd.addEventListener('click', () => { performPopupActions(popupNewCard) });
avatarProfile.addEventListener('click', () => { performPopupActions(popupAvatar) });

// Закрытие модальных окон на Х и оверлей
const popups = document.querySelectorAll('.popup');

popups.forEach(function (item) {
  const popupClose = item.querySelector('.popup__close');
  item.classList.add('popup_is-animated');
  popupClose.addEventListener('click', () => { closeModal(item)});
  item.addEventListener('click', closeOverlay);
});

// Редактирование имени и информации о себе
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formProfile = document.forms['edit-profile'];
const nameInput = formProfile.elements.name;
const jobInput = formProfile.elements.description;

function closeFormByTimer(popup) {
  timerFinallyClose = setTimeout(() => { closeModal(popup) }, 1500);
};

function renderLoading(isLouding, button, popup) { // Функция для показа прелоудера
  if (isLouding) {
    button.textContent = 'Сохранение...';
  } else {
    closeFormByTimer(popup);
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
    })
    .catch((err) => {
      buttonPopup.textContent = err;
    })
    .finally(() => {
      renderLoading(false, undefined, popupEdit);
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
    })
    .catch((err) => {
      buttonPopup.textContent = err;
    })
    .finally(() => {
      renderLoading(false, undefined, popupAvatar);
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
      placesList.prepend(createCard(userID, dataCard, deleteCard, openImage, likeButton, openModal, closeModal));
      closeModal(popupNewCard);
      evt.target.reset();
    })
    .catch((err) => {
      buttonPopup.textContent = err;
    })
    .finally(() => {
      renderLoading(false, undefined, popupNewCard);
    })
};

formCard.addEventListener('submit', addCard);

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
      placesList.append(createCard(userID, dataCard, deleteCard, openImage, likeButton, openModal, closeModal));
    })
  })
  .catch((err) => {
    profileInfo.removeAttribute('class');
    profileName.textContent = err;
    buttonEdit.remove();
    buttonAdd.remove();
  })


