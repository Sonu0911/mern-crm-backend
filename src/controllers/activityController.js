const ActivityLog = require('../models/ActivityLog');

exports.getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};