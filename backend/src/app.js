const express = require('express');
const cors = require('cors');

const authRouter = require("../routes/authRoutes")
// const moodRouter = require("../routes/moodRoutes")
// const journalRouter = require("../routes/journalRoutes")
// const activityRouter = require("../routes/activityRoutes")
const assessmentRoutes = require("../routes/assessmentRoutes")
// const analyticsRoutes = require("../routes/analyticsRoutes")
const reportRoutes = require("../routes/reportRoutes")
// const reflectiveAssessmentRoutes = require("../routes/reflectiveAssessmentRoutes")
// const alertRoutes = require("../routes/alertRoutes")
// const counselorRoutes = require("../routes/counselorRoutes")
// const relaxRoomRoutes = require("../routes/relaxRoomRoutes")
const dashboardRoutes = require("../routes/dashboardRoutes")
const insightRoutes = require("../routes/insightRoutes")
const reflectionRoutes = require("../routes/reflectionRoutes")
const parentRoutes = require("../routes/parentRoutes")
const audioRoutes = require("../routes/audioRoutes")
const profileRoutes = require("../routes/profileRoutes")
const counselorRoutes = require("../routes/counselorRoutes")
const alertRoutes = require("../routes/alertRoutes")





const http = require("http")
// const { Server } = require("socket.io")
// const relaxRoomSocket = require("./sockets/relaxRoomSocket")

// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: { origin: "*" }
// })

// relaxRoomSocket(io)

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter )
// app.use("/api/mood", moodRouter )
// app.use("/api/journal",journalRouter )
// app.use("/api/activity", activityRouter)
app.use("/api/assessment", assessmentRoutes )
// app.use("/api/analytics", analyticsRoutes)
app.use("/api/report", reportRoutes)
// app.use(
//   "/api/reflective-assessments",
//   reflectiveAssessmentRoutes)
// app.use("/api/alerts", alertRoutes)
// app.use("/api/counselor", counselorRoutes)
// app.use("/api/relax-rooms", relaxRoomRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/insights", insightRoutes)
app.use("/api/reflection", reflectionRoutes)
app.use("/api/parent", parentRoutes)
app.use("/api/audio", audioRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/counselor", counselorRoutes)
app.use("/api", alertRoutes)


app.get('/', (req, res) => {
    res.send('Mental Health Analysis System API is running...');
});



module.exports = app;
