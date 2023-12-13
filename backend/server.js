const express = require("express");
const cors = require("cors");
const session = require("express-session"); // Import express-session
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5431;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Import the database connection from db-tables.js
const db = require("./db/db-tables");

async function startServer() {
  app.use((req, res, next) => {
    req.db = db; // Pass the MySQL connection to the routes
    next();
  });

  app.use("/server/v1/categories", require("./routes/categories.routes"));
  app.use("/server/v1/items", require("./routes/items.routes"));
  app.use("/server/v1/info", require("./routes/info.routes"));
  app.use("/server/v1/admin/users", require("./routes/users.routes"));

  app.get("/", (req, res) => {
    res.status(200).json({
      info: {
        message: "Welcome to the selfhosted server network dashboard!",
        port: port,
        version: "1.0",
        defaultUsername: "admin",
        defaultPassword: "password",
      },
      endpoints: {
        categories: `http://localhost:${port}/server/v1/categories`,
        items: `http://localhost:${port}/server/v1/items`,
        info: `http://localhost:${port}/server/v1/info`,
        users: `http://localhost:${port}/server/v1/admin/users`,
      },
      Credits: {
        madeBy: "Scott Zangenberg (LonlyGamerX)",
      },
    });
  });

  app.listen(port, () => {
    console.log("The API is successfully running.");
    console.log(`Listening on http://localhost:${port}`);
  });

  // Handle errors during server startup
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
  });
}

startServer();
