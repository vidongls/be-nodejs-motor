import express from "express"
import mongoose from "mongoose"
import {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
} from "./../controllers/products-controller.js"
import { protect, admin } from "./../middlewares/auth-middleware.js"

const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getProductById)
router.delete("/:id", protect, admin, deleteProduct)
router.post("/", protect, admin, createProduct)
router.put("/:id", protect, admin, updateProduct)

export default router
