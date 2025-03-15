const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

// Admin user details
const adminUser = {
    userName: "admin",
    email: "admin@example.com",
    password: "admin123", // You should change this in production
    role: "admin"
};

// Connect to MongoDB
mongoose.connect("mongodb+srv://roshangehlot500:roshan99999@test.okdpt.mongodb.net/?retryWrites=true&w=majority&appName=test")
    .then(async () => {
        console.log("Connected to MongoDB");

        try {
            // Check if admin already exists
            const existingAdmin = await User.findOne({ email: adminUser.email });
            if (existingAdmin) {
                console.log("Admin user already exists!");
                process.exit(0);
            }

            // Hash the password
            const hashPassword = await bcrypt.hash(adminUser.password, 12);

            // Create new admin user
            const newAdmin = new User({
                userName: adminUser.userName,
                email: adminUser.email,
                password: hashPassword,
                role: adminUser.role
            });

            await newAdmin.save();
            console.log("Admin user created successfully!");
            console.log("Email:", adminUser.email);
            console.log("Password:", adminUser.password);

        } catch (error) {
            console.error("Error creating admin:", error);
        }

        process.exit(0);
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }); 