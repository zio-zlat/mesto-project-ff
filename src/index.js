import './pages/index.css';
import { initialCards } from './components/cards';
import { createCard, deleteCard, likeButton} from './components/card';
import { openModal, closeModal, closeOverlay } from './components/modal';


// Добавление 6 карточек по умолчанию
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

initialCards.forEach(function (item) {
  const card = createCard(item, cardTemplate, deleteCard, openImage, likeButton);
  placesList.append(card);
});


// Открытие модальных окон
const buttonEdit = document.querySelector('.profile__edit-button');
const buttonAdd = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

function openImage (item) {
  popupImage.src = item.link;
  popupImage.alt = item.name;
  popupCaption.textContent = item.name;

  openModal(popupTypeImage);
}

buttonEdit.addEventListener('click', function () {
  openModal(popupEdit);
  saveByProfile();
});

buttonAdd.addEventListener('click', function () {
  openModal(popupNewCard);
});

// Закрытие модальных окон на Х и оверлей
const popup = document.querySelectorAll('.popup');

popup.forEach(function (item) {
  const popupClose = item.querySelector('.popup__close');
  item.classList.add('popup_is-animated');
  
  popupClose.addEventListener('click', () => { closeModal (item)});
  item.addEventListener('click', closeOverlay);
});

// Редактирование имени и информации о себе
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formProfile = document.forms['edit-profile'];
const nameInput = formProfile.elements.name;
const jobInput = formProfile.elements.description;
const formButton = formProfile.querySelector('.popup__button');

function saveByProfile () {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
}

function editProfile (evt) {
  evt.preventDefault();

  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  formButton.addEventListener('click', closeModal (popupEdit));
}

formProfile.addEventListener('submit', editProfile);

// Добавление новых карточек
const formCard = document.forms['new-place'];
const nameCard = formCard.elements['place-name'];
const linkCard = formCard.elements.link;

function addCard(evt) {
  evt.preventDefault();
  
  const item = {
    name: nameCard.value,
    link: linkCard.value
  };
  const newCard = createCard(item, cardTemplate, deleteCard, openImage, likeButton);
  
  placesList.prepend(newCard);
  formButton.addEventListener('click', closeModal (popupNewCard));
  evt.target.reset();
}

formCard.addEventListener('submit', addCard);

