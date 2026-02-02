const express = require('express');
const cors = require('cors');

const authRouter = require("./routes/authRoutes")
const moodRouter = require("./routes/moodRoutes")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter )
app.use("/api/mood", moodRouter )




app.get('/', (req, res) => {
    res.send('Mental Health Analysis System API is running...');
});



module.exports = app;
