import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const users = await User.find();
console.log("====== USERS IN DATABASE ======");
console.log(JSON.stringify(users, null, 2));
console.log("\nTotal users:", users.length);

await mongoose.disconnect();
