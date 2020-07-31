const fs = require('fs')
const path = require('path')

//file system

//fs.mkdirSync()  //better not to use

fs.unlink(path.join(__dirname, 'notes', 'myNotes.txt'), (err) => {
  if (err) throw err
  console.log('Фаил Удален')
})

fs.rmdir(path.join(__dirname, 'notes'), (err) => {
  if (err) throw err
  console.log('Папка Удалена')
})

fs.mkdir(path.join(__dirname, 'notes'), (err) => {
  if (err) throw err
  console.log('Папка создана')
}) //does not block the thread

fs.writeFile(
  path.join(__dirname, 'notes', 'myNotes.txt'),
  'Hello world \n',
  (err) => {
    if (err) throw err
    console.log('Фаил создана')

    fs.appendFile(
      path.join(__dirname, 'notes', 'myNotes.txt'),
      'added line after creation',
      (err) => {
        if (err) throw err
        console.log('Фаил обновлен')

        fs.readFile(
          path.join(__dirname, 'notes', 'myNotes.txt'),
          'utf-8',
          (err, data) => {
            if (err) throw err
            console.log(data)
          }
        )
      }
    )
  }
)
