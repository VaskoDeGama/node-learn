const { Router } = require('express')
const Course = require('../models/Course')
const Card = require('../models/Card')

const router = Router()

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id)
  await Card.add(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    isCard: true,
    title: 'Card',
    courses: card.courses,
    price: card.price,
  })
})

module.exports = router
