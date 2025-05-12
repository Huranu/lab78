const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fname: Joi.string().max(50).allow('', null),
  lname: Joi.string().max(50).allow('', null),
  username: Joi.string().min(3).max(30).required(),
  phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('', null),
  image: Joi.string().uri().allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = async (req, res) => {
  const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ error: 'Validation failed', details: errorMessages });
  }

  const { email, password, fname, lname, username, phone_number, image } = value;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: hashedPassword,
      fname,
      lname,
      username,
      phone_number,
      imageUrl: image,
    };

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        username: true,
        phone_number: true,
      },
    });

    // Store user info in session
    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ error: 'Validation failed', details: errorMessages });
  }

  const { email, password } = value;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = async  (req, res) => {
    console.log('Handling logout request, session ID:', req.sessionID);
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        console.log('Session destroyed, connect.sid cookie cleared');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      console.log('No session found for logout');
      // Clear cookie even if no session exists
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      res.status(200).json({ message: 'No session to log out' });
    }
  };
  

module.exports = { signup, login, logout };