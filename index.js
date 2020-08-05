const express = require('express')
const session = require('express-session')
const config = require('config')
const csrf = require('csurf')
const flash = require('connect-flash')
const path = require('path')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongodb-session')(session)
const handlebars = require('express-handlebars')
const homeRoute = require('./routes/home')
const coursesRoute = require('./routes/courses')
const addRoute = require('./routes/add')
const cartRoute = require('./routes/cart')
const ordersRoute = require('./routes/orders')
const authRoute = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express()

const PORT = config.get('port') || process.env.PORT || 3000
const DB_URL = config.get('dbUrl')
const SECRET = config.get('secret')

const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

const store = new MongoStore({
  collection: 'sessions',
  uri: DB_URL,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//   try {
//     req.user = await User.findById('5f282009e4e23b5babd068b0')
//     next()
//   } catch (e) {
//     console. log(e)
//   }
// })

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
)

app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add', addRoute)
app.use('/cart', cartRoute)
app.use('/orders', ordersRoute)
app.use('/auth', authRoute)

async function start() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    // const candidate = await User.findOne()
    // if (!candidate) {
    //   const user = new User({
    //     email: 'test@mail.ru',
    //     name: 'Vaska',
    //     cart: { items: [] },
    //   })
    //   await user.save()
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start().then((r) => r)
