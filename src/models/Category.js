import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, 'Category name can only contain letters']
    }
}, { timestamps: true });


export default mongoose.model('Category',categorySchema);