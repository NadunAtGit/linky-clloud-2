const express = require("express");
const mongoose=require("mongoose");
const config=require("./config.json");
const app=express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User=require("./models/UserModel");
const Link=require("./models/LinkModel");
const {authenticateToken}=require("./utilities");
const { error, profile } = require("console");
const upload=require("./multer");
const fs=require("fs");
const path=require("path");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');


const PORT=8000;

app.use(express.json());
app.use(cors());


mongoose.connect(config.connectionString,{useNewUrlParser:true,useUnifiedTopology: true }).then(()=>{
    console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on: ${PORT}`);
        });
}).catch((error)=>{
    console.log("Database connection error:", error.message);
});

//signup api
app.post("/signup", async (req, res) => {
    const { userName, email, password, profilePicUrl } = req.body;

    // Validate required fields
    if (!userName || !email || !password || !profilePicUrl) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const isUser = await User.findOne({ email });
        const isUserName = await User.findOne({ userName });
        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        if(isUserName){
            return res.status(400).json({ error: true, message: "User Name is already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            profilePicUrl
        });

        // Save the user to the database
        await newUser.save();

        // Generate the access token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Return the response with the new user's details and access token
        return res.status(201).json({
            error: false,
            user: {
                userName: newUser.userName,
                email: newUser.email,
                profilePicUrl: newUser.profilePicUrl,
                links: newUser.links, // Default will be an empty array if not provided
                linkTreeUrl: newUser.linkTreeUrl // Default will be null if not provided
            },
            accessToken,
            message: "Account created successfully"
        });
    } catch (error) {
        console.error("Error in /signup:", error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
});

// login api
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Provide all credentials" });
    }

    try {
        // Check if user exists
        const isUser = await User.findOne({ email });

        if (!isUser) {
            return res.status(400).json({ error: true, message: "User doesn't exist" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, isUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            { userId: isUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        return res.status(200).json({
            error: false,
            message: "Login successful",
            user: {
                userName: isUser.userName,
                email: isUser.email,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Error in /login:", error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
});

//get user info
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const isUser = await User.findById(userId);
        if (!isUser) {
            return res.status(401).json({ error: true, message: "User does not exist" });
        }

        return res.json({
            user: isUser,
            message: "User retrieved successfully",
            linkTreeUrl: isUser.linkTreeUrl,  // Include linkTreeUrl
              
        });

    } catch (error) {
        console.error("Error in /get-user:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

//add link
app.post("/add-link", authenticateToken, async (req, res) => {
    const { name, url } = req.body;
    const { userId } = req.user;
  
    if (!name || !url) {
      return res.status(400).json({ error: true, message: "All fields are required." });
    }
  
    try {
      const link = new Link({
        userId,
        url,
        name,
      });
  
      await link.save();
      res.status(200).json({ link, message: "Link added successfully." });
    } catch (error) {
      console.error("Error adding link:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: true, message: error.message });
      }
      res.status(500).json({ error: true, message: "Server error." });
    }
  });

//get all link
app.get("/get-all-links", authenticateToken, async (req, res) => {
    const { userId } = req.user; // Extract userId from authenticated token
  
    try {
      // Fetch all links associated with the userId
      const links = await Link.find({ userId });
      res.status(200).json({ links, message: "Links retrieved successfully" });
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ error: true, message: "Server error occurred while retrieving links" });
    }
});

//to upload images
app.post("/upload-image",upload.single("image"),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true,message:"no image upload"});
        }
        const profilePicUrl=`http://localhost:8000/profilePics/${req.file.filename}`;
        res.status(201).json({profilePicUrl});
    }catch(error){
        res.status(500).json({error:true,message:error.message});
        console.error("Upload error:", error.response?.data || error.message);
  throw error;
    }

});


//get images
app.use("/profilePics", express.static(path.join(__dirname, "profilePics")));

//delete links
app.delete("/delete-link/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
        return res.status(400).json({ error: true, message: "Link ID is not provided" });
    }

    try {
        // Find the link with the given ID and userId
        const link = await Link.findOne({ _id: id, userId: userId });

        if (!link) {
            return res.status(404).json({ error: true, message: "Link not found" });
        }

        // Extract the profilePicUrl if it exists
        const profilePicUrl = link.profilePicUrl;

        // Delete the link from the database
        await link.deleteOne();

        // Check if the URL is a local file path
        if (profilePicUrl && profilePicUrl.startsWith("http://localhost:8000/profilePics/")) {
            const filename = path.basename(profilePicUrl);
            const filePath = path.join(__dirname, "profilePics", filename);

            // Attempt to delete the file, but ignore errors if it doesn't exist
            fs.unlink(filePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.log("Failed to delete image file:", err.message);
                }
            });
        }

        res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
        console.error("Error deleting link:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

app.post('/generate-linktree', authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        // Fetch user details to create a unique link
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a unique linktree URL based on the username
        const linkTreeUrl = `http://localhost:5173/${user.userName}`;

        // Update the user's linkTreeUrl field
        user.linkTreeUrl = linkTreeUrl;
        console.log('Generated LinkTree URL:', linkTreeUrl);
        // Save the updated user document to the database
        await user.save();

        // Return the response with the generated linkTreeUrl
        res.status(200).json({ linkTreeUrl });
    } catch (error) {
        console.error('Error generating LinkTree URL:', error);
        res.status(500).json({ message: 'Failed to generate LinkTree URL' });
    }
});

// Assuming Link and User are your Mongoose models
app.get('/get-links-by-username/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        // Find user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        // Fetch all links associated with that user
        const links = await Link.find({ userId: user._id });
        
        // Return the links as response
        res.status(200).json({ links });
    } catch (error) {
        console.error('Error fetching links by username:', error);
        res.status(500).json({ error: true, message: 'Server error occurred while fetching links' });
    }
});



  




  





  
  
  






