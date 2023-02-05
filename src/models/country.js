const mongoose = require('mongoose')


const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  iso2code: {
    type: String,
  },
});

const CountryModel = mongoose.model("Country", CountrySchema);

module.exports = CountryModel
