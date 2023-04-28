import { ApiPixabay } from './getImg';
import galleryItemTemplate from '../templates/gallery.hbs';
import { refs } from '../js/refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { formEl, galleryEl, loadMoreBtnEl } = refs;

const ApiPixabayEx = new ApiPixabay();

formEl.addEventListener('input', onInput);
formEl.addEventListener('submit', onSubmit);
loadMoreBtnEl.addEventListener('click', loadMoreImg);

const { searchQuery } = refs.formEl.elements;

function onInput(event) {
  ApiPixabayEx.serchLabel = searchQuery.value;
}

async function onSubmit(event) {
  event.preventDefault();

  if (ApiPixabayEx.serchLabel == '') {
    clearMurkup();
    removeLoadMoreBtn();
    Notiflix.Notify.failure('search field is empty');
    return;
  }

  clearMurkup();
  ApiPixabayEx.resetPage();
  const apiPixabayRespons = await ApiPixabayEx.fetchImg();
  console.log(apiPixabayRespons);
  createMurkup(apiPixabayRespons);

  const gallery = new SimpleLightbox('.photo-card a', {
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  if (ApiPixabayEx.totalHits) {
    Notiflix.Notify.success(
      ` Hooray! We found ${ApiPixabayEx.totalHits} images.`
    );
  }

  shoveLoadMoreBtn();
  checkForAvailability(apiPixabayRespons);
}

function createMurkup(arrayOfImfg) {
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    galleryItemTemplate(arrayOfImfg)
  );
}

function checkForAvailability(arrayOfImfg) {
  if (!arrayOfImfg.length) {
    removeLoadMoreBtn();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (Math.round(ApiPixabayEx.totalHits / 40) < ApiPixabayEx.page) {
    removeLoadMoreBtn();
    Notiflix.Notify.success(
      `We are sorry, but you haveve reached the end of search results. Total resalt is ${ApiPixabayEx.totalHits} images`
    );
    return;
  }
}

async function loadMoreImg() {
  ApiPixabayEx.incrementPage();
  try {
    const apiPixabayRespons = await ApiPixabayEx.fetchImg();
    createMurkup(apiPixabayRespons);
    checkForAvailability(apiPixabayRespons);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function shoveLoadMoreBtn() {
  loadMoreBtnEl.classList.remove('hidden');
}

function removeLoadMoreBtn() {
  loadMoreBtnEl.classList.add('hidden');
}

function clearMurkup() {
  refs.galleryEl.innerHTML = '';
}
