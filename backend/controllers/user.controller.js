import User from '../models/User.model.js'

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ msg: 'User deleted' });
};

export {
    getUsers,
    updateUser,
    deleteUser
}