import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30,
    match: [
      /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö\s'-]+$/,
      'Förnamnet får endast innehålla bokstäver, mellanslag, bindestreck eller apostrof'
    ]
    
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30,
    match: [
      /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö\s'-]+$/,
      'Efternamnet får endast innehålla bokstäver, mellanslag, bindestreck eller apostrof'
    ]
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 60,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Ogiltig e-postadress",
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      'Lösenordet måste vara minst 8 tecken långt och innehålla en stor bokstav, en liten bokstav, en siffra och ett specialtecken'
    ]
    
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);