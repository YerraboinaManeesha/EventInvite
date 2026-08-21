// Single source of truth for event-type metadata, used by both server (defaults/validation)
// and client (theme + form rendering). Kept as plain JSON-serializable objects.

const EVENT_TYPES = {
  wedding: {
    label: 'Wedding',
    icon: '💍',
    tagline: 'Ceremony, schedule & RSVP',
    theme: {
      bg: '#FAF5EC', card: '#FCFAF4', ink: '#2E2A24',
      accent: '#A9803F', accent2: '#7A2E33', line: 'rgba(46,42,36,0.14)',
      display: "'Cormorant Garamond', serif", body: "'EB Garamond', serif"
    },
    defaultEyebrow: 'Together with their families',
    scheduleTitle: 'Schedule',
    infoTitle: 'Venue & Travel',
    formFields: [
      { label: 'Bride & Groom Names', name: 'title', type: 'text', required: true, placeholder: 'e.g. Anaya & Vikram' },
      { label: 'Wedding Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: 'Saturday, 14 Feb 2026 · 4:00 PM' },
      { label: 'City / Short Location', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'Our Story (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'How you met, a favourite memory...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Number of Guests', type: 'number' },
      { label: 'Attending', type: 'select', options: ['Joyfully accepts', 'Regretfully declines'] },
      { label: 'Meal Preference', type: 'text' },
      { label: 'Message to the Couple', type: 'textarea' }
    ]
  },
  birthday: {
    label: 'Birthday',
    icon: '🎂',
    tagline: 'Milestone birthdays & parties',
    theme: {
      bg: '#FFF7EE', card: '#FFFDF8', ink: '#2E2A24',
      accent: '#D6572C', accent2: '#1F7A6C', line: 'rgba(46,42,36,0.12)',
      display: "'Fraunces', serif", body: "'Space Grotesk', sans-serif"
    },
    defaultEyebrow: "You're invited to celebrate",
    scheduleTitle: 'Running Order',
    infoTitle: 'Venue Details',
    formFields: [
      { label: 'Party Title', name: 'title', type: 'text', required: true, placeholder: "e.g. Rehan Turns 30!" },
      { label: 'Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: 'Saturday, 6 Dec 2026 · 7:00 PM' },
      { label: 'City / Short Location', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'About the Bash (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'Dress code, theme, what to expect...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Number of Guests', type: 'number' },
      { label: 'Attending', type: 'select', options: ["Count me in!", "Can't make it"] },
      { label: 'Song Request', type: 'text' }
    ]
  },
  engagement: {
    label: 'Engagement / Anniversary',
    icon: '💕',
    tagline: 'Celebrate your next chapter',
    theme: {
      bg: '#FBF3F4', card: '#FEF9FA', ink: '#2E2A24',
      accent: '#B5788C', accent2: '#5C2A3A', line: 'rgba(46,42,36,0.12)',
      display: "'Cormorant Garamond', serif", body: "'EB Garamond', serif"
    },
    defaultEyebrow: 'Celebrating our next chapter',
    scheduleTitle: 'Evening Plan',
    infoTitle: 'Venue & Travel',
    formFields: [
      { label: 'Couple Names', name: 'title', type: 'text', required: true, placeholder: 'e.g. Meera & Aditya' },
      { label: 'Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: '21 March 2026 · 6:00 PM' },
      { label: 'City / Short Location', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'Backstory (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'How the proposal happened, or years together...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Number of Guests', type: 'number' },
      { label: 'Attending', type: 'select', options: ['Yes, joyfully', "Sorry, can't make it"] },
      { label: 'Message', type: 'textarea' }
    ]
  },
  babyshower: {
    label: 'Baby Shower / Naming',
    icon: '🍼',
    tagline: 'Welcome the new arrival',
    theme: {
      bg: '#F6F8F3', card: '#FCFDFA', ink: '#2E2A24',
      accent: '#C79FB0', accent2: '#5F8D7B', line: 'rgba(46,42,36,0.12)',
      display: "'Fraunces', serif", body: "'EB Garamond', serif"
    },
    defaultEyebrow: 'A little one is on the way',
    scheduleTitle: 'Afternoon Plan',
    infoTitle: 'Venue Details',
    formFields: [
      { label: "Baby's Name / Parents' Names", name: 'title', type: 'text', required: true, placeholder: "e.g. Baby Sharma's Shower" },
      { label: 'Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: 'Sunday, 10 May 2026 · 4:00 PM' },
      { label: 'City / Short Location', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'About (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'Due date, sweet note, or reveal theme...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Number of Guests', type: 'number' },
      { label: 'Attending', type: 'select', options: ['Will be there', "Can't make it"] },
      { label: 'Well Wishes', type: 'textarea' }
    ]
  },
  corporate: {
    label: 'Corporate Event',
    icon: '💼',
    tagline: 'Conferences, launches & offsites',
    theme: {
      bg: '#F5F7FA', card: '#FFFFFF', ink: '#1B2333',
      accent: '#2C5DAA', accent2: '#16213E', line: 'rgba(27,35,51,0.12)',
      display: "'Space Grotesk', sans-serif", body: "'Space Grotesk', sans-serif"
    },
    defaultEyebrow: "You're invited",
    scheduleTitle: 'Agenda',
    infoTitle: 'Venue & Logistics',
    formFields: [
      { label: 'Event Name', name: 'title', type: 'text', required: true, placeholder: 'e.g. Product Launch 2026' },
      { label: 'Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: 'Thursday, 12 Nov 2026 · 9:00 AM' },
      { label: 'City / Venue Area', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'Event Description (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'What the event covers, who it is for...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Company / Designation', type: 'text' },
      { label: 'Attending', type: 'select', options: ['Confirmed', "Can't attend"] },
      { label: 'Dietary Requirements', type: 'text' }
    ]
  },
  reunion: {
    label: 'Reunion',
    icon: '🤗',
    tagline: 'Family or college gatherings',
    theme: {
      bg: '#FAF6EC', card: '#FEFCF6', ink: '#2E2A24',
      accent: '#B98A3E', accent2: '#3E5C3E', line: 'rgba(46,42,36,0.12)',
      display: "'Fraunces', serif", body: "'EB Garamond', serif"
    },
    defaultEyebrow: "It's been too long",
    scheduleTitle: 'Evening Plan',
    infoTitle: 'Venue Details',
    formFields: [
      { label: 'Reunion Title', name: 'title', type: 'text', required: true, placeholder: 'e.g. Batch of 2016 Reunion' },
      { label: 'Date & Time', name: 'eventDate', type: 'text', required: true, placeholder: 'Saturday, 26 Dec 2026 · 6:00 PM' },
      { label: 'City / Short Location', name: 'location', type: 'text', required: true, placeholder: 'Hyderabad' },
      { label: 'Why We\'re Gathering (optional)', name: 'storyText', type: 'textarea', required: false, placeholder: 'A nostalgic note...' }
    ],
    rsvpFields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Batch / Relation', type: 'text' },
      { label: 'Number of Guests', type: 'number' },
      { label: 'Attending', type: 'select', options: ['Count me in', "Can't make it"] }
    ]
  }
};

module.exports = { EVENT_TYPES };
