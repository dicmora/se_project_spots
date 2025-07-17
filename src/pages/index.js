import {
  enableValidation,
  settings,
  resetValidation,
  showInputError,
  hideInputError,
  hasInvalidInput,
  disableButton,
  enableButton,
  toggleButtonState,
  checkInputValidity,
  setEventListeners,
} from "../scripts/validation.js";
import "../blocks/card.css";
import "../blocks/cards.css";
import "../blocks/content.css";
import "../blocks/header.css";
import "../blocks/footer.css";
import "../blocks/modal.css";
import "../blocks/page.css";
import "../blocks/profile.css";
import "../pages/index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d926521e-7887-4ad2-af98-b574b5f86753",
    "Content-Type": "application/json",
  },
});

let currentUserId = null;
api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    currentUserId = userInfo._id;
    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
    if (userInfo.avatar) {
      avatarElement.src = userInfo.avatar;
    }
    cards.forEach((card) => renderCard(card, "append"));
  })

  .catch((err) => {
    console.log(err);
  });

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.modal_is-opened").forEach(closeModal);
  }
}

function setupModal(modal) {
  const closeBtn = modal.querySelector(
    ".modal__close-btn, .modal__Previewclose-btn"
  );
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal(modal));
  }

  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

document.querySelectorAll(".modal").forEach(setupModal);

// Edit Profile Form Elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescription = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileNameElement = document.querySelector(".profile__name");
const avatarElement = document.querySelector(".profile__avatar");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
// New Post Card Form Elements
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostFormElement = newPostModal.querySelector(".modal__form");
const newPostInput = newPostModal.querySelector("#card-caption-input");
const postLinkInput = newPostModal.querySelector("#card-image-input");
const newPostSubmitButton =
  newPostFormElement.querySelector(".modal__submit-btn");

//Avatar form Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalClosebtn = avatarModal.querySelector(".modal__close-btn");

//Delete form Elements
const deleteModelBtn = document.querySelector("#delete-modal");
const deleteForm = deleteModelBtn.querySelector(".modal__form");
const cancelDeleteBtn = document.querySelector("#cancel-delete-btn");

// Image Preview Modal Elements
const previewModal = document.querySelector("#preview-modal");
const previewImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");

// Card Template and List
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

function handleLike(cardId, likeBtn, api) {
  const isAddingLike = !likeBtn.classList.contains("card__like-btn_active");

  api
    .changeLike(cardId, isAddingLike)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeBtn.classList.add("card__like-btn_active");
      } else {
        likeBtn.classList.remove("card__like-btn_active");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-btn");

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  }

  likeBtn.addEventListener("click", () => {
    handleLike(data._id, likeBtn, api);
  });

  const deleteBtn = cardElement.querySelector(".card__del-btn");
  deleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  avatarModalBtn.addEventListener("click", () => {
    openModal(avatarModal);
  });

  cardImageElement.addEventListener("click", () => {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewModalCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModelBtn);
});

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModelBtn);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  setButtonText(deleteBtn, true, "Deleting...");
  api
    .removeCard(selectedCardId)
    .then((res) => {
      alert(res.message);
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModelBtn);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteBtn, false, "Deleting...");
    });
}
deleteForm.addEventListener("submit", handleDeleteSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function renderCard(cardData, method = "prepend") {
  const cardElement = getCardElement(cardData);
  cardList[method](cardElement);
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescription.value = profileDescriptionElement.textContent;

  resetValidation(
    profileFormElement,
    [editProfileNameInput, editProfileDescription],
    settings
  );

  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

profileFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescription.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();
  api
    .editAvatarInfo({ avatar: avatarUrl })
    .then((data) => {
      avatarElement.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
    });
}
newPostFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const newCard = {
    name: newPostInput.value,
    link: postLinkInput.value,
  };
  api
    .createCard(newCard)
    .then((createCard) => {
      renderCard(createCard);
      newPostFormElement.reset();
      disableButton(newPostSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch(console.error);
});

enableValidation(settings);
