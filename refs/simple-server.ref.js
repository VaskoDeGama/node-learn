const http = require('http')
const fs = require('fs')
const path = require('path')
const PORT = 3000

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' })
      fs.readFile(
        path.join(__dirname, 'views', 'index.hbs'),
        'utf-8',
        (err, data) => {
          if (err) throw err
          res.write(data)
          res.end()
        }
      )
    } else if (req.url === '/about') {
      res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' })
      fs.readFile(
        path.join(__dirname, 'views', 'about.hbs'),
        'utf-8',
        (err, data) => {
          if (err) throw err
          res.write(data)
          res.end()
        }
      )
    } else if (req.url === '/api/users') {
      res.writeHead(200, { 'Content-Type': 'text/json', charset: 'utf-8' })
      const users = [
        {
          name: 'Vaska',
          age: 25,
        },
        {
          name: 'Valisiy',
          age: 21,
        },
      ]
      res.write(JSON.stringify(users))
      res.end()
    }
  } else if (req.method === 'POST') {
    const body = []
    req.on('data', (data) => {
      body.push(Buffer.from(data))
    })
    req.on('end', () => {
      const title = body.toString().split('=')[1]
      res.end(`Title: ${title}`)
    })
  }
})

server.listen(PORT, () => {
  console.log('Server started on port:', PORT)
})
