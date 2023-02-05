const CountryModel = require('../models/country')
const routes = require('express').Router();

routes.get("/", async (req, res) => {
  try {
    const countries = await CountryModel.find().exec();
    return res.json(countries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.post("/", async (req, res) => {
  try {
    const country = req.body;

    const countryExists = await CountryModel.findOne({
      name: country.name,
    }).exec();

    if (countryExists) {
      return res
        .status(409)
        .json({ error: "There is already another country with this name" });
    }

    const newCountry = await CountryModel.create(country);
    return res.status(201).json(newCountry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

module.exports = routes
