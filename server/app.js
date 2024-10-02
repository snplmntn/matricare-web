const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

//Utilities
const AppError = require("./Utilities/appError");
const checkAuth = require("./Utilities/checkAuth");
const globalErrorHandler = require("./controller/ErrorController");
const aliveRoute = require("./routes/alive");

//routes
// user
const authRoute = require("./routes/User/auth");
const userRoute = require("./routes/User/user");
const verifyRoute = require("./routes/User/verify");
//records
const patientRoute = require("./routes/User/Records/patient");
const taskRoute = require("./routes/User/Records/task");
const documentRoute = require("./routes/User/Records/document");
const medicalHistoryRoute = require("./routes/User/Records/medicalHistory");
const obstetricHistoryRoute = require("./routes/User/Records/obstetricHistory");
const surgicalHistoryRoute = require("./routes/User/Records/surgicalHistory");

// content
const uploadRoute = require("./routes/Content/upload");
const postRoute = require("./routes/Content/post");
const bellytalk = require("./routes/Content/bellytalk");

// Initialization
const app = express();
// Enable proxy trust to allow express-rate-limit to read X-Forwarded-For header
app.set("trust proxy", 1); // Trust first proxy
const limiter = rateLimit({
  max: 1000,
  windowMs: 10 * 60 * 1000, // 10 minutes
  message: "Too many requests, please try again later.",
});

// Middleware
app.use(helmet());

//Protection Against DDOS Attack
app.use("/api", limiter);

// Body Parser
app.use(
  express.json({
    limit: "10kb",
  })
);

//Data sanization against NoSQL query injection
app.use(mongoSanitize());
app.use(hpp()); // prevent paramater pollution
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// user
app.use("/api/auth", authRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/user", checkAuth, userRoute);

// records
app.use("/api/record/patient", checkAuth, patientRoute);
app.use("/api/record/task", checkAuth, taskRoute);
app.use("/api/record/document", checkAuth, documentRoute);
app.use("/api/record/medical", checkAuth, medicalHistoryRoute);
app.use("/api/record/obstetric", checkAuth, obstetricHistoryRoute);
app.use("/api/record/surgical", checkAuth, surgicalHistoryRoute);

// content
app.use("/api/upload", checkAuth, uploadRoute);
app.use("/api/post", checkAuth, postRoute);
app.use("/api/bellytalk", bellytalk); //public belly talk route
app.use("/api/alive", aliveRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
