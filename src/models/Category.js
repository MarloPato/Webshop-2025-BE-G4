import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true,
        lowercase: true
    }
})

export default mongoose.model('Category',categorySchema);