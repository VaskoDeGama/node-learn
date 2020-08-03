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
    const url = `mongodb+srv://vaskodegama:78562143@engcrm-rllxx.azure.mongodb.net/node-learn?retryWrites=true&w=majority`

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start().then((r) => r)
