import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30,
    match: [/^[A-Za-zåäöÅÄÖ]+$/, 'Firstname must contain only letters']
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30,
    match: [/^[A-Za-zåäöÅÄÖ]+$/, 'Lastname must contain only letters']
  },
  phonenumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 60,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Ogiltig e-postadress",
    ]
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    street: {
      type: String,
      required: true,
      match: [/^[A-Za-zåäöÅÄÖ\s\-]+$/, 'Street must contain only letters, spaces or hyphens'],
      maxlength: 50
    },
    number: {
      type: String,
      required: true,
      match: [/^\d+[A-Za-z]?$/, 'Street number must be numeric, optionally followed by a letter'],
      maxlength: 10
    }
    ,
    zipCode: {
      type: String,
      required: true,
      match: [/^\d{3}\s?\d{2}$/, 'Zip code must be in the format 12345 or 123 45'],
      maxlength: 10
    }
    ,
    city: { type: String, required: true, match: [/^[A-Za-zåäöÅÄÖ]+$/, 'City must contain only letters'] }
  },
  status: {
    type: String,
    enum: ['received', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'received'
  },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true })

orderSchema.pre('save', function (next) {
  if (this.products && this.products.length > 0) {
    this.totalPrice = this.products.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  }

  next();
});

export default mongoose.model('Order', orderSchema);