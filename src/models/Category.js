import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^(?=.*[a-zA-Z])[\w\s\-]+$/, 'Category name must contain at least one letter and cannot consist of only numbers or special characters']
    }
}, { timestamps: true });


export default mongoose.model('Category',categorySchema);