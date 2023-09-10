import amqp from "amqplib/callback_api";

const sendMessage = async (
  AMQP_URL: string,
  QUEUE_NAME: string,
  message: string
) => {
  return new Promise<void>((resolve, reject) => {
    amqp.connect(AMQP_URL, (error, connection) => {
      if (error) {
        console.error("Connection Error:", error);
        reject(error); // Reject the Promise if there's an error
        return;
      }

      connection.createChannel((error, channel) => {
        if (error) {
          console.error("Channel Error:", error);
          connection.close();
          reject(error); // Reject the Promise if there's an error
          return;
        }

        channel.assertQueue(QUEUE_NAME);
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
        console.log(`Sent: ${message}`);

        setTimeout(() => {
          connection.close();
          resolve(); // Resolve the Promise when the operations are completed
        }, 500);
      });
    });
  });
};

export default sendMessage;
