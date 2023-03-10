const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
const privateRoute = require('../middleware/privateRoute')

router.get('/', privateRoute, async (req, res) => {
  try {
    const orders = await Order.find({'user.userId': req.user.id})
      .populate('user.userId')

    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
      orders: orders.map(o => {
        return {
          ...o._doc,
          price: o.courses.reduce((total, c) => {
            return total += c.count * c.course.price
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
})


router.post('/', privateRoute, async (req, res) => {
  try {
    const user = await req.session.user
      .populate('cart.items.courseId')
      .execPopulate()

    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user._id
      },
      courses: courses
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router