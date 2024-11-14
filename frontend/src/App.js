import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });
  const [totalValue, setTotalValue] = useState(0);

  // Fetch items from the server
  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(response => {
        setItems(response.data.items);
        setTotalValue(response.data.totalInventoryValue);
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  // Handle form submission to add a new item
  const handleAddItem = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/items', newItem)
      .then(response => {
        setItems([...items, newItem]);
        setTotalValue(totalValue + (newItem.quantity * newItem.price));
        setNewItem({ name: '', quantity: 0, price: 0 });
      })
      .catch(error => console.error('Error adding item:', error));
  };

  // Handle updating an item
  const handleUpdateItem = (id, quantity, price) => {
    axios.patch(`http://localhost:5000/items/${id}`, { quantity, price })
      .then(response => {
        const updatedItems = items.map(item => {
          if (item._id === id) {
            return { ...item, quantity, price };
          }
          return item;
        });
        setItems(updatedItems);
        setTotalValue(updatedItems.reduce((total, item) => total + (item.quantity * item.price), 0));
      })
      .catch(error => console.error('Error updating item:', error));
  };

  // Handle deleting an item
  const handleDeleteItem = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(response => {
        const remainingItems = items.filter(item => item._id !== id);
        setItems(remainingItems);
        setTotalValue(remainingItems.reduce((total, item) => total + (item.quantity * item.price), 0));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <div className="App">
      <h1>Inventory Management</h1>

      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={e => setNewItem({ ...newItem, price: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>

      <h2>Total Inventory Value: ${totalValue}</h2>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            <p>{item.name} - {item.quantity} units - ${item.price} each</p>
            <button onClick={() => handleUpdateItem(item._id, item.quantity + 1, item.price)}>Increase Quantity</button>
            <button onClick={() => handleDeleteItem(item._id)}>Delete Item</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
