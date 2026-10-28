const router = require("express").Router();
const Product = require("../models/Product");

// READ: all products, optional ?search= (matches name or category)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, "i") }, { category: new RegExp(search, "i") }] }
      : {};
    res.json(await Product.find(filter).sort({ name: 1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (e) {
    const msg = e.code === 11000 ? "Product ID already exists" : e.message;
    res.status(400).json({ message: msg });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
