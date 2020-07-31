const http = require('http')
const fs = require('fs')
const path = require('path')
const PORT = 3000

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' })
    if (req.url === '/') {
      fs.readFile(
        path.join(__dirname, 'views', 'index.html'),
        'utf-8',
        (err, data) => {
          if (err) throw err
          res.write(data)
          res.end()
        }
      )
    } else if (req.url === '/about') {
      fs.readFile(
        path.join(__dirname, 'views', 'about.html'),
        'utf-8',
        (err, data) => {
          if (err) throw err
          res.write(data)
          res.end()
        }
      )
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
