import asyncHandler from "express-async-handler"
import Order from "./../models/order-model.js"

// @desc create new  orders
// @route POST /api/orders
// @access Private

const addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, shippingPrice, totalPrice } = req.body

	if (orderItems && orderItems.length === 0) {
		res.status(400)
		throw new Error("No order items")
		return
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod: "Thanh toán khi nhận hàng",
			shippingPrice,
			totalPrice,
		})

		const createdOrder = await order.save()

		res.status(201).json(createdOrder)
	}
})

// @desc Get Order by Id
// @route POST /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate("user", "name email", "User")
	if (order) {
		res.json(order)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

// @desc Update order to paid
// @route POST /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)
	const check = req.body
    console.log(check)
	if (order) {
		order.isPaid = !check
		order.paidAt = Date.now()
		const updatedOrder = await order.save()
		res.status(200).json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)
	const check = req.body
    console.log(check)
	if (order) {
		order.isDelivered = !check
		order.deliveredAt = Date.now()
		const updatedOrder = await order.save()
		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("Order not found")
	}
})

// @desc Get logged in user orders
// @route POST /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id })
	res.json(orders)
})

// @desc Get all orders
// @route POST /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate("user", "id name")
	res.json(orders)
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }
