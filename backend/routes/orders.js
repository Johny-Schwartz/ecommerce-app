const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// READ: all orders
router.get("/", async (req, res) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// CREATE: place order, calculate total, reduce stock
router.post("/", async (req, res) => {
  try {
    const { customerName, items } = req.body; // items: [{ productId(_id), qty }]
    if (!customerName || !items?.length)
      return res.status(400).json({ message: "Customer name and items are required" });

    // First pass: validate stock and build order lines
    const lines = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(404).json({ message: "Product not found" });
      if (it.qty < 1 || it.qty > p.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${p.name} (available: ${p.quantity})` });
      lines.push({ product: p._id, name: p.name, price: p.price, qty: it.qty });
      total += p.price * it.qty;
    }

    // Second pass: reduce stock
    for (const l of lines) await Product.findByIdAndUpdate(l.product, { $inc: { quantity: -l.qty } });

    res.status(201).json(await Order.create({ customerName, items: lines, total }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// UPDATE: cancel order and restore stock
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled") return res.status(400).json({ message: "Order already cancelled" });

    for (const l of order.items) await Product.findByIdAndUpdate(l.product, { $inc: { quantity: l.qty } });
    order.status = "Cancelled";
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
