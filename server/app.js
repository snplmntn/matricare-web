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
const taskRoute = require("./routes/User/Records/task");
// content
const uploadRoute = require("./routes/Content/upload");
const postRoute = require("./routes/Content/post");
const bellytalk = require("./routes/Content/bellytalk");

// Initialization
const app = express();
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
app.use("/api/record/task", checkAuth, taskRoute);

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
