const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '150m' },
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh',
    { expiresIn: '7d' },
  );
};

async function register({
  name,
  email,
  password,
  role = 'EMPLOYEE',
  hourlyRate = 0,
  manager = null,
}) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already exists');

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    role,
    hourlyRate,
    manager,
  });

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // Only return safe user details
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { accessToken, refreshToken, user: safeUser };
}

module.exports = { register, login, createAccessToken, createRefreshToken };
