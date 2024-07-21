const cohortID = `wff-cohort-18`;
const authorizationCode = '89de41b9-e6fb-4654-a6fb-9e2e81d88a46';
const config = {
  baseUrl: `https://nomoreparties.co/v1/${cohortID}`,
  headers: {
    authorization: authorizationCode,
    'Content-Type': 'application/json'
  }
}
function getResponse(res, error) {
  if (res.ok) {
    return res.json();
  }
    return Promise.reject(error);
}

export function getInfoMe() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(res => getResponse(res, 'Упсс, возникла ошибка. Попробуйте позже'))
};

export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(res => getResponse(res, 'Упсс, возникла ошибка. Попробуйте позже'))
};

export function updateProfile(data) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(data)
  })
    .then(res => getResponse(res, 'Не удается сохранить, попробуйте позже'))
};

export function addCardToServer(data) { 
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(data)
  })
    .then(res => getResponse(res, 'Не удается сохранить, попробуйте позже'))
};

export function changeAvatar(data) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(data)
  })
    .then(res => getResponse(res, 'Не удается сохранить, попробуйте позже'))
};

export function deleteCardToServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(res => getResponse(res, 'Не удается удалить карточку, попробуйте позже')) 
};

export function addLikeButtonToServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
    .then(res => getResponse(res, 'Пока недоступно, попробуйте позже'))
};

export function deleteLikeButtonToServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(res => getResponse(res, 'Пока недоступно, попробуйте позже'))
};