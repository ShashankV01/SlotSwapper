const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const router = express.Router();

/**
 * GET /api/swappable-slots
 * Return SWAPPABLE slots belonging to other users (not the current user)
 */
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: req.user._id } }).populate('owner', 'name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/swap-request
 * body: { mySlotId, theirSlotId }
 * Creates a swap request, sets both events to SWAP_PENDING
 */
router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'Missing slot IDs' });

  // Use a transaction to be safe
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mySlot = await Event.findById(mySlotId).session(session);
    const theirSlot = await Event.findById(theirSlotId).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction(); session.endSession();
      return res.status(404).json({ message: 'Slot not found' });
    }
    // Validate owners
    if (!mySlot.owner.equals(req.user._id)) {
      await session.abortTransaction(); session.endSession();
      return res.status(403).json({ message: 'You do not own mySlot' });
    }
    if (!theirSlot.owner.equals(req.body.theirOwnerId || theirSlot.owner)) {
      // no-op: we trust theirSlot.owner value
    }
    // Both must be SWAPPABLE
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction(); session.endSession();
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }
    // Create request
    const swapRequest = await SwapRequest.create([{
      requester: req.user._id,
      responder: theirSlot.owner,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: 'PENDING'
    }], { session });
    // mark both events SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });
    await session.commitTransaction(); session.endSession();
    const populated = await SwapRequest.findById(swapRequest[0]._id).populate('requester responder mySlot theirSlot');
    res.json(populated);
  } catch (err) {
    console.error(err);
    try { await session.abortTransaction(); session.endSession(); } catch {}
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/swap-requests
 * returns incoming and outgoing for current user
 */
router.get('/swap-requests', auth, async (req,res) => {
  try {
    const incoming = await SwapRequest.find({ responder: req.user._id }).populate('requester responder mySlot theirSlot');
    const outgoing = await SwapRequest.find({ requester: req.user._id }).populate('requester responder mySlot theirSlot');
    res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/swap-response/:requestId
 * body: { accept: boolean }
 * If accept => exchange owners of the two slots and set status ACCEPTED, events set BUSY
 * If reject => set REJECTED, events set SWAPPABLE
 */
router.post('/swap-response/:requestId', auth, async (req,res) => {
  const { accept } = req.body;
  const requestId = req.params.requestId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const swap = await SwapRequest.findById(requestId).session(session);
    if (!swap) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ message: 'SwapRequest not found' }); }
    if (!swap.responder.equals(req.user._id) && !swap.requester.equals(req.user._id)) {
      await session.abortTransaction(); session.endSession();
      return res.status(403).json({ message: 'Not a participant' });
    }
    if (swap.status !== 'PENDING') {
      await session.abortTransaction(); session.endSession();
      return res.status(400).json({ message: 'Request not pending' });
    }
    const mySlot = await Event.findById(swap.mySlot).session(session);
    const theirSlot = await Event.findById(swap.theirSlot).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction(); session.endSession();
      return res.status(404).json({ message: 'Slots not found' });
    }

    if (!accept) {
      swap.status = 'REJECTED';
      // revert statuses only if they were SWAP_PENDING for this request
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swap.save({ session });
      await session.commitTransaction(); session.endSession();
      return res.json({ message: 'Rejected', swap });
    }

    // ACCEPT path: swap owners
    const requesterId = swap.requester;
    const responderId = swap.responder;

    // swap the owners
    const tempOwner = mySlot.owner;
    mySlot.owner = theirSlot.owner;
    theirSlot.owner = tempOwner;

    // both become BUSY after successful swap
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    swap.status = 'ACCEPTED';
    await mySlot.save({ session });
    await theirSlot.save({ session });
    await swap.save({ session });

    await session.commitTransaction(); session.endSession();

    const populated = await SwapRequest.findById(swap._id).populate('requester responder mySlot theirSlot');
    return res.json({ message: 'Swap accepted', swap: populated });
  } catch (err) {
    console.error(err);
    try { await session.abortTransaction(); session.endSession(); } catch {}
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
