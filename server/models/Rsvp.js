const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true, index: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true }, // { "Full Name": "...", "Attending": "Yes", ... }
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rsvp', rsvpSchema);
