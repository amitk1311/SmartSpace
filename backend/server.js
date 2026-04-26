import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-env";

await mongoose.connect(process.env.MONGO_URI);

// ============= SCHEMAS =============

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  joinedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  createdAt: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  availabilityStatus: { type: String, enum: ["available", "occupied", "unavailable"], default: "available" },
  createdAt: { type: Date, default: Date.now },
});

const spaceSchema = new mongoose.Schema({
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["Cafeteria", "Lecture Hall", "Seminar Hall", "Open Ground", "Parking Area"], required: true },
  capacity: { type: Number, required: true },
  open: String,
  close: String,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
  tableNumber: { type: Number, default: null },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // "HH : MM AM/PM"
  endTime: { type: String, required: true },   // "HH : MM AM/PM"
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Community = mongoose.model("Community", communitySchema);
const Space = mongoose.model("Space", spaceSchema);
const Room = mongoose.model("Room", roomSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ============= MIDDLEWARE =============

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ============= HELPER FUNCTIONS =============

const isValidEmail = (email) => {
  // Check Gmail domain only and valid format
  const gmailRegex = /^[a-zA-Z0-9._%-]+@gmail\.com$/;
  return gmailRegex.test(email.toLowerCase());
};

const isStrongPassword = (password) => {
  return password.length >= 8;
};

const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length < 4) return null;
  
  const hour = parts[0];
  const minute = parts[2];
  const period = parts[3];
  
  let h = Number(hour);
  if (h === 12) h = 0;
  if (period === "PM") h += 12;
  return h * 60 + Number(minute);
};

// ============= HEALTH CHECK =============

app.get("/", (req, res) => {
  res.json({ message: "SmartSpace API running", status: "ok" });
});

// ============= AUTH ROUTES =============

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please use a valid Gmail address (e.g., yourname@gmail.com)" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      joinedCommunities: [],
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= COMMUNITY ROUTES =============

app.get("/api/communities", async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
    res.json(communities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/communities", verifyToken, async (req, res) => {
  try {
    const { name, code, description, category } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Community.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: "Community code already exists" });
    }

    const community = new Community({
      name,
      code: code.toUpperCase(),
      description,
      category: category || "General",
      ownerId: req.userId,
      members: [req.userId],
    });
    await community.save();

    // Add to user's joined communities
    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCommunities: community._id },
    });

    res.status(201).json(community);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/communities/:communityId", async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
      .populate("ownerId", "name email")
      .populate("members", "name email");
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(community);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/communities/:communityId/join", verifyToken, async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.includes(req.userId)) {
      return res.status(400).json({ message: "Already a member of this community" });
    }

    community.members.push(req.userId);
    await community.save();

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { joinedCommunities: communityId } },
      { new: true }
    );

    res.json({ message: "Joined community successfully", community });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/communities/:communityId/leave", verifyToken, async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.ownerId.toString() === req.userId) {
      return res.status(403).json({ message: "Owner cannot leave their own community" });
    }

    community.members = community.members.filter(
      (id) => id.toString() !== req.userId
    );
    await community.save();

    await User.findByIdAndUpdate(req.userId, {
      $pull: { joinedCommunities: communityId },
    });

    res.json({ message: "Left community successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/communities/:communityId", verifyToken, async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Only owner can delete community" });
    }

    // Delete all spaces and rooms in this community
    const spaces = await Space.find({ communityId });
    for (const space of spaces) {
      await Room.deleteMany({ spaceId: space._id });
      await Booking.deleteMany({ spaceId: space._id });
    }
    await Space.deleteMany({ communityId });

    // Delete all bookings in this community
    await Booking.deleteMany({ communityId });

    // Remove from all users' joinedCommunities
    await User.updateMany(
      {},
      { $pull: { joinedCommunities: communityId } }
    );

    // Delete the community
    await Community.findByIdAndDelete(communityId);

    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= SPACE ROUTES =============

app.get("/api/communities/:communityId/spaces", async (req, res) => {
  try {
    const { communityId } = req.params;

    const spaces = await Space.find({ communityId })
      .populate("createdBy", "name email")
      .populate("rooms");

    // Fetch today's confirmed bookings for all these spaces
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const spaceIds = spaces.map(s => s._id);

    const bookings = await Booking.find({
      spaceId: { $in: spaceIds },
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: "confirmed"
    });

    // Attach bookings to spaces
    const spacesWithBookings = spaces.map(space => {
      const spaceObj = space.toObject();
      spaceObj.todayBookings = bookings.filter(b => b.spaceId.toString() === space._id.toString());
      return spaceObj;
    });

    res.json(spacesWithBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/communities/:communityId/spaces", verifyToken, async (req, res) => {
  try {
    const { communityId } = req.params;
    const { name, description, type, capacity, open, close } = req.body;

    if (!name || !type || !capacity || !open || !close) {
      return res.status(400).json({ message: "Name, type, capacity, open, and close times are required" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Only owner can create spaces
    if (community.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Only community owner can create spaces" });
    }

    // Validate time format
    const timeRegex = /^\d{2}\s:\s\d{2}\s(AM|PM)$/;
    if (!timeRegex.test(open) || !timeRegex.test(close)) {
      return res.status(400).json({ message: "Invalid time format. Expected: 'HH : MM AM/PM'" });
    }

    const openMinutes = timeToMinutes(open);
    const closeMinutes = timeToMinutes(close);

    if (closeMinutes <= openMinutes) {
      return res.status(400).json({ message: "Closing time must be after opening time" });
    }

    const space = new Space({
      communityId,
      name,
      description: description || "",
      type,
      capacity,
      open,
      close,
      createdBy: req.userId,
      rooms: [],
    });
    await space.save();

    res.status(201).json(space);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/spaces/:spaceId", verifyToken, async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    if (space.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only creator can delete space" });
    }

    // Delete all rooms and bookings
    await Room.deleteMany({ spaceId });
    await Booking.deleteMany({ spaceId });
    await Space.findByIdAndDelete(spaceId);

    res.json({ message: "Space deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= ROOM ROUTES =============

app.post("/api/spaces/:spaceId/rooms", verifyToken, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { name, capacity, amenities } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: "Room name and capacity are required" });
    }

    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Only creator of space can add rooms
    if (space.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only space creator can add rooms" });
    }

    const room = new Room({
      spaceId,
      name,
      capacity,
      amenities: amenities || [],
      availabilityStatus: "available",
    });
    await room.save();

    space.rooms.push(room._id);
    await space.save();

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/rooms/:roomId", verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const space = await Space.findById(room.spaceId);
    if (space.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Only space creator can delete rooms" });
    }

    // Delete all bookings for this room
    await Booking.deleteMany({ roomId });

    space.rooms = space.rooms.filter((id) => id.toString() !== roomId);
    await space.save();

    await Room.findByIdAndDelete(roomId);

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= BOOKING ROUTES =============

app.get("/api/bookings/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== req.userId) {
      return res.status(403).json({ message: "Cannot view other users' bookings" });
    }

    const bookings = await Booking.find({ userId })
      .populate("communityId", "name")
      .populate("spaceId", "name")
      .populate("roomId", "name")
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const { communityId, spaceId, roomId, tableNumber, bookingDate, startTime, endTime } = req.body;

    if (!communityId || !spaceId || !bookingDate || !startTime) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // Verify user is a member of the community
    const community = await Community.findById(communityId);
    if (!community.members.includes(req.userId)) {
      return res.status(403).json({ message: "You are not a member of this community" });
    }

    // Verify space exists and belongs to community
    const space = await Space.findById(spaceId);
    if (!space || space.communityId.toString() !== communityId) {
      return res.status(404).json({ message: "Space not found in this community" });
    }

    // Validate times
    const startMinutes = timeToMinutes(startTime);
    let finalEndTime = endTime;
    let endMinutes = timeToMinutes(endTime);

    if (space.type === "Cafeteria") {
      if (!tableNumber) {
        return res.status(400).json({ message: "Table number is required for cafeteria bookings" });
      }
      // Force 1-hour limit
      endMinutes = startMinutes + 60;
      let h = Math.floor(endMinutes / 60);
      let m = endMinutes % 60;
      let p = "AM";
      if (h >= 12) {
        p = "PM";
        if (h > 12) h -= 12;
      }
      if (h === 0) h = 12;
      finalEndTime = `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} ${p}`;
    } else {
      if (!endTime) {
        return res.status(400).json({ message: "End time is required for this space" });
      }
    }

    const spaceCloseMinutes = timeToMinutes(space.close);

    if (startMinutes >= endMinutes) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    if (endMinutes > spaceCloseMinutes) {
      return res.status(400).json({ message: "Booking extends beyond space closing time" });
    }

    // Check for booking conflicts
    const query = {
      communityId,
      spaceId,
      bookingDate: new Date(bookingDate),
      status: "confirmed",
    };

    if (roomId) {
      query.roomId = roomId;
    }
    if (tableNumber) {
      query.tableNumber = tableNumber;
    }

    const conflictingBookings = await Booking.find(query);

    for (const booking of conflictingBookings) {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);

      // Check if times overlap
      if (startMinutes < bookingEnd && endMinutes > bookingStart) {
        return res.status(409).json({ 
          message: "This space/room/table is already booked for the selected time slot" 
        });
      }
    }

    // Create booking
    const booking = new Booking({
      userId: req.userId,
      communityId,
      spaceId,
      roomId: roomId || null,
      tableNumber: tableNumber || null,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime: finalEndTime,
      status: "confirmed",
    });
    await booking.save();

    // Create a notification for the community owner
    // We only notify if the owner is not the one booking
    if (community.ownerId.toString() !== req.userId) {
      const notification = new Notification({
        userId: community.ownerId,
        message: `One new booking in ${space.name}`,
      });
      await notification.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/bookings/:bookingId/cancel", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Can only cancel your own bookings" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/spaces/:spaceId/bookings/:date", async (req, res) => {
  try {
    const { spaceId, date } = req.params;

    const bookings = await Booking.find({
      spaceId,
      bookingDate: new Date(date),
      status: "confirmed",
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= DASHBOARD ROUTES =============

app.get("/api/dashboard", verifyToken, async (req, res) => {
  try {
    // Find communities the user is a member of
    const user = await User.findById(req.userId);
    const joinedCommunityIds = user.joinedCommunities;

    // Find all spaces in those communities
    const spaces = await Space.find({ communityId: { $in: joinedCommunityIds } }).populate("communityId", "name");

    const spaceIds = spaces.map(s => s._id);

    // Get today's bookings for these spaces
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      spaceId: { $in: spaceIds },
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: "confirmed"
    }).populate("spaceId", "name capacity open close");

    res.json({ spaces, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= NOTIFICATION ROUTES =============

app.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/notifications/mark-read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= ERROR HANDLING =============

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ============= START SERVER =============

app.listen(4000, () => console.log("SmartSpace API running on http://localhost:4000"));
