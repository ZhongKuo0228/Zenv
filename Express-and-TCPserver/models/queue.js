import amqp from "amqplib";

const sendToQueue = async (queue, message) => {
    try {
        const connection = await amqp.connect("amqp://127.0.0.1:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

        console.log(`Sent message to queue "${queue}":`, message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error("Error while sending message to queue:", error);
    }
};

const consumeFromQueue = async (queue, handleMessage, handleBatch) => {
    try {
        const connection = await amqp.connect("amqp://127.0.0.1:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });

        // 每次取500個資料出來排序
        channel.prefetch(500);
        console.log(`Waiting for messages in queue "${queue}"...`);

        const batchSize = 500; // 每 500 個處理一次
        const batchInterval = 500; // 每 500 毫秒檢查一次
        let batchData = [];
        let timerId = null;
        const startTimer = () => {
            timerId = setInterval(() => {
                const now = Date.now();
                const elapsed = now - (batchData[0]?.timestamp || now);

                if (batchData.length >= batchSize || elapsed >= batchInterval) {
                    handleBatch(batchData);
                    batchData = [];

                    // 記錄本次處理批次的時間戳記
                    batchData.timestamp = now;
                }
            }, batchInterval);
        };
        const stopTimer = () => {
            clearInterval(timerId);
            timerId = null;
        };

        channel.consume(queue, (msg) => {
            const message = JSON.parse(msg.content.toString());
            handleMessage(message);

            // 加上時間戳記
            message.timestamp = Date.now();

            batchData.push(message);

            // 如果計時器還沒啟動，啟動計時器
            if (!timerId) {
                startTimer();
            }

            // Acknowledge the message
            channel.ack(msg);
        });
    } catch (error) {
        console.error("Error while consuming from queue:", error);
    }
};

export { sendToQueue, consumeFromQueue };
