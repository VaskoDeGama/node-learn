const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const homeRoute = require('./routes/home')
const coursesRoute = require('./routes/courses')
const addRoute = require('./routes/add')
const cartRoute = require('./routes/cart')
const ordersRoute = require('./routes/orders')
const User = require('./models/User')
const app = express()
const PORT = config.get('port') || process.env.PORT || 3000
const DB_URL = config.get('dbUrl')
const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    req.user = await User.findById('5f282009e4e23b5babd068b0')
    next()
  } catch (e) {
    console.log(e)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add', addRoute)
app.use('/cart', cartRoute)
app.use('/orders', ordersRoute)

async function start() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'test@mail.ru',
        name: 'Vaska',
        cart: { items: [] },
      })
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start().then((r) => r)
