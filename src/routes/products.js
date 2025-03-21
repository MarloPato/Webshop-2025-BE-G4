import express from "express";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
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

//TODO Update product (admin only)
router.put("/:id", async (req,res) => {
  const {id} = req.params;
  const body = req.body;

  const productData = {...body}
  delete productData._id

  try {
    const updatedProduct = await Product.findOneAndUpdate(id,{$set : req.body},{new: true})
    
    if(!updatedProduct) {
      throw new Error("Product not found")
    }

    res.json(updatedProduct);

  } catch(error) {

    console.warn("Error in getting product", error);
    res.status(404).json({
      error: "Product not found",
    });

  }

  

})

//TODO Delete product (admin only)

export default router;
