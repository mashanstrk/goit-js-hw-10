import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  let inputCountry = evt.target.value.trim();

  if (inputCountry) {
    return fetchCountries(inputCountry)
      .then(data => {
        chooseMarkup(data);
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  } else {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    countryList.style.listStyle = 'none';
    countryList.style.margin = '5px';
    countryList.style.padding = '5px';
  }
}

function chooseMarkup(countryArray) {
  if (countryArray.length === 1) {
    countryList.innerHTML = '';
    return markupCountry(countryArray);
  }
  if (countryArray.length >= 2 && countryArray.length <= 10) {
    countryInfo.innerHTML = '';
    return markupCountryItem(countryArray);
  }

  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountryItem(data) {
  const markup = data
    .map(el => {
      return `<li class="country-item">
            <img src="${el.flags.svg}" alt="${el.name.official}" width="50" height="30" /> 
            <p>${el.name.official}</p>
            </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function markupCountry(data) {
  const markup = data
    .map(el => {
      return `<h1><img src="${el.flags.svg}" alt="${
        el.name.official
      }" width="50" height="30" />
        ${el.name.official}
      </h1>
      <ul class="country-info_list">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${el.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${el.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(el.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}