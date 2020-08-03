const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
})

module.exports = model('User', userSchema)
