const { Router } = require('express')
const User = require('../models/User')
const isAuth = require('../middleware/auth')
const router = Router()

router.get('/', isAuth, (req, res) => {
  try {
    res.render('profile', {
      title: `Personal area`,
      isPA: true,
      user: req.user.toObject(),
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const toChange = {
      name: req.body.name,
    }
    console.log(req.file)
    if (req.file) {
      toChange.avatarUrl = req.file.path
    }

    Object.assign(user, toChange)
    await user.save()
    res.redirect('/profile')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
