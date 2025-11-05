const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // user offering mySlot
  responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // user owning theirSlot
  mySlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // requester's slot
  theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // responder's slot
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
