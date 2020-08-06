const config = require('config')

const EMAIL = config.get('mail')
const BASE_URL = config.get('baseUrl')

module.exports = function (to, token) {
  return {
    to: to,
    from: EMAIL,
    subject: 'Reset password',
    html: `
      <h1>Reset password ${to}</h1>
      <p>If you did not order a password reset, look forward to this letter.</p>
      <a href="${BASE_URL}/auth/password/${token}"><strong>Reset password</strong></a>
      <hr/>
      <a href="${BASE_URL}/auth/login#login">Now you can log in</a>
    `,
  }
}
