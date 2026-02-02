const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const journalRoutes = require('./routes/journalRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mlRoutes = require('./routes/mlRoutes');
const reportRouter = require('./routes/reportRoutes')



const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/internal/ml', mlRoutes);
app.use('/api/reports', reportRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Mental Health Analysis System API is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
