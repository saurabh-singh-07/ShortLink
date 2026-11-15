import { Pool } from 'pg';
export const pool = new Pool({
    connectionString: process.env.DB_URL
});
pool.on("connect", () => {
    console.log("postgre Database connected");
});
pool.on("error", (err) => {
    console.log(err);
});
//# sourceMappingURL=db.js.map