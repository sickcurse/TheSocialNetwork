const { Thought, User } = require('../models');

const thoughtController = {
  // Fetch all thoughts
  async fetchAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.json(thoughts);
    } catch (error) {
      console.error(`[Error]: Failed to retrieve thoughts - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Fetch single thought by ID
  async fetchSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'Oops, no thought found with this ID!' });
      }

      res.json(thought);
    } catch (error) {
      console.error(`[Error]: Failed to retrieve the thought - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Create a new thought
  async createNewThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);

      const userUpdate = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );

      if (!userUpdate) {
        return res.status(404).json({ message: 'Thought created but no user found with this ID!' });
      }

      res.json({ message: 'Successfully created the thought!' });
    } catch (error) {
      console.error(`[Error]: Thought creation failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Update an existing thought
  async updateExistingThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(`[Error]: Thought update failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Delete a thought
  async deleteExistingThought(req, res) {
    try {
      const thoughtToDelete = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thoughtToDelete) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }

      // Remove thought ID from user's `thoughts` array
      const userUpdate = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!userUpdate) {
        return res.status(404).json({ message: 'Thought removed, but no user found with this ID!' });
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (error) {
      console.error(`[Error]: Thought deletion failed - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Add a reaction to a thought
  async addNewReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(`[Error]: Failed to add reaction - ${error.message}`);
      res.status(500).json(error);
    }
  },

  // Remove a reaction from a thought
  async removeExistingReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID!' });
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(`[Error]: Failed to remove reaction - ${error.message}`);
      res.status(500).json(error);
    }
  },
};

module.exports = thoughtController;
