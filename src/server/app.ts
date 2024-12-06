import express, { Application } from "express";
import routes from "./routes";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api", routes);

export default app;
