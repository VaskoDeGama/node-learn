const { Router } = require('express')
const config = require('config')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const registrationMail = require('../emails/registration')
const resetMail = require('../emails/reset')

const DOMAIN = config.get('domain')
const API_KEY = config.get('mailgun')

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      domain: DOMAIN,
      api_key: API_KEY,
    },
  })
)

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
      await transporter.sendMail(registrationMail(email), (err, info) => {
        if (err) throw err
        console.log(`Mail send to: ${email}, ${info.message}`)
      })
    } else {
      req.flash('rError', 'Password and Confirm not same')
      res.redirect('/auth/login#register')
    }
  } catch (e) {
    console.log(e)
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Reset password',
    error: req.flash('error'),
  })
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buf) => {
      if (err) {
        req.flash('error', 'Something is wrong, try again')
        res.redirect('/auth/reset')
      }
      const token = buf.toString('hex')
      const candidate = await User.findOne({ email: req.body.email })

      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await candidate.save()
        await transporter.sendMail(
          resetMail(candidate.email, token),
          (err, info) => {
            if (err) throw err
            console.log(`Mail send to: ${candidate.email}, ${info.message}`)
            res.redirect('/auth/login')
          }
        )
      } else {
        req.flash('error', 'There is no user with such email')
        res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/password/:token', async (req, res) => {
  try {
    if (!req.params.token) {
      return res.redirect('/auth/login')
    }
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'Reset password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token,
      })
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/password', async (req, res) => {
  try {
    const { password, confirm, userId, token } = req.body
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (user) {
      if (password === confirm) {
        user.password = await bcrypt.hash(password, 10)
        user.resetToken = undefined
        user.resetTokenExp = undefined
        await user.save()
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Password != confirm')
        res.redirect(`/auth/password/${token}`)
      }
    } else {
      req.flash('error', 'Token expired')
      res.redirect('/auth/login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
