const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/assignment.mongodb");


const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);

connectDB();

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});