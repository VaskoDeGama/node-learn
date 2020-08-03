const { Schema, model, Types } = require('mongoose')
const courseSchema = new Schema({
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

courseSchema.method('toClient', function () {
  const course = this.toObject()
  course.id = course._id
  return course
})

module.exports = model('Course', courseSchema)
