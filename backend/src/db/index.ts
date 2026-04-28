import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async (): Promise<void> => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected:", result.rows[0].now);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ PostgreSQL connection failed:", error.message);
    } else {
      console.error("❌ PostgreSQL connection failed:", error);
    }

    process.exit(1);
  }
};