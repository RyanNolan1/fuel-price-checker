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
    let results = data.Response.DataItems.FuelStationDetails.FuelStationList;

    let table = `
        <thead>
        <tr>
        <th>Price</th>
        <th>Company</th>
        <th>Distance</th>
        <th>Location</th>
        </tr>
         </thread>`;

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (x[j].FuelType === fuel) {
          table += `
    <tbody>
    <tr>
<td>${x[j].LatestRecordedPrice.InPence} </td>
<td>${results[i].Brand}</td>
<td>${results[i].DistanceFromSearchPostcode}</td>
<td>${results[i].Suburb ? results[i].Suburb : results[i].Town}</td>
</tr>
</tbody>`;
        }
        document.getElementById("fuel-table").innerHTML = table;
      }
    }
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
    let results = data.Response.DataItems.FuelStationDetails.FuelStationList;
    results.sort((a, b) => {
      return a.DistanceFromSearchPostcode - b.DistanceFromSearchPostcode;
    });

    let table = `
    <thead>
    <tr>
    <th>Price</th>
    <th>Company</th>
    <th>Distance</th>
    <th>Location</th>
    </tr>
     </thread>`;

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (x[j].FuelType === fuel) {
          table += `
    <tbody>
    <tr>
<td>${x[j].LatestRecordedPrice.InPence} </td>
<td>${results[i].Brand}</td>
<td>${results[i].DistanceFromSearchPostcode}</td>
<td>${results[i].Suburb ? results[i].Suburb : results[i].Town}</td>
</tr>
</tbody>`;
        }
        document.getElementById("fuel-table").innerHTML = table;
      }
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

    let table = `
    <thead>
    <tr>
    <th>Price</th>
    <th>Company</th>
    <th>Distance</th>
    <th>Location</th>
    </tr>
     </thread>`;

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
          });
        }
      }
    }

    priceArray.sort((a, b) => {
      return a.Price - b.Price;
    });

    for (let i = 0; i < priceArray.length; i++) {
      table += `
      <tbody>
      <tr>
      <td>${priceArray[i].Price} </td>
      <td>${priceArray[i].Company}</td>
      <td>${priceArray[i].Distance}</td>
      <td>${priceArray[i].Location}</td>
      </tr>
      </tbody>`;
    }
    document.getElementById("fuel-table").innerHTML = table;
  }
}
