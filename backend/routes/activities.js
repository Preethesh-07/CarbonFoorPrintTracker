const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// @route   POST api/activities
// @desc    Create a new activity log
// @access  Private
router.post(
  '/',
  [
    protect,
    check('date', 'Date is required').not().isEmpty(),
    check('electricity.value', 'Electricity value must be a number').optional().isNumeric(),
    check('water.value', 'Water value must be a number').optional().isNumeric(),
    check('gas.value', 'Gas value must be a number').optional().isNumeric(),
    check('waste.value', 'Waste value must be a number').optional().isNumeric(),
    check('transport.distance', 'Transport distance must be a number').optional().isNumeric(),
    check('transport.type', 'Transport type must be valid').optional().isIn([
      'car', 'bus', 'train', 'plane', 'bicycle', 'walking', 'other'
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, electricity, water, gas, waste, transport } = req.body;

      // Create new activity
      const newActivity = new Activity({
        userId: req.user.id,
        date,
        electricity,
        water,
        gas,
        waste,
        transport
      });

      const activity = await newActivity.save();

      res.json(activity);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/activities
// @desc    Get all activities for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/activities/:id
// @desc    Get activity by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Check user
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/activities/:id
// @desc    Update an activity
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Check user
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update activity
    const { date, electricity, water, gas, waste, transport } = req.body;

    if (date) activity.date = date;
    if (electricity) activity.electricity = electricity;
    if (water) activity.water = water;
    if (gas) activity.gas = gas;
    if (waste) activity.waste = waste;
    if (transport) activity.transport = transport;

    await activity.save();

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/activities/:id
// @desc    Delete an activity
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Check user
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await activity.remove();

    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/activities/summary
// @desc    Get summary of activities (daily/weekly/monthly)
// @access  Private
router.get('/summary/:period', protect, async (req, res) => {
  try {
    const { period } = req.params;
    let startDate;
    const now = new Date();
    
    // Determine start date based on period
    switch (period) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return res.status(400).json({ msg: 'Invalid period. Use daily, weekly, or monthly.' });
    }

    // Get activities for the period
    const activities = await Activity.find({
      userId: req.user.id,
      date: { $gte: startDate }
    });

    // Calculate totals
    const summary = {
      period,
      totalActivities: activities.length,
      totalCO2: 0,
      electricity: { total: 0, co2: 0 },
      water: { total: 0, co2: 0 },
      gas: { total: 0, co2: 0 },
      waste: { total: 0, co2: 0 },
      transport: { total: 0, co2: 0 }
    };

    activities.forEach(activity => {
      summary.totalCO2 += activity.totalCO2;
      summary.electricity.total += activity.electricity.value;
      summary.electricity.co2 += activity.electricity.co2Equivalent;
      summary.water.total += activity.water.value;
      summary.water.co2 += activity.water.co2Equivalent;
      summary.gas.total += activity.gas.value;
      summary.gas.co2 += activity.gas.co2Equivalent;
      summary.waste.total += activity.waste.value;
      summary.waste.co2 += activity.waste.co2Equivalent;
      summary.transport.total += activity.transport.distance;
      summary.transport.co2 += activity.transport.co2Equivalent;
    });

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;