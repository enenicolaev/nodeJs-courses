const User = require('../models/user')

module.exports = async function(req, res, next) {
  console.log({reqSessionUser: req.session.user})
  if (!req.session.user) {
    return next()
  }

  req.user = await User.findById(req.session.user)
  next()
}