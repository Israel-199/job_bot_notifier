import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Postgres");
    client.release();
  } catch (err) {
    console.error("❌ Postgres connection error:", err.message);
  }
})();

export default pool;
