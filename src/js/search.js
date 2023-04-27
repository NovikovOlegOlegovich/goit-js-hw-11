import { ApiPixabay } from './getImg';
import galleryItemTemplate from '../templates/gallery.hbs';
import { refs } from '../js/refs';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const { formEl, galleryEl, loadMoreBtnEl } = refs;

const ApiPixabayEx = new ApiPixabay();
debounce;
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
    return;
  }
  if (!loadMoreBtnEl.classList.contains('hidden')) {
    removeLoadMoreBtn();
  }
  refs.galleryEl.innerHTML = '';
  ApiPixabayEx.resetPage();
  const apiPixabayRespons = await ApiPixabayEx.fetchImg();
  createMurkup(apiPixabayRespons);

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
  if (ApiPixabayEx.totalHits < ApiPixabayEx.page * 40) {
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
