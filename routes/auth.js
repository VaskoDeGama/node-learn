const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
    lError: req.flash('lError'),
    rError: req.flash('rError'),
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAunteticated = true
        req.session.save((err) => {
          if (err) throw err
          res.redirect('/')
        })
      } else {
        req.flash('lError', 'User with this email and password not exists')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('lError', 'User with this email not exists')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body

    const candidate = await User.findOne({ email })
    if (candidate) {
      req.flash('rError', 'User with this email already exists')
      res.redirect('/auth/login#register')
    } else if (password === confirm) {
      const hashedPassword = await bcrypt.hash(password, 11)
      const user = new User({
        email,
        name,
        password: hashedPassword,
        cart: { items: [] },
      })
      await user.save()
      res.redirect('/auth/login#login')
    } else {
      req.flash('rError', 'Password and Confirm not same')
      res.redirect('/auth/login#register')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
