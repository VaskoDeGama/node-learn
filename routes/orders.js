const { Router } = require('express')
const Order = require('../models/Order')
const isAuth = require('../middleware/auth')

const router = Router()

function computePrice(courses) {
  return courses.reduce((total, c) => total + c.course.price * c.count, 0)
}
function mapOrderItems(orders) {
  return orders.map((order) => ({
    ...order,
    price: computePrice(order.courses),
  }))
}

router.get('/', isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId')
      .lean()
    res.render('orders', {
      isOrders: true,
      title: 'Orders',
      orders: mapOrderItems(orders),
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/', isAuth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items.map((c) => ({
      count: c.count,
      course: { ...c.courseId._doc },
    }))
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    })
    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
