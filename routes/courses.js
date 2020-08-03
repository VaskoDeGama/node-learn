const { Router } = require('express')
//const Course = require('../models/Course_fs')
const Course = require('../models/Course_mongo')

const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find()
    .populate('userId', 'email name')
    .select('price title url')
    .lean()
  res.render('courses', {
    title: 'Courses',
    isCourses: true,
    courses,
  })
})

router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', async (req, res) => {
  const { id } = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const course = await Course.findById(id).lean()
  res.render('course', {
    layout: 'empty',
    title: `Course: ${course.title}`,
    course,
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/')
    return
  }
  const course = await Course.findById(req.params.id).lean()
  res.render('edit', {
    title: `Edit course: ${course.title}`,
    course,
  })
})

module.exports = router
