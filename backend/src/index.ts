
import "dotenv/config";
import { connectRedis } from "./config/redis";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        await connectRedis();

        const { default: app } = await import("./server");

        app.listen(PORT, () => {
            console.log(`SERVER running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
