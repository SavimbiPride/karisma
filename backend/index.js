const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kelasRoutes = require('./routes/kelasRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk akses file upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route
app.get('/', (req, res) => {
  res.send('battle control online');
});

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', kelasRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`battle control online at http://localhost:${PORT}`);
});
