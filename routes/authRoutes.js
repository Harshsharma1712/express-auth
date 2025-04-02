import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// register user
router.post("/register", async (req, res) => {
    try {
        
        const { username, email, password  } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "Email already exist." })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a user
        const newUser = new User({username, email, password: hashedPassword});

        await newUser.save();

        res.status(201).json({ message: "User register successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = jwt.sign( {email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'} );

        res.status(200).json( 
            {token}
         )

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Profile (Protected Route)
router.get('/user', verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email }).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;