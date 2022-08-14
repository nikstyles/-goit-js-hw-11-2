import axios from 'axios';

export async function fetchPhotos(nameImage, page) {
  const BASE_URL = 'https://pixabay.com/api';
  const API_KEY = '29165811-427dfac32fdd04976ea5245cc';
  const options = new URLSearchParams({
    key: API_KEY,
    q: nameImage,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  return await axios.get(`${BASE_URL}/?${options}`);
}
