document.getElementById('search-btn').addEventListener('click', function () {
  const countryInput = document.getElementById('country-input').value.trim();
  if (!countryInput) {
    alert("Please enter a country name.");
    return;
  }

  const countryInfoSection = document.getElementById('country-info');
  const borderingCountriesSection = document.getElementById('bordering-countries');

  countryInfoSection.innerHTML = "";
  borderingCountriesSection.innerHTML = "";

  fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("The country not found");
      }
      return response.json();
    })
    .then(data => {
      const country = data[0];
      const capital = country.capital[0];
      const population = country.population.toLocaleString();
      const region = country.region;
      const flag = country.flags.png;  

      countryInfoSection.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${flag}" alt="Flag of ${country.name.common}" class="country-flag">
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Region: ${region}</p>
      `;

      if (country.borders && country.borders.length > 0) {
        const borderCodes = country.borders.join(',');
        fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`)
          .then(response => response.json())
          .then(neighbors => {
            borderingCountriesSection.innerHTML = `<h3>Bordering Countries:</h3>`; 
            neighbors.forEach(neighbor => {
              const neighborFlag = neighbor.flags.png;
              const neighborName = neighbor.name.common;
              borderingCountriesSection.innerHTML += `
                <figure class="neighbor">
                  <h4>${neighborName}</h4>
                  <img src="${neighborFlag}" alt="Flag of ${neighborName}" class="border-flag">
                </figure>
              `;
            });
          })
          .catch(err => {
            borderingCountriesSection.innerHTML = `<p>Error loading bordering countries: ${err.message}</p>`;
          });
      } else {
        borderingCountriesSection.innerHTML = `<p>No bordering countries found.</p>`;
      }
    })
    .catch(error => {
      countryInfoSection.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
