// Libraries
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

//Utilities
const AppError = require("./Utilities/appError");
const checkAuth = require("./Utilities/checkAuth");
const checkRole = require("./Utilities/checkRole");
const globalErrorHandler = require("./controller/ErrorController");
const aliveRoute = require("./routes/alive");

// routes import
// user
const authRoute = require("./routes/User/auth");
const userRoute = require("./routes/User/user");
const verifyRoute = require("./routes/User/verify");
const appointmentRoute = require("./routes/User/appointment");
//records
const patientRoute = require("./routes/User/Records/patient");
const taskRoute = require("./routes/User/Records/task");
const documentRoute = require("./routes/User/Records/document");
const medicalHistoryRoute = require("./routes/User/Records/medicalHistory");
const obstetricHistoryRoute = require("./routes/User/Records/obstetricHistory");
const surgicalHistoryRoute = require("./routes/User/Records/surgicalHistory");

// content
const postRoute = require("./routes/Content/post");
const postAnalyticsRoute = require("./routes/Content/postAnalytics");
const articleRoute = require("./routes/Content/article");
const uploadRoute = require("./routes/Content/upload");
const bellytalk = require("./routes/Content/bellytalk");

const app = express(); // Initialization
app.set("trust proxy", 1); // Enable proxy trust to allow express-rate-limit to read X-Forwarded-For header
const limiter = rateLimit({
  max: 1000,
  windowMs: 10 * 60, // 1 minute
  message: "Too many requests, please try again later.",
});

// Middleware
app.use(helmet()); // ensures secure web application by setting various HTTP headers
app.use("/api", limiter); //Protection Against DDOS Attack
app.use(
  express.json({
    limit: "10kb",
  })
); // Body Parser
app.use(mongoSanitize()); //Data sanization against NoSQL query injection
app.use(hpp()); // prevent paramater pollution
app.use(cors()); // Cross Origin Resource Sharing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=()");
  next();
});

// Routes
// user
app.use("/api/auth", authRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/user", checkAuth, userRoute);
app.use("/api/appointment", checkAuth, appointmentRoute);

// records
app.use("/api/record/patient", checkAuth, patientRoute);
app.use("/api/record/task", checkAuth, taskRoute);
app.use("/api/record/document", checkAuth, documentRoute);
app.use("/api/record/medical", checkAuth, medicalHistoryRoute);
app.use("/api/record/obstetric", checkAuth, obstetricHistoryRoute);
app.use("/api/record/surgical", checkAuth, surgicalHistoryRoute);

// content
app.use("/api/post", checkAuth, postRoute);
app.use("/api/analytics", checkAuth, postAnalyticsRoute);
app.use("/api/article", articleRoute);
app.use("/api/upload", checkAuth, uploadRoute);
app.use("/api/bellytalk", bellytalk); //public belly talk route
// utility
app.use("/api/alive", aliveRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
