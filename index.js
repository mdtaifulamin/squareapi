const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Replace with your PostgreSQL connection details
const pool = new Pool({
  user: 'avnadmin',
  host: 'square-amintaiful-a32d.aivencloud.com',
  database: 'qms',
  password: 'AVNS_P5uHj0oWnm0c5ElNCA1',
  port: 10448,
  ssl: {
    rejectUnauthorized:false
  } // Change this if your PostgreSQL uses a different port
});

const app = express();
app.use(bodyParser.json());

// Get all items
app.get('/api/qms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM qms_data');
    res.status(200).json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error getting items huha' });
  }
});

// Get a specific item by ID
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error getting item' });
  }
});

// Create a new item
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating item' });
  }
});

// Update an existing item
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Start the server
const port = 3001; // You can change the port if needed
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
