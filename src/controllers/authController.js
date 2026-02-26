require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const issueTokens = (id) => ({
  accessToken:  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
});

const COOKIE = { httpOnly: true, secure: false, sameSite: 'Lax', maxAge: 7*24*60*60*1000 };

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Sab fields bharo' });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password });
    const tokens = issueTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('refreshToken', tokens.refreshToken, COOKIE);
    return res.status(201).json({
      accessToken: tokens.accessToken,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.log('SIGNUP ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const tokens = issueTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('refreshToken', tokens.refreshToken, COOKIE);
    return res.json({
      accessToken: tokens.accessToken,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.log('SIGNIN ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: 'Invalid refresh token' });
    const { accessToken } = issueTokens(user._id.toString());
    return res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Expired refresh token' });
  }
};

exports.logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};