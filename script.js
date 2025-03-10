const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

async function getCountryData(country) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${country} data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

function domCountry(json) {
  console.log(json);
  const country = json[0];
  countryInfoSection.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
    <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
    <p>Population: ${country.population.toLocaleString()}</p>
    <p>Region: ${country.region}</p>
  `;
  if (country.borders.length === 0) {
    alert("the country has no bordering countries");
    return null;
  } else {
    return country.borders.join(',');
  }
}

async function getBorderData(border) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${border}`);
    if (!response.ok) {
      throw new Error(`Error fetching border information`);
    }
    return await response.json();
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

function domBorder(json) {
  console.log(json);
  borderingCountriesSection.innerHTML = `<h3>Bordering Countries:</h3>`;
  json.forEach(neighbor => {
    borderingCountriesSection.innerHTML += `
      <figure class="neighbor">
        <h4>${neighbor.name.common}</h4>
        <img src="${neighbor.flags.png}" alt="Flag of ${neighbor.name.common}" class="border-flag">
      </figure>
    `;
  });
}

document.getElementById('search-btn').addEventListener('click', async function () {

  const countryInput = document.getElementById('country-input').value.trim();
  if (!countryInput) {
    alert("Please enter a country name.");
    return;
  }

  countryInfoSection.innerHTML = '';
  borderingCountriesSection.innerHTML = '';

  try {
    const countryData = await getCountryData(countryInput);
    const borderCodes = domCountry(countryData);
    if (borderCodes) {
      const borderData = await getBorderData(borderCodes);
      domBorder(borderData);
    }
  } catch (error) {
    console.log("an error occured");
  }
});
