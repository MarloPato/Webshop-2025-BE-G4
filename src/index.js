import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js'

// Import data migration
import dataMigrationRouterCommon from "./migration/data.migration.route_module.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors('*'));
app.use(express.json());


// Kod för data migrationen
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPathProducts = join(__dirname, "data", "products.json");
const dataPathCategories = join(__dirname, "data", "categories.json");

app.use(
  "/api/data-migration/products",
  dataMigrationRouterCommon(Product, dataPathProducts)
);
app.use(
  "/api/data-migration/categories",
  dataMigrationRouterCommon(Category, dataPathCategories)
);

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    name: "Hakim Livs API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login with username and password"
      },
      products: {
        "GET /api/products": "Get all products",
        "GET /api/products/bycategory?category=...": "Get products by category",
        "GET /api/products/:id": "Get a single product by ID",
        "POST /api/products": "Create a new product (Admin only)",
        "PUT /api/products/:id": "Update a product (Admin only)",
        "DELETE /api/products/:id": "Delete a product (Admin only)"
      },
      categories: {
        "GET /api/categories": "Get all categories",
        "GET /api/categories/:id": "Get a single category by ID",
        "POST /api/categories": "Create a new category (Admin only)",
        "PUT /api/categories/:id": "Update single category (Admin only)",
        "DELETE /api/categories/:id": "Delete a category (Admin only)"
      }
    },
    authentication: "Use Bearer token in Authorization header for protected routes"
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB', process.env.MONGODB_URI))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});