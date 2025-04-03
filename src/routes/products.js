import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Hämta alla produkter (endast inloggade användare)
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hämta produkter efter kategori (endast inloggade användare)
router.get("/bycategory", auth, async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category);

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(404).json({ message: "This category doesn't exist" });
    }

    const products = await Product.find({
      category: categoryExists._id,
    }).populate("category", "name _id");

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.warn("Failed to fetch products", error);
    res.status(500).json({
      error: "Server error, failed to fetch products",
    });
  }
});

// Hämta produkt via ID (endast inloggade användare)
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
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

// Skapa produkt (endast admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const product = await new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Uppdatera produkt (endast admin)
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
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    res.json(updatedProduct);
  } catch (error) {
    console.warn("Error in getting product", error);
    res.status(404).json({
      error: "Product not found",
    });
  }
});

// Radera produkt (endast admin)
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
