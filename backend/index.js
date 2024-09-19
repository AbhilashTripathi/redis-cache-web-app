const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Item = mongoose.model('Item', { name: String });

// Redis connection
const redis = new Redis({
  host: 'redis',
  port: 6379,
});

// app.get('/db', async (req, res) => {
//   const items = await Item.find();
//   res.json(items);
// });
app.get('/db', async (req, res) => {
    try {
      const items = await Item.find().sort({ _id: -1 }).limit(20);
      res.json(items);
    } catch (error) {
      console.error('Error fetching DB items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.post('/db', async (req, res) => {
//   const newItem = new Item({ name: req.body.name });
//   await newItem.save();
//   res.json(newItem);
// });
app.post('/db', async (req, res) => {
    try {
      const newItem = new Item({ name: req.body.name });
      await newItem.save();
      
      // Update cache with the new item
      await redis.lpush('latest_items', newItem.name);
      await redis.ltrim('latest_items', 0, 4); // Keep only the 5 most recent items
      
      res.json(newItem);
    } catch (error) {
      console.error('Error adding new item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// app.get('/cache', async (req, res) => {
//   const cachedValue = await redis.get('myKey');
//   res.json({ value: cachedValue });
// });
app.get('/cache', async (req, res) => {
    try {
      const cachedItems = await redis.lrange('latest_items', 0, -1);
      res.json({ items: cachedItems });
    } catch (error) {
      console.error('Error fetching cached items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// app.post('/cache', async (req, res) => {
//   await redis.set('myKey', req.body.value, 'EX', 60);
//   res.json({ message: 'Value cached successfully' });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});