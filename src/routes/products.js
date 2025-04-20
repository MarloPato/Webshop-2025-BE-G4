import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all products and include category
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name _id");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get("/bycategory", async (req, res) => {
  try {
    const { category } = req.query;
    console.log("Category query:", category);

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Find the category by name (case insensitive)
    const categoryDoc = await Category.findOne({
      name: { $regex: new RegExp("^" + category + "$", "i") },
    });

    if (!categoryDoc) {
      return res.status(404).json({ message: "This category doesn't exist" });
    }

    console.log("Found category:", categoryDoc);

    // Find products with this category ID
    const products = await Product.find({
      category: categoryDoc._id,
    }).populate("category", "name _id");

    console.log("Found products:", products.length);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    res.status(500).json({
      error: "Server error, failed to fetch products",
    });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category", "name _id");
    if (!product) {
      throw new Error("Product not found");
    }
    res.send(product);
  } catch (error) {
    console.warn("Failed to fetch product", error);
    res.status(404).json({
      error: "Product not found",
    });
  }
});

// Create product (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = await new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const productData = { ...body };
  delete productData._id;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { $set: productData },
      { new: true, runValidators: true }
    ).populate("category", "name _id");

    if (!updatedProduct) {
      res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.warn("Error updating product", error);
    res.status(400).json({
      error: "Invalid value/s",
    });
  }
});

// Delete product (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
