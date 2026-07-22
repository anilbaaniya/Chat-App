import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";

dotenv.config({ path: "./config.env" });

connectDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
