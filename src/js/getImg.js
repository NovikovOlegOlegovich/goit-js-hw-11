import axios from 'axios';

export class ApiPixabay {
  constructor() {
    this.url = 'https://pixabay.com/api';
    this.key = '35785441-a207f2b150a26c5e7bb8ad037';
    this.page = 1;
    this.searchImg = '';
  }

  fetchImg() {
    const options = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    };
    return fetch(
      `${this.url}/?key=${this.key}&q=${this.searchImg}&page=${this.page}`,
      options
    )
      .then(response => response.json())
      .then(data => data.hits);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get serchLabel() {
    return this.searchImg;
  }

  set serchLabel(label) {
    this.searchImg = label;
  }
}
