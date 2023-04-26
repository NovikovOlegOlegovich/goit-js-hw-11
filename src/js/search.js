import { ApiPixabay } from './getImg';
import galleryItemTemplate from '../templates/gallery.hbs';
import Notiflix from 'notiflix';

const refs = {
  formEl: document.getElementById('search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

const ApiPixabayEx = new ApiPixabay();

refs.formEl.addEventListener('input', onInput);
refs.formEl.addEventListener('submit', onSubmit);
refs.loadMoreBtnEl.addEventListener('click', loadMoreImg);

const { searchQuery } = refs.formEl.elements;

function onInput(event) {
  ApiPixabayEx.serchLabel = searchQuery.value;
}

function onSubmit(event) {
  event.preventDefault();
  refs.galleryEl.innerHTML = '';
  ApiPixabayEx.resetPage();
  ApiPixabayEx.fetchImg().then(images => {
    createMurkup(images);
    checkForAvailability(images);
  });
}

function createMurkup(arrayOfImfg) {
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    galleryItemTemplate(arrayOfImfg)
  );
}

function checkForAvailability(arrayOfImfg) {
  if (!arrayOfImfg.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function loadMoreImg() {
  ApiPixabayEx.incrementPage();
  ApiPixabayEx.fetchImg().then(images => {
    createMurkup(images);
    checkForAvailability(images);
  });
}
