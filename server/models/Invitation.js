const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String
}, { _id: false });

const venueCardSchema = new mongoose.Schema({
  label: String,
  name: String,
  address: String,
  note: String,
  mapUrl: String
}, { _id: false });

const invitationSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  eventType: {
    type: String,
    required: true,
    enum: [
      'wedding',
      'birthday',
      'engagement',
      'babyshower',
      'corporate',
      'reunion'
    ]
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Hero
  title: {
    type: String,
    required: true
  },

  eyebrow: String,

  eventDate: String,

  location: String,

  // Story / About
  storyTitle: String,

  storyText: String,

  // Schedule
  scheduleTitle: {
    type: String,
    default: 'Schedule'
  },

  timeline: [timelineItemSchema],

  // Gallery
  photos: [{ type: String }],

  // Venue / Info cards
  infoTitle: {
    type: String,
    default: 'Venue & Details'
  },

  venues: [venueCardSchema],

  // RSVP configuration
  rsvpNote: String,

  rsvpDeadline: String,

  rsvpFields: [{
    label: String,

    type: {
      type: String,
      enum: ['text', 'number', 'select', 'textarea']
    },

    options: [String]
  }],

  // Publishing
  isPublished: {
    type: Boolean,
    default: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
invitationSchema.pre('save', async function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Invitation', invitationSchema);