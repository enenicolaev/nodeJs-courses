const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body

    const candidate = await User.findOne({ email })
    console.log({email, candidate})

    if (candidate) {
      const isSame = password === candidate.password
      
      if (isSame) {
        req.session.user = candidate

        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        res.redirect('/auth/login#login')
      }
    } else {
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body

    const candidate = await User.findOne({ email })
    console.log({email, candidate})
    if (candidate) {
      res.redirect('/auth/login#register')
    } else {
      await new User({
        email,
        name,
        password,
        cart: {
          items: []
        }
      }).save()

      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router