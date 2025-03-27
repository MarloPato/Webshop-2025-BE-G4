import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.send(category);
  } catch (error) {
    console.warn("Failed to fetch category", error);
    res.status(404).json({
      error: "Category not found",
    });
  }
});

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

    if (!req.body.name) {
      return res.status(500).json({ error: "name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: categoryData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
});

// ta bort en befintlig kategori
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
