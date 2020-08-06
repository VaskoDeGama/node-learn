const { Router } = require('express')
//const Course = require('../models/Course_fs')
const isAuth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('userId', 'email name')
      .select('price title url')
      .lean()
    res.render('courses', {
      title: 'Courses',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', isAuth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', isAuth, async (req, res) => {
  try {
    const { id } = req.body
    delete req.body.id
    const course = await Course.findOne({ _id: id })
    if (!isOwner(course, req)) {
      res.redirect('/courses')
    }
    Object.assign(course, req.body)
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const course = await Course.findById(id).lean()
    res.render('course', {
      layout: 'empty',
      title: `Course: ${course.title}`,
      course,
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', isAuth, async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/')
    }
    let course = await Course.findById(req.params.id).lean()
    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }
    res.render('edit', {
      title: `Edit course: ${course.title}`,
      course,
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
