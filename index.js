const axios = require("axios");

axios
  .get(
    "https://uk1.ukvehicledata.co.uk/api/datapackage/FuelPriceData?v=2&api_nullitems=1&auth_apikey=POSTCODE=BS12AN"
  )
  .then(function (response) {
    // handle success
    console.log(response.data.Response.DataItems.FuelStationDetails);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
