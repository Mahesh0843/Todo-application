const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 10, filter = '' } = req.query;
  try {
    const tasks = await Task.find({ user: req.user, title: new RegExp(filter, 'i') })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({ title, description, user: req.user });
    await task.save();
    console.log('Task created:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user },
      { title, description, completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
