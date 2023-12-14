const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const initializeDatabase = require("./db/db-tables");
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
const port = process.env.PORT || 5431;

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 7200000,
  expiration: 86400000,
});

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// Import the database connection from db-tables.js
const db = require("./db/db-tables");

async function startServer() {
  // Initialize the session store
  sessionStore
    .connect()
    .then(() => {
      console.log("Session store connected successfully");

      app.use((req, res, next) => {
        req.db = db; // Passes the MySQL connection to the routes
        next();
      });

      // Add a login route
      app.post("/login", async (req, res) => {
        try {
          const { username, password } = req.body;
          const connection = await initializeDatabase();
          const [user] = await connection.execute(
            "SELECT * FROM Users WHERE username = ?",
            [username]
          );
          if (!user.length) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }
          const validPassword = await bcrypt.compare(
            password,
            user[0].password
          );
          if (!validPassword) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }
          // Set the session isLoggedIn to true
          req.session.isLoggedIn = true;
          req.session.username = username; // Optionally store other user data in the session
          res.json({ message: "Login successful" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
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
    })
    .catch((err) => {
      console.error("Error connecting to session store:", err);
    });
}

startServer();
