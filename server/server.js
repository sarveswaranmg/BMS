const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Loads the environment variables from .env

const connectDB = require("./config/db");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRouter");
const theatreRouter = require("./routes/theatreRouter");
const showRouter = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const clientBuildPath = path.join(__dirname, "../client/build");
console.log("client build path", clientBuildPath);

app.use(express.static(clientBuildPath));
app.use(helmet());
app.use(mongoSanitize());
app.disable("x-powered-by");

connectDB();

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 mins",
});

app.use("/api", apiLimiter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/bookings", bookingRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});
const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
