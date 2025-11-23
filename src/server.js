import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ConnectWithMongo } from "./services/mongo.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login.router.js";
import registerRouter from "./routes/register.router.js";
import dashboardRouter from "./routes/dashboard.router.js";
import refreshRouter from "./routes/refresh.router.js";
import logoutRouter from "./routes/logout.router.js";

// render the dotenv config to access the variables.
dotenv.config();

// Path Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = process.env.VERCEL === '1';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath, { 
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// connect with ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// steup CORS
const clientOrigin = (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const corsOptions = {
  origin: clientOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// setup the cookie parser
app.use(cookieParser());

// setup the app routes
app.get("/", (req, res) => res.render("landing"));
app.use("/auth/login", loginRouter);
app.use("/auth/register", registerRouter);
app.use("/dashboard", dashboardRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

// 404 handler
app.use((req, res) => res.status(404).render("errors/404"));

// ensure database connection is established once
ConnectWithMongo(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo connection error", err));

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

export default app;