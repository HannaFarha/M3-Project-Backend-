require("dotenv").config();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middlewares/route.guard.middleware");

const router = require("express").Router();

const SALT_ROUNDS = Math.floor(Math.random() * 15);
//sign up
router.post("/signup", async (req, res) => {
  const payload = req.body; //get name email password
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = bcrypt.hashSync(payload.password, salt); //encode the password
  
  const userToRegister = {
    email: payload.email,
    name: payload.name,
    passwordHash,
  }; //register
  try {
    const newUser = await User.create(userToRegister);
    res.status(201).json({ message: "user has created an acount", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//login
router.post('/login', async (req, res) => {
    const payload = req.body // { email, password }
    try {
      const potentialUser = await User.findOne({ email: payload.email.toLowerCase().trim() })
  
      if (potentialUser) {
        // User matching the email
        if (bcrypt.compareSync(payload.password, potentialUser.passwordHash)) {
          // Password is correct
          const authToken = jwt.sign(
            {
              userId: potentialUser._id,
            },
            process.env.TOKEN_SECRET,
            {
              algorithm: 'HS256',
              expiresIn: '6h',
            }
          )
          res.status(200).json({ token: authToken })
        } else {
          // Incorrect password
          res.status(403).json({ message: 'Incorrect password' })
        }
      } else {
        // No user matching the email
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  })
  
  router.get('/verify', isAuthenticated, async (req, res) => {
    console.log(req.tokenPayload)
    const currentUser = await User.findById(req.tokenPayload.userId)
    res.status(200).json(currentUser)
  })

module.exports = router;
