import amqp, { Message } from "amqplib/callback_api";
import * as fs from "fs";
import { EARTH_QUEUE, MARS_QUEUE } from "./constants";
import sendMessage from "./producer";
import { numericToText, textToNumeric } from "./translator";

const readDataFromFile = (filePath: string): any[] => {
  try {
    const dataStr = fs.readFileSync(filePath, "utf8");
    return JSON.parse(dataStr);
  } catch (error) {
    return [];
  }
};

const writeDataToFile = (filePath: string, data: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
};

const createMQConsumer = (amqpURl: string, queueName: string) => {
  return () => {
    amqp.connect(amqpURl, (errConn, conn) => {
      if (errConn) {
        console.log(errConn);

        throw errConn;
      }

      conn.createChannel((errChan, chan) => {
        if (errChan) {
          console.log(errConn);
          throw errChan;
        }

        chan.assertQueue(queueName, { durable: true });
        chan.consume(
          queueName,
          async (msg: Message | null) => {
            if (msg) {
              try {
                const parsed = JSON.parse(msg.content.toString());
                const { from, to, message } = parsed;

                if (from === EARTH_QUEUE) {
                  console.log(`Message received from Earth: ${message}`);

                  // convert message into machine code
                  const converted_msg = textToNumeric(message);
                  const payload = {
                    from,
                    to,
                    message: converted_msg
                  };

                  // sending data to the rmq queue
                  await sendMessage(
                    amqpURl,
                    MARS_QUEUE,
                    JSON.stringify(payload)
                  );

                  console.log(`Message sent to Mars: ${converted_msg}`);

                  // store all messages  into mars.json
                  const filePath = "mars.json";
                  const existingData = readDataFromFile(filePath);

                  // Update the existing data (for example, merge it with the new data)
                  const updatedData = [...existingData, payload];

                  // Store the updated data locally
                  writeDataToFile(filePath, updatedData);
                } else if (from === MARS_QUEUE) {
                  console.log(`Message received from Mars: ${message}`);

                  const converted_msg = numericToText(message);
                  const payload = {
                    from,
                    to,
                    message: converted_msg
                  };
                  // sending data to the rmq queue
                  await sendMessage(
                    amqpURl,
                    EARTH_QUEUE,
                    JSON.stringify(payload)
                  );
                  console.log(`Message sent to Earth: ${converted_msg}`);

                  // store all messages  into earth.json
                  const filePath = "earth.json";
                  const existingData = readDataFromFile(filePath);

                  // Update the existing data (for example, merge it with the new data)
                  const updatedData = [...existingData, payload];

                  // Store the updated data locally
                  writeDataToFile(filePath, updatedData);
                }
              } catch (error: any) {
                console.log({ error: error.message });
              }
            }
          },
          { noAck: true }
        );
      });
    });
  };
};

export default createMQConsumer;
