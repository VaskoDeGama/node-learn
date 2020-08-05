module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAunteticated
  res.locals.csrf = req.csrfToken()
  next()
}
