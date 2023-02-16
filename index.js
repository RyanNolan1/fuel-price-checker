import { api_key } from "./key.js";

document
  .getElementById("submit-postcode")
  .addEventListener("click", getPostCode);

document
  .getElementById("sort-by-distance")
  .addEventListener("click", sortByDistance);

document.getElementById("sort-by-price").addEventListener("click", sortByPrice);

export function getPostCode() {
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
      table += `
    <tbody>
    <tr>
<td>${results[i].FuelPriceList[1].LatestRecordedPrice.InPence} </td>
<td>${results[i].Brand}</td>
<td>${results[i].DistanceFromSearchPostcode}</td>
<td>${results[i].Suburb ? results[i].Suburb : results[i].Town}</td>
</tr>
</tbody>`;
    }
    document.getElementById("fuel-table").innerHTML = table;
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
      table += `
    <tbody>
    <tr>
<td>${results[i].FuelPriceList[1].LatestRecordedPrice.InPence} </td>
<td>${results[i].Brand}</td>
<td>${results[i].DistanceFromSearchPostcode}</td>
<td>${results[i].Suburb ? results[i].Suburb : results[i].Town}</td>
</tr>
</tbody>`;
    }
    document.getElementById("fuel-table").innerHTML = table;
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

    for (let i = 0; i < results.length; i++) {
      const x = results[i].FuelPriceList;

      for (let j = 0; j < x.length; j++) {
        if (x[j].FuelType === "Unleaded") {
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
