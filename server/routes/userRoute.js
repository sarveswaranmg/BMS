const express = require("express");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const EmailHelper = require("../utils/emailHelper");
const authMiddleware = require("../middlewares/authMiddlewares");
const bcrypt = require("bcrypt");
userRouter.post("/register", async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      //   res.status(400).json({ message: "User already exists" });
      return res.send({ success: false, message: "User already exists" });
    }
    // const newUser = new userModel(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();

    return res.send({
      success: true,
      message: "User registered successfully, Please login",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// async function hashPassword(password) {
//   console.time("time taken");
//   const salt = await bcrypt.genSalt(10);
//   console.log("salt", salt);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   console.log("Hashed Password ", hashedPassword);

//   console.timeEnd("time taken");
//   return hashedPassword;
// }

userRouter.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
    }
    // if (req.body.password !== user.password) {
    //   res.send({ succss: false, messge: "Invalid Password" });
    // }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res.send({ succss: false, messge: "Invalid Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);

    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

userRouter.get("/get-current-user", authMiddleware, async (req, res) => {
  console.log("headers", req.headers.authorization);
  const user = await userModel.findById(req.body.userId).select("-password");
  res.send({ success: true, message: "You are authorized", data: user });
});

const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000);
};
userRouter.patch("/forgetpassword", async (req, res) => {
  try {
    if (req.body.email == undefined) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email is required" });
    }
    const user = await UserActivation.findOne({ email: req.body.email });
    if (user == null) {
      return res
        .status(404)
        .json({ status: "fail", message: "User Not Found" });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.patch("/resetpassword/:email", async (req, res) => {
  try {
    const resetDetails = req.body;
    if (!req.params.email || !resetDetails.otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }
    const user = await userModel.findOne({ email: req.params.email });
    if (user == null) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (Date.now() > user.otpExpiry) {
      return res
        .status(401)
        .json({ success: false, message: "OTP has expired" });
    }
    user.password == resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password Reset Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = userRouter;
