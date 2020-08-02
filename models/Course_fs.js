const { v4: uuid } = require('uuid')
const path = require('path')
const fs = require('fs')

class Course_fs {
  constructor(title, price, url) {
    this.title = title
    this.price = price
    this.url = url
    this.id = uuid()
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      url: this.url,
      id: this.id,
    }
  }

  async save() {
    const courses = await Course_fs.getAll()
    courses.push(this.toJSON())
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }
        }
      )
    })
  }

  static async update(course) {
    const courses = await Course_fs.getAll()
    const idx = courses.findIndex((c) => c.id === course.id)
    courses[idx] = {
      ...course,
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static async getById(id) {
    const courses = await Course_fs.getAll()
    return courses.find((c) => c.id === id)
  }
}

module.exports = Course_fs
