import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import * as fs from "fs";
import createMQConsumer from "./consumer";
import { TRANSLATOR_QUEUE } from "./constants";

const PORT = 3003;

const AMQP_URL = "amqp://localhost";

const app = express();

const consumer = createMQConsumer(AMQP_URL, TRANSLATOR_QUEUE);

consumer();
app.use(bodyParser.json());

app.get("/mars", (req: Request, res: Response) => {
  try {
    const dataStr = fs.readFileSync("mars.json", "utf8");
    const data = JSON.parse(dataStr);

    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({
      status: "Failed to get the data",
      error: error.message || error
    });
  }
});

app.get("/earth", (req: Request, res: Response) => {
  try {
    const dataStr = fs.readFileSync("earth.json", "utf8");
    const data = JSON.parse(dataStr);

    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({
      status: "Failed to get the data",
      error: error.message || error
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
