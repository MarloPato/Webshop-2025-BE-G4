import express from 'express'

import Order from '../models/Order.js'
import User from '../models/User.js'
import { auth, adminAuth } from '../middleware/auth.js'
import Product from '../models/Product.js'
import mongoose from 'mongoose'
import Category from '../models/Category.js'

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
    const { firstname, lastname, phonenumber, products, shippingAddress } = req.body

    if (!firstname || !lastname || !phonenumber || !products || !shippingAddress) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    let user = null;
    
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const order = new Order({
      user: user ? user._id : null,
      firstname,
      lastname,
      phonenumber,
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

export default router;
