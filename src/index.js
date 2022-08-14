import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './fetchPhotos';
import { galerryMarkup } from './renderMarkup';

const input = document.querySelector('input');
const searchForm = document.querySelector('.search-form');
const containerGallery = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');

searchForm.addEventListener('submit', inputValue);

let searchResult = '';
let page = { index: 1 };
let currentHits = 0; //текущее количество загруженных картинок
let result = '';

let lightbox = new SimpleLightbox('.gallery a', {
  overlay: true,
  overlayOpacity: 0.7,
  nav: true,
  close: true,
});

async function inputValue(evt) {
  evt.preventDefault();
  searchResult = input.value.trim();

  if (searchResult === '') {
    return;
    // если запрос это пустая строка не производит поиск
  }

  try {
    page.index = 1;
    result = await fetchPhotos(searchResult, page.index); //результат поиска
    let totalHits = result.data.totalHits; //количество найденных картинок
    currentHits = result.data.hits.length;

    totalHits > 40
      ? buttonLoad.classList.remove('is-hidden')
      : buttonLoad.classList.add('is-hidden');

    if (totalHits > 0) {
      // отрисовка картинок по запросу
      containerGallery.innerHTML = '';
      searchForm.reset();

      imageList(result.data.hits);
      console.log(result.data);
      Notify.success(`Hooray! We found ${totalHits} images.`);
      return;
    }

    if (totalHits === 0) {
      //ошибка если по поиску ничего нет
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
  } catch (error) {
    Notify.failure(error.message);
  }
}

buttonLoad.addEventListener('click', () => {
  loadingMore();
});

async function loadingMore() {
  page.index += 1;
  const result = await fetchPhotos(searchResult, page.index);
  imageList(result.data.hits);
  currentHits += currentHits;

  if (currentHits > result.data.totalHits) {
    buttonLoad.classList.add('is-hidden');
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function imageList(arr) {
  const markup = arr.map(item => galerryMarkup(item)).join('');
  containerGallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
