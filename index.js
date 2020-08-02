const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const homeRoute = require('./routes/home')
const coursesRoute = require('./routes/courses')
const addRoute = require('./routes/add')
const cardRoute = require('./routes/card')
const app = express()

const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add', addRoute)
app.use('/card', cardRoute)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const password = 'UueHRu99vwLvsm2N'
    const db = 'node-learn'
    const url = `mongodb+srv://vaskadagama:${password}@nodelearn.yfj6z.mongodb.net/${db}`
    mongoose.set('useFindAndModify', false)

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
