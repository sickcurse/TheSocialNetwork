const { User, Thought } = require('../models');

const userController = {
  // Fetch all users
  async fetchAllUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      res.json(users);
    } catch (error) {
      console.error(`[Error]: Failed to retrieve users - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Fetch a single user by ID
  async fetchSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'Oops, no user found with this ID!' });
      }

      res.json(user);
    } catch (error) {
      console.error(`[Error]: Failed to retrieve user - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Create a new user
  async createNewUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (error) {
      console.error(`[Error]: User creation failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Update an existing user
  async updateExistingUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(`[Error]: User update failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Delete a user and their associated thoughts
  async deleteExistingUser(req, res) {
    try {
      const userToDelete = await User.findOneAndDelete({ _id: req.params.userId });

      if (!userToDelete) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      // Delete all associated thoughts of the user
      await Thought.deleteMany({ _id: { $in: userToDelete.thoughts } });

      res.json({ message: 'User and associated thoughts successfully deleted!' });
    } catch (error) {
      console.error(`[Error]: User deletion failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Add a friend to the user's friend list
  async addNewFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(`[Error]: Failed to add friend - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Remove a friend from the user's friend list
  async removeExistingFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(`[Error]: Failed to remove friend - ${error.message}`);
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
