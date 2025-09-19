import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || process.env.DB_USER, // Support both
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const AppDataSource = new DataSource({
  type: "postgres",
  ...dbConfig,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [path.join(__dirname, "../models/*.ts")],
  migrations: [path.join(__dirname, "../migrations/**/*.ts")],
  subscribers: [],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("🚀 Database connected successfully with TypeORM!");
    console.log("Database:", dbConfig.database);
    console.log("Host:", dbConfig.host);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};