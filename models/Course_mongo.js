const { Schema, model } = require('mongoose')
const course = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  url: String,
})
module.exports = model('Course', course)