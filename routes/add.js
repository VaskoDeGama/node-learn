const { Router } = require('express')
//const Course = require('../models/Course_fs')
const isAuth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

router.get('/', isAuth, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true,
  })
})

router.post('/', isAuth, async (req, res) => {
  //const course = new Course(req.body.title, req.body.price, req.body.url)
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
