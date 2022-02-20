//for packages third party libary
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDb from "./config/db.js"
import colors from "colors"
import path from "path"
import { notFound, errorHandler } from "./middlewares/notfound-error-middleware.js"
// for module exports
import routeProducts from "./routes/product-router.js"
import routeUsers from "./routes/users-route.js"
import routeOrders from "./routes/order-routes.js"
import uploadRoutes from "./routes/upload-routes.js"

dotenv.config()

connectDb()
const app = express()

app.use(express.json())

// Add headers
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*")

	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")

	res.setHeader("Access-Control-Allow-Headers", "Origin ,X-Requested-With, Content-type, Accept, Authorization")

	// res.setHeader("Access-Control-Allow-Credentials", true)

	next()
})
// app.use((req, res, next) =>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type,Accept, Authorization');
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
app.use("/api/products", routeProducts)
app.use("/api/users", routeUsers)
app.use("/api/orders", routeOrders)
app.use("/api/upload", uploadRoutes)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

app.get("/", (req, res, next) => {
	res.send("API is running..")
})

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold))
