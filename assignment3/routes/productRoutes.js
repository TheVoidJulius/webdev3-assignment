const validateProduct = require("../middleware/validateProduct");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");


router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/", validateProduct, async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// POST - Restock Product

router.post("/:id/restock", async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: quantity } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Stock restocked successfully",
            product
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/category-summary", async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$quantity"] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/low-stock", async (req, res) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/:id/sale", async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: quantity }
            },
            {
                $inc: { quantity: -quantity }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(400).json({
                message: "Product not found or insufficient stock"
            });
        }

        res.status(200).json({
            message: "Product sold successfully",
            product
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        let { category, sort, page, limit } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        let sortOption = {};

        if (sort) {
            sortOption.price = sort === "asc" ? 1 : -1;
        }

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            page,
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete Product

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;