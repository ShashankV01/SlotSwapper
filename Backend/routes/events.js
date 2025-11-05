const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const router = express.Router();

// GET user's events
router.get('/', auth, async (req,res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
});

// CREATE event
router.post('/', auth, async (req,res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
    const ev = await Event.create({ title, startTime, endTime, owner: req.user._id });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE event (title/start/end/status)
router.put('/:id', auth, async (req,res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (!event.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const allowed = ['title','startTime','endTime','status'];
    allowed.forEach(k => { if (req.body[k] !== undefined) event[k] = req.body[k]; });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', auth, async (req,res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (!event.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await event.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
