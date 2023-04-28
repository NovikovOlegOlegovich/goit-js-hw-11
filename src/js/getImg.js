import axios from 'axios';

export class ApiPixabay {
  constructor() {
    this.url = 'https://pixabay.com/api';
    this.key = '35785441-a207f2b150a26c5e7bb8ad037';
    this.page = 1;
    this.searchImg = '';
    this.totalHits = 0;
  }

  async fetchImg() {
    const url = `${this.url}/?key=${this.key}&q=${this.searchImg}&page=${this.page}`;
    const config = {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    };
    const { data } = await axios.get(url, config);
    this.totalHits = data.totalHits;
    return data.hits;
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

  get getNumeOfPage() {
    return this.page;
  }

  set setNumOfPage(numpage) {
    this.page = numpage;
  }

  get getTotalHits() {
    return this.totalHits;
  }

  set setTotalHits(totalhit) {
    this.totalHits = totalhit;
  }
}
