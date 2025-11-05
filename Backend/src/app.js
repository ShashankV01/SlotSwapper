// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const swapsRoutes = require('./routes/swaps');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/swaps', swapsRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true }));

// prepare DB (sync)
async function prepare() {
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (err) {
    console.error('DB sync error', err);
  }
}
prepare();

module.exports = app;
