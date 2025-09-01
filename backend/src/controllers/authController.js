const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

function createAccessToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '150m' },
  );
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = createAccessToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  // If using JWT stateless auth, logout is handled on client by discarding token
  res.json({ message: 'Logged out successfully' });
};
