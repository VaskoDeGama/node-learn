const { body } = require('express-validator')
const User = require('../models/User')

exports.registerValidators = [
  body('email', 'Incorrect Email entered')
    .isEmail()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('User with this email already exists')
        }
        return true
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('name', 'Name must be more than 3 characters').isLength({ min: 3 }),
  body(
    'password',
    'Password must be more than 6 and less than 56 characters and consist only of symbols and numbers'
  )
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password and confirm must be equals')
      }
      return true
    })
    .trim(),
]
exports.addCourseValidators = [
  body('title', 'Title must be more than 6 characters').isLength({ min: 6 }),
  body('price', 'Price must be numeric').isNumeric(),
  body('url', 'Please enter a valid url').isURL(),
]
