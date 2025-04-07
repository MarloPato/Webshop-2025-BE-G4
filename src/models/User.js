import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[A-Za-z\u00C0-\u017F\s'-]+$/,
        "Förnamnet får endast innehålla bokstäver",
      ],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 30,
      match: [
        /^[A-Za-z\u00C0-\u017F\s'-]+$/,
        "Efternamnet får endast innehålla bokstäver",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 320, // Max enligt standarden för e-post
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ogiltig e-postadress"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
