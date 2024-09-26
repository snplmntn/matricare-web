const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

//Error handlers
const AppError = require("./Utilities/appError");
const globalErrorHandler = require("./controller/ErrorController");

//routes
const authRoute = require("./routes/auth");

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
app.use("/api/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
