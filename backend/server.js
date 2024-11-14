const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://manikinediashok:oIRHHXxsSZz9HZNe@cluster0.xau5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define Item Schema
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
  });
  
  const Item = mongoose.model('Item', itemSchema);
  
  // Route to add a new item
  app.post('/items', async (req, res) => {
    const { name, quantity, price } = req.body;
    const newItem = new Item({ name, quantity, price });
  
    try {
      await newItem.save();
      res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item' });
    }
  });
  
  // Route to get all items
  app.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      let totalInventoryValue = 0;
      items.forEach(item => {
        totalInventoryValue += item.quantity * item.price;
      });
      res.json({ items, totalInventoryValue });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve items' });
    }
  });
  
  // Route to update an item*
  app.patch('/items/:id', async (req, res) => {
    const { quantity, price } = req.body;
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, { quantity, price }, { new: true });
      res.json({ message: 'Item updated successfully', updatedItem });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update item' });
    }
  });
  
  // Route to delete an item
  app.delete('/items/:id', async (req, res) => {
    try {
      await Item.findByIdAndDelete(req.params.id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });