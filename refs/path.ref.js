const path = require('path')

console.log(__filename)
console.log(path.basename(__filename)) //only filename
console.log(path.dirname(__filename)) //only dirname
console.log(path.extname(__filename)) //only file extension

console.log(path.parse(__filename)) //parse path to obj

console.log(path.join(__dirname, 'test', 'second.html')) //join to string
console.log(path.resolve(__dirname, './test', 'second.html')) //generate valid path
console.log(path.resolve(__dirname, './test', '/second.html')) //generate valid path
