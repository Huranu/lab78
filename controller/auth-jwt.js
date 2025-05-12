const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'SECRET123',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'REFRESH_SECRET123',
      { expiresIn: '7d' }
    );

    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      expires_in: '1h',
      tokenType: 'Bearer',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ error: 'Validation failed' });
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

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'SECRET123',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'REFRESH_SECRET123',
      { expiresIn: '7d' }
    );

    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    res.json({
      accessToken,
      refreshToken,
      expires_in: '1h',
      tokenType: 'Bearer',
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

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return res.status(401).json({ error: 'Refresh token has expired' });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'REFRESH_SECRET123'
    );

    const newAccessToken = jwt.sign(
      { userId: storedToken.user.id },
      process.env.JWT_SECRET || 'SECRET123',
      { expiresIn: '1h' }
    );

    res.json({
      accessToken: newAccessToken,
      expires_in: '1h',
      tokenType: 'Bearer',
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid refresh token' });
  }
};

module.exports = { signup, login, refreshToken, logout };