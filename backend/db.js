import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

dotenv.config({ path: path.resolve(_dirname, "config.env") });

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

export const connectDatabase = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database connection failed.");
    console.log(error.message);

    // Exit process on connection failure
    process.exit(1);
  }
};
