const API_KEY = 'KDtbvsqSlPFiEDO3QyZR';

const searchInput = document.querySelector('.search');
const race = document.querySelectorAll('[type=checkbox]');

const store = {
  initial: [],
  searchResult: [],
  checkboxResult: [],
  searchValue: '',
};

const responseData = async () => {
  try {
    const response = await fetch(`https://the-one-api.dev/v2/character?limit=20`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    createCard(data.docs);
    store.initial = data.docs;
    store.checkboxResult = data.docs;
    store.searchResult = data.docs;
  } catch (err) {
    console.error(err);
  }
};
responseData();

const createCard = (data = []) => {
  const container = document.querySelector('.movie_container');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  data.forEach(({ name, race }) => {
    const card = document.createElement('div');
    card.classList.add('card_body');
    card.innerHTML = `
      <ul>
        <li>Name: ${name}</li>
        <li>Race: ${race}</li>
      </ul> 
    `;

    container.append(card);
  });
};

const reset = () => {
  searchInput.value = '';
  store.searchValue = '';
  responseData();
  race.forEach((checkbox) => {
    if (checkbox.checked) {
      checkbox.checked = false;
    }
  });
};

document.querySelector('.button').addEventListener('click', reset);

const search = (searchValue) => {
  let filteredCards;
  if (searchValue.length === 0) {
    createCard(store.checkboxResult);
    store.searchResult = store.initial;
  } else {
    filteredCards = store.checkboxResult.filter((el) => {
      return (
        el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.race.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    createCard(filteredCards);
    store.searchResult = filteredCards;
  }
  filter();
};

searchInput.addEventListener('input', (event) => {
  store.searchValue = event.target.value;
  search(store.searchValue);
});

const filterByCheckbox = (first, second) => {
  let filteredCards;
  if (first.checked && !second.checked) {
    filteredCards = store.searchResult.filter((el) => el.race.toLowerCase() === first.name);
    createCard(filteredCards);
    store.checkboxResult = filteredCards;
  } else if (!first.checked && second.checked) {
    filteredCards = store.searchResult.filter((el) => el.race.toLowerCase() === second.name);
    createCard(filteredCards);
    store.checkboxResult = filteredCards;
  } else if (!first.checked && !second.checked) {
    createCard(store.searchResult);
    store.checkboxResult = store.initial;
    search(store.searchValue);
  } else {
    createCard(store.searchResult);
    store.checkboxResult = store.initial;
  }
};

race[0].addEventListener('click', () => {
  filterByCheckbox(race[0], race[1]);
});

race[1].addEventListener('click', () => {
  filterByCheckbox(race[1], race[0]);
});

const filter = () => {
  if (race[0].checked || race[1].checked) {
    filterByCheckbox(race[0], race[1]);
    filterByCheckbox(race[1], race[0]);
  }
};
