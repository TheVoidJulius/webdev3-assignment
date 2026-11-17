const validateProduct = (req, res, next) => {
  const { name, sku, category, price, quantity, reorderLevel, supplier } = req.body;

  if (!name || !sku || !category || !supplier) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (price < 0 || quantity < 0 || reorderLevel < 0) {
    return res.status(400).json({
      message: "Values cannot be negative"
    });
  }

  next();
};

module.exports = validateProduct;