import asyncHandler from "express-async-handler"
import Product from "./../models/product-model.js"

// @desc fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 25
	const page = Number(req.query.pageNumber) || 1
	const keyword = req.query
		? {
				name: {
					$regex: `${req.query.search ? req.query.search : ""}`,
					$options: "i",
				},

				...req.query,
		  }
		: {}

	const count = await Product.countDocuments({ ...keyword })
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1))
	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductById = asyncHandler(async (req, res) => {
	// if (ObjectId.isValid(req.params.id)) {
	const product = await Product.findById(req.params.id)
	// }
	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

// @desc delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (product) {
		await product.remove()
		res.json({ message: "Product removed successfully" })
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

// @desc create product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } = req.body
	const product = new Product({
		name,
		price,
		user: req.user._id,
		image,
		brand,
		category,
		countInStock,
		description,
	})

	const createdProduct = await product.save()
	res.status(201).json(createdProduct)
})

// @desc udpate product
// @route PUT /api/products
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } = req.body
	const product = await Product.findById(req.params.id)

	if (product) {
		product.name = name
		product.price = price
		product.description = description
		product.image = image
		product.category = category
		product.countInStock = countInStock
		product.brand = brand
		const updatedProduct = await product.save()
		res.json(updatedProduct)
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct }
