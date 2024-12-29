import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import signUp from "./routes/user";

import cors from "cors";
dotenv.config();


const app = express();
app.use(cors());
const PORT = 3000;

const URI = process.env.URI!;

app.use(express.json());
app.use(signUp);


mongoose
  .connect(URI)
  .then(() => {
    console.log("Atlas connected");
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });

app.get("/", (req: Request, res: Response): void => {
  res.send("Server works and DB connected");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
