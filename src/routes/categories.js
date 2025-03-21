import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.post('/', async (req,res) => {

    try {
        const newCategory = await new Category(req.body)
        await newCategory.save();
        res.status(201).json({success: true, data: newCategory})
    } catch(error) {
        res.status(400).json({success: false, error: error.message})
    }

})

export default router;