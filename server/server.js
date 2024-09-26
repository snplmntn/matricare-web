const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! 💣 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config();

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Ensures compatibility with modern MongoDB connection string
    useUnifiedTopology: true, // Provides improved server discovery and monitoring
  })
  .then(() => console.log("Database is Connected"))
  .catch((err) => console.log("Database connection error:", err));

const server = app.listen(process.env.PORT, async () => {
  console.log("Server Started " + process.env.PORT);
  console.log(process.env.NODE_ENV);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!!! 💥 Servr Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
