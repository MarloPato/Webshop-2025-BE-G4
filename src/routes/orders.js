import express from 'express'
import jwt from 'jsonwebtoken'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { auth, adminAuth } from '../middleware/auth.js'


const router = express.Router()

router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstname lastname email')
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
)

router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, phonenumber, email, products, shippingAddress } = req.body

    if (!firstname || !lastname || !phonenumber || !email || !products || !shippingAddress) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    let user = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // eller din hemlighet
        user = await User.findById(decoded.userId); // justera om du använder annan nyckel
        console.log(user);
      } catch (err) {
        console.log("Kunde inte verifiera token, fortsätter utan användare");
      }
    }
    
    // if (req.user && req.user._id) {
    //   user = await User.findById(req.user._id);
    //   if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }
    // }

    const order = new Order({
      user: user ? user._id : null,
      firstname,
      lastname,
      phonenumber,
      email,
      products,
      shippingAddress
    })

    await order.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
)

router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const orderData = { ...body };
  delete orderData._id;

  // Räknar om totalpris om produkter ändrats
  if (orderData.products && Array.isArray(orderData.products)) {
    orderData.totalPrice = orderData.products.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { $set: orderData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.warn("Error updating order", error);
    res.status(400).json({ error: "Invalid value/s" });
  }
});


export default router;
