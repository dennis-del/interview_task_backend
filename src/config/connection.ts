import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource(
  isProd
    ? {
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: false, // recommended for production
        logging: false,
        ssl: { rejectUnauthorized: false },
        entities: [path.join(__dirname, "../models/*.{js,ts}")],
        migrations: [path.join(__dirname, "../migrations/**/*.{js,ts}")],
      }
    : {
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USERNAME || process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true, // ok for local dev
        logging: true,
        entities: [path.join(__dirname, "../models/*.{ts,js}")],
        migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
      }
);



export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("🚀 Database connected successfully with TypeORM!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
