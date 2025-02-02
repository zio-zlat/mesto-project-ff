export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeEsc);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeEsc);
}

export function closeOverlay(evt) {
  if (evt.target.classList.contains('popup_is-opened')) {
    closeModal(evt.target);
  }
}

function closeEsc(evt) {
  if (evt.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'));
  }
}
 