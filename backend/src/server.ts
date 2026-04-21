import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";

console.log("Starting server...");

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("Starting server...");

    await connectDB(); // wait for DB

    app.listen(PORT, () => {
      console.log(`✅ Server running on ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed:", error);
  }
};

startServer();