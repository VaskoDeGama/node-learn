const { Router } = require('express')
const isAuth = require('../middleware/auth')
const Course = require('../models/Course')
const { validationResult } = require('express-validator')
const { addCourseValidators } = require('../utils/validators')

const router = Router()

router.get('/', isAuth, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true,
    error: req.flash('error'),
  })
})

router.post('/', isAuth, addCourseValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg)
    return res.status(422).render('add', {
      title: 'Add course',
      isAdd: true,
      error: req.flash('error'),
      data: {
        title: req.body.title,
        price: req.body.price,
        url: req.body.url,
      },
    })
  }
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    url: req.body.url,
    userId: req.user,
  })
  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
