// import "dotenv/config";
// import { connectRedis } from "../src/config/redis.js";

import app from "../src/server.js";

const PORT = Number(process.env.PORT) || 3000;

// async function startServer() {
//     try {
//         await connectRedis();

//         const { default: app } = await import("../src/server.js");

//         app.listen(PORT, () => {
//             console.log(`SERVER running on ${PORT}`);
//         });

//     } catch (error) {
//         console.error("Failed to start server:", error);
//         process.exit(1);
//     }
// }

// startServer();

export default app;