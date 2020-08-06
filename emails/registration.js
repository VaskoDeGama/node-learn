const config = require('config')

const EMAIL = config.get('mail')
const BASE_URL = config.get('baseUrl')

module.exports = function (to) {
  return {
    to: to,
    from: EMAIL,
    subject: 'Registration complete',
    html: `
      <h1>Welcome ${to}</h1>
      <p>You have successfully created an account!</p>
      <hr/>
      <a href="${BASE_URL}/auth/login#login">Now you can log in</a>
    `,
  }
}
