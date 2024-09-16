import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
};

const register = async (req, res) => {
  const { username, email, password, firstName, lastName, age, image } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, firstName, lastName, age, image });
  await newUser.save();

  res.json(newUser);
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logged out' });
};

export {
    login,
    register,
    logout
}