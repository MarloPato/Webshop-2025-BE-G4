import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCategory = await new Category(req.body);
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// uppdatera befintlig kategori
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = { ...req.body };
    delete categoryData._id;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
