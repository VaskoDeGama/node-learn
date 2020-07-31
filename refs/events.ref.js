const EventEmitter = require('events')

class Logger extends EventEmitter {
  log(message) {
    this.emit('message', `${message}:${Date.now().toLocaleString('ru')}`)
  }
}

const logger = new Logger()

logger.on('message', (data) => {
  console.log(data)
})

logger.log('message')
