const express = require('express');
const { nanoid } = require('nanoid');
const Invitation = require('../models/Invitation');
const Rsvp = require('../models/Rsvp');
const { requireAuth } = require('../middleware/auth');
const { EVENT_TYPES } = require('../eventTypes');

const router = express.Router();

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

async function generateUniqueSlug(title) {
  const base = slugify(title) || 'invite';
  let slug = `${base}-${nanoid(6)}`;
  // extremely unlikely to collide, but check anyway
  while (await Invitation.findOne({ slug })) {
    slug = `${base}-${nanoid(6)}`;
  }
  return slug;
}

// GET /api/event-types  (public config for the frontend to render forms/themes)
router.get('/event-types', (req, res) => {
  res.json(EVENT_TYPES);
});

// POST /api/invitations  (create new invitation - requires login)
router.post('/invitations', requireAuth, async (req, res) => {
  try {
    const { eventType, title, eventDate, location, storyText, timeline, venues, photos } = req.body;

    if (!EVENT_TYPES[eventType]) {
      return res.status(400).json({ error: 'Unknown event type.' });
    }
    if (!title || !eventDate || !location) {
      return res.status(400).json({ error: 'Title, date and location are required.' });
    }

    const config = EVENT_TYPES[eventType];
    const slug = await generateUniqueSlug(title);

    const invitation = await Invitation.create({
      ownerId: req.session.userId,
      eventType,
      slug,
      title,
      eyebrow: config.defaultEyebrow,
      eventDate,
      location,
      storyTitle: eventType === 'wedding' ? 'Our Story' : 'About',
      storyText: storyText || '',
      scheduleTitle: config.scheduleTitle,
      timeline: Array.isArray(timeline) ? timeline : [],
      infoTitle: config.infoTitle,
      venues: Array.isArray(venues) ? venues : [],
      photos: Array.isArray(photos) ? photos : [],
      rsvpNote: 'Kindly respond so we can plan accordingly.',
      rsvpFields: config.rsvpFields
    });

    res.status(201).json(invitation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the invitation.' });
  }
});

// GET /api/invitations/mine  (list current user's invitations)
router.get('/invitations/mine', requireAuth, async (req, res) => {
  const invites = await Invitation.find({ ownerId: req.session.userId }).sort({ createdAt: -1 });
  res.json(invites);
});

// GET /api/invitations/:id  (owner fetch by id, for editing)
router.get('/invitations/:id', requireAuth, async (req, res) => {
  const invite = await Invitation.findOne({ _id: req.params.id, ownerId: req.session.userId });
  if (!invite) return res.status(404).json({ error: 'Invitation not found.' });
  res.json(invite);
});

// PUT /api/invitations/:id  (owner update)
router.put('/invitations/:id', requireAuth, async (req, res) => {
  try {
    const invite = await Invitation.findOne({ _id: req.params.id, ownerId: req.session.userId });
    if (!invite) return res.status(404).json({ error: 'Invitation not found.' });

    const editable = ['title', 'eventDate', 'location', 'storyText', 'timeline', 'venues', 'photos', 'isPublished'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) invite[field] = req.body[field];
    });

    await invite.save();
    res.json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong updating the invitation.' });
  }
});

// DELETE /api/invitations/:id
router.delete('/invitations/:id', requireAuth, async (req, res) => {
  const invite = await Invitation.findOneAndDelete({ _id: req.params.id, ownerId: req.session.userId });
  if (!invite) return res.status(404).json({ error: 'Invitation not found.' });
  await Rsvp.deleteMany({ invitationId: invite._id });
  res.json({ ok: true });
});

// GET /api/public/invitations/:slug  (public view - no auth)
router.get('/public/invitations/:slug', async (req, res) => {
  const invite = await Invitation.findOne({ slug: req.params.slug, isPublished: true });
  if (!invite) return res.status(404).json({ error: 'This invitation could not be found.' });
  res.json(invite);
});

// POST /api/public/invitations/:slug/rsvp  (guest submits RSVP - no auth)
router.post('/public/invitations/:slug/rsvp', async (req, res) => {
  try {
    const invite = await Invitation.findOne({ slug: req.params.slug, isPublished: true });
    if (!invite) return res.status(404).json({ error: 'This invitation could not be found.' });

    const { responses } = req.body;
    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ error: 'RSVP responses are required.' });
    }

    const rsvp = await Rsvp.create({ invitationId: invite._id, responses });
    res.status(201).json({ ok: true, id: rsvp._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong submitting your RSVP.' });
  }
});

// GET /api/invitations/:id/rsvps  (owner views responses)
router.get('/invitations/:id/rsvps', requireAuth, async (req, res) => {
  const invite = await Invitation.findOne({ _id: req.params.id, ownerId: req.session.userId });
  if (!invite) return res.status(404).json({ error: 'Invitation not found.' });

  const rsvps = await Rsvp.find({ invitationId: invite._id }).sort({ submittedAt: -1 });
  res.json(rsvps);
});

// GET /api/invitations/:id/rsvps/export  (owner downloads CSV)
router.get('/invitations/:id/rsvps/export', requireAuth, async (req, res) => {
  const invite = await Invitation.findOne({ _id: req.params.id, ownerId: req.session.userId });
  if (!invite) return res.status(404).json({ error: 'Invitation not found.' });

  const rsvps = await Rsvp.find({ invitationId: invite._id }).sort({ submittedAt: 1 });

  if (rsvps.length === 0) {
    return res.status(200).type('text/csv').send('No RSVP responses yet.\n');
  }

  const columns = Array.from(
    rsvps.reduce((set, r) => {
      Object.keys(r.responses || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  const escapeCsv = (val) => {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const header = ['Submitted At', ...columns].map(escapeCsv).join(',');
  const rows = rsvps.map((r) =>
    [new Date(r.submittedAt).toLocaleString(), ...columns.map((c) => r.responses[c])]
      .map(escapeCsv)
      .join(',')
  );

  const csv = [header, ...rows].join('\n');
  res.type('text/csv').attachment(`${invite.slug}-rsvps.csv`).send(csv);
});

module.exports = router;
