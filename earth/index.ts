import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import * as fs from "fs";
import createMQConsumer from "./consumer";
import sendMessage from "./producer";
import { EARTH_QUEUE, TRANSLATOR_QUEUE } from "./constants";

const PORT = 3001;

const AMQP_URL = "amqp://localhost";

const app = express();
const consumer = createMQConsumer(AMQP_URL, EARTH_QUEUE);

consumer();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  const dataStr = fs.readFileSync("data.json", "utf8");
  const data = JSON.parse(dataStr);

  return res.status(200).json({ data });
});

app.post("/", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) throw new Error("Message is missing");
    const payload = {
      from: "earth",
      to: "mars",
      message
    };
    // sending data to the rmq queue
    await sendMessage(AMQP_URL, TRANSLATOR_QUEUE, JSON.stringify(payload));

    return res.status(200).json({ status: "Message sent successfully" });
  } catch (error: any) {
    console.error("Producer Error:", error);
    return res.status(500).json({
      status: "Failed to send message",
      error: error.message || error
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
