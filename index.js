import { api_key } from "./key.js";


document.getElementById("unleaded").addEventListener("click", sortByFuel);
document
  .getElementById("unleaded")
  .addEventListener("click", changeFuelUnleaded);

document.getElementById("super-unleaded").addEventListener("click", sortByFuel);
document
  .getElementById("super-unleaded")
  .addEventListener("click", changeFuelSuperUnleaded);

document.getElementById("diesel").addEventListener("click", sortByFuel);
document.getElementById("diesel").addEventListener("click", changeFuelDiesel);

document.getElementById("premium-diesel").addEventListener("click", sortByFuel);
document
  .getElementById("premium-diesel")
  .addEventListener("click", sortByPremiumDiesel);

document
  .getElementById("sort-by-distance")
  .addEventListener("click", sortByDistance);

document.getElementById("sort-by-price").addEventListener("click", sortByPrice);

let fuel = "";

function changeFuelUnleaded() {
  fuel = "Unleaded";
  return fuel;
}

function changeFuelSuperUnleaded() {
  fuel = "Super Unleaded";
  return fuel;
}

function changeFuelDiesel() {
  fuel = "Diesel";
  return fuel;
}

function sortByPremiumDiesel() {
  fuel = "Premium Diesel";
  return fuel;
}

const logos = [
  {name: 'TOTAL ENERGIES', logo:'./images/total-energies.png' },
  {name: 'SAINSBURYS', logo:'./images/sainsburys.png' },
  {name: 'ASDA', logo:'./images/ASDA.png' },
  {name: 'TEXACO', logo:'./images/texaco.png' },
  {name: 'SHELL', logo:'./images/shell.png' },
  {name: 'BP', logo:'./images/bp.png' },
  {name: 'MORRISONS', logo:'./images/morrisons.png' },
  {name: 'TESCO EXTRA', logo:'./images/tesco.png' }
]

function logoFinder(company) {
for (let i = 0; i < logos.length; i++) {
  if (logos[i].name === company) {
    return logos[i].logo
  }
}
}

export function sortByFuel() {
  const postCode = document.getElementById("post-code-input").value;

  return fetch(
    `https://uk1.ukvehicledata.co.uk/api/datapackage/FuelPriceData?v=2&api_nullitems=1&auth_apikey=${api_key}&key_POSTCODE=${postCode}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      displayStations(data);
    })
    .catch((error) => console.error("FETCH ERROR:", error));

  function displayStations(data) {
    let station = "";
    let results = data.Response.DataItems.FuelStationDetails.FuelStationList;

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (x[j].FuelType === fuel) {
          station += `
    <section id="station">
    <li class="station-list">
    <section id="station-container">
    <img id="station-logo" src="${logoFinder(results[i].Brand)}"></img>
    <p id="station-town">${
      results[i].Suburb ? results[i].Suburb : results[i].Town
    }</p>
    </section>
    <section id="station-details">
    <section id="station-address">
    <h2>${results[i].Name}<h2>
    <h2>${results[i].Street} </h2>
    <h2>${results[i].Postcode} </h2>
    </section>
    <p id="miles-from">${
      results[i].DistanceFromSearchPostcode
    } Miles from ${postCode.toUpperCase()} </p>
    </section>
    <section id="fuel-price-container">
    <p id="fuel-price">${x[j].LatestRecordedPrice.InPence}p</p>
    </section>
    </li>
    `;
        }
      }
    }
    document.getElementById("station-results").innerHTML = station;
  }
}

export function sortByDistance() {
  const postCode = document.getElementById("post-code-input").value;
  return fetch(
    `https://uk1.ukvehicledata.co.uk/api/datapackage/FuelPriceData?v=2&api_nullitems=1&auth_apikey=${api_key}&key_POSTCODE=${postCode}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      orderByDistance(data);
    })
    .catch((error) => console.error("FETCH ERROR:", error));

  function orderByDistance(data) {
    let station = "";
    let results = data.Response.DataItems.FuelStationDetails.FuelStationList;
    results.sort((a, b) => {
      return a.DistanceFromSearchPostcode - b.DistanceFromSearchPostcode;
    });

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (x[j].FuelType === fuel) {
          station += `
<section id="station">
<li class="station-list">
<section id="station-container">
    <img id="station-logo" src="${logoFinder(results[i].Brand)}"></img>
<p id="station-town">${
            results[i].Suburb ? results[i].Suburb : results[i].Town
          }</p>
</section>
<section id="station-details">
<section id="station-address">
<h2>${results[i].Name}<h2>
<h2>${results[i].Street} </h2>
<h2>${results[i].Postcode} </h2>
</section>
<p id="miles-from">${
            results[i].DistanceFromSearchPostcode
          } Miles from ${postCode.toUpperCase()} </p>
</section>
<section id="fuel-price-container">
<p id="fuel-price">${x[j].LatestRecordedPrice.InPence}p</p>
</section>
</li>
`;
        }
      }
      document.getElementById("station-results").innerHTML = station;
    }
  }
}

export function sortByPrice() {
  const postCode = document.getElementById("post-code-input").value;

  return fetch(
    `https://uk1.ukvehicledata.co.uk/api/datapackage/FuelPriceData?v=2&api_nullitems=1&auth_apikey=${api_key}&key_POSTCODE=${postCode}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      orderByPrice(data);
    })
    .catch((error) => console.error("FETCH ERROR:", error));

  function orderByPrice(data) {
    let results = data.Response.DataItems.FuelStationDetails.FuelStationList;
    let station = "";
    let fuelPrice = 0;
    let priceArray = [];

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (
          x[j].FuelType === fuel &&
          x[j].LatestRecordedPrice.InPence > fuelPrice
        ) {
          priceArray.push({
            Price: x[j].LatestRecordedPrice.InPence,
            Company: results[i].Brand,
            Distance: results[i].DistanceFromSearchPostcode,
            Location: results[i].Suburb ? results[i].Suburb : results[i].Town,
            Name: results[i].Name,
            Street: results[i].Street,
            Postcode: results[i].Postcode,
          });
        } else if (
          x[j].FuelType === fuel &&
          x[j].LatestRecordedPrice.InPence < fuelPrice
        ) {
          priceArray.unshift({
            Price: x[j].LatestRecordedPrice.InPence,
            Company: results[i].Brand,
            Distance: results[i].DistanceFromSearchPostcode,
            Location: results[i].Suburb ? results[i].Suburb : results[i].Town,
            Name: results[i].Name,
            Street: results[i].Street,
            Postcode: results[i].Postcode,
          });
        }
      }
    }

    priceArray.sort((a, b) => {
      return a.Price - b.Price;
    });

    for (let i = 0; i < priceArray.length; i++) {
      station += `
      <section id="station">
      <li class="station-list">
      <section id="station-container">
      <img id="station-logo" src="${logoFinder(priceArray[i].Company)}"></img>
      <p id="station-town">${priceArray[i].Location}</p>
      </section>
      <section id="station-details">
      <section id="station-address">
      <h2>${priceArray[i].Name}<h2>
      <h2>${priceArray[i].Street} </h2>
      <h2>${priceArray[i].Postcode} </h2>
      </section>
      <p id="miles-from">${
        priceArray[i].Distance
      } Miles from ${postCode.toUpperCase()} </p>
      </section>
      <section id="fuel-price-container">
      <p id="fuel-price">${priceArray[i].Price}p</p>
      </section>
      </li>
      `;
    }
    document.getElementById("station-results").innerHTML = station;
  }
}
