const http = require('http')
const PORT = 3000
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' })
  if (req.method === 'GET') {
    res.end(`
            <h1>Form</h1>
            <form method="post" action="/">
              <input type="text" name="title" placeholder="title">
              <button type="submit">Submit</button>
            </form>
    `)
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
