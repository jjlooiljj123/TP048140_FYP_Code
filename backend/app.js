const path = require("path"); // for file upload into server file
const cron = require("node-cron"); // for scheduled job
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // for access permission from different website
require("dotenv/config"); // file to store static variable (to hide the value in different file)
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const {
  currentDateTime,
  datetimeAfterOneHour,
} = require("./Utils/currentDateTime");

const { cronCreateAnalysis } = require("./controllers/combinedPerformance");
const { runBatchUpdateEstimatedQaitingTime } = require("./controllers/queue");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
const PORT = 8080;

// multer: destination to store the image file
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  }
};

// import routes
const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop");
const shopStatusRoutes = require("./routes/shopStatus");
const queueRoutes = require("./routes/queue");
const queueStructureRoutes = require("./routes/queueStructure");
const shopActivityRoutes = require("./routes/shopActivity");
const performanceRoutes = require("./routes/performance");
const feedbackRoutes = require("./routes/feedback");
const testingRoutes = require("./routes/testing");

//show image
app.use("/images", express.static(path.join(__dirname, "images")));

//
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// middleware
app.use(bodyParser.json()); // application/json
app.use(cors()); // CORS
app.use((req, res, next) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/shop", shopRoutes);
app.use("/shopStatus", shopStatusRoutes);
app.use("/queue", queueRoutes);
app.use("/queueStructure", queueStructureRoutes);
app.use("/shopActivity", shopActivityRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/performance", performanceRoutes);
app.use("/user", userRoutes);
app.use("/testing", testingRoutes);

// To run scheduled job every 59th minutes of every hour
// later will be used to calculate shop performance
cron.schedule("59 * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job - create analysis report");
  const currentTime = currentDateTime();
  cronCreateAnalysis(currentTime, datetimeAfterOneHour(currentTime), 60);
});

// To run scheduled job every minute
// later will be used to deduct the estimated waiting time in queue minute by minute
cron.schedule("0 * * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job - update estiamted waiting time");
  runBatchUpdateEstimatedQaitingTime();
});

// error handling middleware (whenever an error is hit in the controllers)
app.use((error, req, res, next) => {
  console.log(error);
  console.log("middleware error handling triggered");
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// connect to MongoDB
mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("connected to DB");
    }
  )
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log("Backend Express Up, port: " + PORT);
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  })
  .catch((err) => console.log(err));
