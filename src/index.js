import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { input, list, countryInfo } = refs;

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const searchCountry = e.target.value.trim();
  list.innerHTML = '';
  countryInfo.innerHTML = '';

  if (searchCountry !== '') {
    fetchCountries(searchCountry)
      .then(response => {
        if (response.length === 1) {
          countryInfo.innerHTML = '';
          countryInfo.insertAdjacentHTML(
            'beforeend',
            renderCountryCards(response)
          );
        } else if (response.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          list.innerHTML = '';
          list.insertAdjacentHTML('beforeend', renderCountryList(response));
        }
      })
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountryList(evt) {
  return evt
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item">
    <img class="country-list__img" src="${flags.svg}" alt="flag of ${name}" width="25" height="25">
    <p class="country-list__name">${name.official}</p>
    </li>`
    )
    .join('');
}

function renderCountryCards(evt) {
  return evt
    .map(
      ({ name, capital, population, flags, languages }) => `
    <div class="country-info__wrap">
        <img class="country-info__img" src="${
          flags.svg
        }" alt="flag of ${name}" width="70" height="50">
        <h2 class="country-info__title">${name.official}</h2>
    </div>
    <ul class="country-info__list">
        <li class="country-info__item">Capital:
            <span class="country-info__item-text">${capital}</span>
        </li>
        <li class="country-info__item">Population:
            <span class="country-info__item-text">${population}</span>
        </li>
        <li class="country-info__item">Languages:
            <span class="country-info__item-text">${Object.values(
              languages
            )}</span>
        </li>
    </ul>
`
    )
    .join('');
}
