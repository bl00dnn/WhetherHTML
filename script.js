const API_KEY = '04616a4a1419a6877bca19cb29407a57';
const cardsContainer = document.getElementById('cards-container');

// Маппинг типов погоды на классы
const weatherTypes = {
  Clear: 'clear',
  Clouds: 'clouds',
  Rain: 'rain',
  Snow: 'snow',
  Thunderstorm: 'thunderstorm',
  Drizzle: 'drizzle',
  Mist: 'mist',
  Fog: 'mist',
  Haze: 'mist',
  Smoke: 'mist',
  Dust: 'mist',
  Sand: 'mist',
  Ash: 'mist',
  Squall: 'mist',
  Tornado: 'mist',
};

// Создание карточки
function createCard(data) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // Определяем тип погоды и добавляем соответствующий класс
  const weatherType = weatherTypes[data.main] || 'clear';
  card.classList.add(weatherType);

  card.innerHTML = `
    <h2>${data.city}, ${data.country}</h2>
    <img src="${data.icon}" alt="${data.description}">
    <p><strong>Температура:</strong> ${data.temp}°C</p>
    <p><strong>Состояние:</strong> ${data.description}</p>
    <p><strong>Влажность:</strong> ${data.humidity}%</p>
    <p><strong>Скорость ветра:</strong> ${data.wind} м/с</p>
    <button onclick="deleteCard(${data.id})">Удалить</button>
  `;
  card.dataset.id = data.id;
  cardsContainer.appendChild(card);
}

// Удаление карточки
function deleteCard(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    cardsContainer.removeChild(card);
    removeFromLocalStorage(id);
  }
}

// Получение данных о погоде
async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Не удалось получить данные о погоде');
  }

  const data = await response.json();
  return {
    id: Date.now(),
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    description: data.weather[0].description,
    main: data.weather[0].main, // Тип погоды
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    humidity: data.main.humidity,
    wind: data.wind.speed,
  };
}

// Сохранение и загрузка карточек из Local Storage
function saveToLocalStorage(data) {
  const cards = JSON.parse(localStorage.getItem('weatherCards')) || [];
  cards.push(data);
  localStorage.setItem('weatherCards', JSON.stringify(cards));
}

function loadFromLocalStorage() {
  const cards = JSON.parse(localStorage.getItem('weatherCards')) || [];
  cards.forEach((card) => createCard(card));
}

function removeFromLocalStorage(id) {
  const cards = JSON.parse(localStorage.getItem('weatherCards')) || [];
  const updatedCards = cards.filter((card) => card.id !== id);
  localStorage.setItem('weatherCards', JSON.stringify(updatedCards));
}

// Инициализация
document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  try {
    const data = await fetchWeather(city);
    createCard(data);
    saveToLocalStorage(data);
    document.getElementById('city-input').value = '';
  } catch (err) {
    alert('Не удалось найти город. Пожалуйста, проверьте ввод.');
  }
});

window.onload = loadFromLocalStorage;