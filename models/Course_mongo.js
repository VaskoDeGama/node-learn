const { Schema, model, Types } = require('mongoose')
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
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
})
module.exports = model('Course', course)
