import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Note from "../models/notes";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

const router = Router();
console.log("JWT_KEY:", JWT_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OtpStore {
  [email: string]: { otp: number };
}

interface EmailStore {
  [email: string]: string;
}

let otpStore: OtpStore = {};
let EmailStore: EmailStore = {};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, dob } = req.body;

    if (!name || !email || !dob) {
      return res.status(400).json({
        message: "Check if name, email, dob, are all there",
      });
    }

    const dobPattern = /^\d{1,2} [A-Za-z]+ \d{4}$/;
    if (!dobPattern.test(dob)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Please use "dd Month yyyy".' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    const user = new User({
      name,
      email,
      dob,
    });

    await user.save();

    const otp = crypto.randomInt(100000, 999999);

    otpStore[email] = { otp };

    console.log(otp);

    const mailOptions = {
      from: "adrishpinto423@gmail.com",
      to: email,
      subject: "Your OTP for Account Verification",
      text: `Your OTP for account verification is: ${otp}`,
    };

    // Send OTP
    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          return res.status(500).json({ message: "Error sending OTP", error });
        }
        return res
          .status(201)
          .json({ message: "User created successfully. OTP sent to email." });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Error signing up", error });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    if (storedOtp.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    EmailStore = {};
    EmailStore[email] = email;

    return res
      .status(200)
      .json({ message: "OTP verified successfully", email });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", error });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999);

    otpStore[email] = { otp };

    const mailOptions = {
      from: "adrishpinto423@gmail.com",
      to: email,
      subject: "Your OTP for Account Verification",
      text: `Your OTP for account verification is: ${otp}`,
    };

    // Send OTP
    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          return res.status(500).json({ message: "Error sending OTP", error });
        }
        return res
          .status(201)
          .json({ message: "User created successfully. OTP sent to email." });
      }
    );
    console.log(otp);

    return res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP", error });
  }
});

router.get("/user", async (req, res) => {
  const email = Object.keys(EmailStore);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user data", error });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users data", error });
  }
});

router.get("/emails", async (req, res) => {
  try {
    const emails = Object.keys(EmailStore);

    if (emails.length === 0) {
      return res.status(404).json({ message: "No verified emails found" });
    }

    return res.status(200).json({
      message: "Verified emails fetched successfully",
      emails: emails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching verified emails", error });
  }
});

router.post("/notes", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (token != JWT_KEY) {
      return res.status(401).json({ message: "Wrong Token Provided" });
    }

    console.log(JWT_KEY);
    const { content } = req.body;
    const emailKeys = Object.keys(EmailStore);
    const email = emailKeys[0];

    if (!email) {
      return res.status(400).json({ message: "No email found in EmailStore" });
    }

    const newNote = new Note({
      content,
      email,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
});

router.get("/notes", async (req, res) => {
  try {
    const emailKeys = Object.keys(EmailStore);
    const email = emailKeys[0];
    const notes = await Note.find({ email });
    return res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json(error);
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    if (token != JWT_KEY) {
      return res.status(401).json({ message: "Wrong Token Provided" });
    }
    const decoded = jwt.decode(token);
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
});

export default router;
