module.exports = function(req, res, next) {
  if (!req.session.isAuthenticated && !req.url.includes('/auth')) {
    res.redirect('/auth/login')

    return
  }

  next()
}