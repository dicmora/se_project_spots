const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

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

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescription = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostFormElement = newPostModal.querySelector(".modal__form");
const newPostInput = newPostModal.querySelector("#card-caption-input");
const postLinkInput = newPostModal.querySelector("#card-image-input");
const newPostSubmitButton =
  newPostFormElement.querySelector(".modal__submit-btn");

const previewModal = document.querySelector("#preview-modal");
const previewImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardTitleElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const likeBtn = cardElement.querySelector(".card__like-btn");
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("card__like-btn_active");
  });

  const deleteBtn = cardElement.querySelector(".card__del-btn");
  deleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewModalCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

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

profileFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  profileNameElement.textContent = editProfileNameInput.value;
  profileDescriptionElement.textContent = editProfileDescription.value;
  closeModal(editProfileModal);
});

newPostFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  renderCard({
    name: newPostInput.value,
    link: postLinkInput.value,
  });
  newPostFormElement.reset();
  disableButton(newPostSubmitButton, settings);
  closeModal(newPostModal);
});

initialCards.forEach((card) => renderCard(card, "append"));
