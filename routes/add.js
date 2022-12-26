const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const privateRoute = require('../middleware/privateRoute')

router.get('/', privateRoute, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', privateRoute, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id
  })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router