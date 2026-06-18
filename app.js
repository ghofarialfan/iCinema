import cors from "cors";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { fileURLToPath } from "url";

import users from "./controller/user.js";
import auth from "./controller/auth.js";
import movie from "./controller/movie.js";
import genre from "./controller/genre.js";
import health from "./controller/health.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (req) => req.url.startsWith("/health"),
  })
);

app.use("/health", health);
app.use("/api/movies", movie);
app.use("/api/genres", genre);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(express.static("frontend/build"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

export default app;
