const { Schema, model } = require('mongoose')
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
          type: Schema.Types.objectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
})

model.exports = model('User', userSchema)
