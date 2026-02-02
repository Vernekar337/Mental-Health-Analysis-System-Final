const express = require('express');
const cors = require('cors');

const authRouter = require("./routes/authRoutes")
const moodRouter = require("./routes/moodRoutes")
const journalRouter = require("./routes/journalRoutes")
const activityRouter = require("./routes/activityRoutes")
const assessmentRoutes = require("./routes/assessmentRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter )
app.use("/api/mood", moodRouter )
app.use("/api/journal",journalRouter )
app.use("/api/activity", activityRouter)
app.use("/api/assessment", assessmentRoutes )
app.use("/api/analytics", analyticsRoutes)



app.get('/', (req, res) => {
    res.send('Mental Health Analysis System API is running...');
});



module.exports = app;
