import amqp, { Message } from "amqplib/callback_api";
import * as fs from "fs";

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
          (msg: Message | null) => {
            if (msg) {
              try {
                const parsed = JSON.parse(msg.content.toString());
                // store all messages  into data.json
                // Read existing data from the file
                const filePath = "data.json";
                const existingData = readDataFromFile(filePath);

                // Update the existing data (for example, merge it with the new data)
                const updatedData = [...existingData, parsed];

                // Store the updated data locally
                writeDataToFile(filePath, updatedData);

                console.log(`Message from Earth: ${parsed.message}`);
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
