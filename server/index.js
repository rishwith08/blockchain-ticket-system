import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Hardcoded Seed Data
const seedUsers = [
  { id: "1", email: "admin@chainticket.com", password: "admin123", role: "admin" },
  { id: "2", email: "org@chainticket.com", password: "org123", role: "organizer" },
  { id: "3", email: "user@chainticket.com", password: "user123", role: "attendee" }
];

const seedEvents = [
  {
    id: "evt-001",
    name: "Tech Fest 2026",
    title: "Tech Fest 2026",
    date: "2026-04-10",
    location: "Hyderabad",
    price: 200,
    totalTickets: 1000,
    soldTickets: 1,
    description: "Annual tech festival with workshops and talks.",
    time: "10:00",
    organizer: "Tech Committee",
    organizerEmail: "org@chainticket.com"
  },
  {
    id: "evt-002",
    name: "Music Night",
    title: "Music Night",
    date: "2026-04-15",
    location: "Bangalore",
    price: 500,
    totalTickets: 500,
    soldTickets: 0,
    description: "A night of soulful music and energetic performances.",
    time: "18:00",
    organizer: "Music Club",
    organizerEmail: "org@chainticket.com"
  }
];

// Mock database
let users = [...seedUsers];
let events = [...seedEvents];
let tickets = [
  {
    id: "TICK-SEED-1",
    ticketId: "TICK-SEED-1",
    eventId: "evt-001",
    eventName: "Tech Fest 2026",
    userId: "user@chainticket.com",
    used: false,
    purchaseDate: new Date().toISOString()
  }
];

app.get('/', (req, res) => {
  res.send('ChainTicket Backend is running!');
});

// Auth
app.post('/signup', (req, res) => {
  const { email, password, fullName, role = 'attendee' } = req.body;
  console.log(`POST /signup - email: ${email}, role: ${role}`);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: String(users.length + 1), email, password, fullName, role };
  users.push(newUser);
  res.status(201).json({ message: 'User created successfully', user: { email, role } });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`POST /login - email: ${email}`);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.status(200).json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, role: user.role }
  });
});

// Analytics for Admin
app.get('/analytics', (req, res) => {
  console.log(`GET /analytics`);
  const totalUsers = users.length;
  const totalOrganizers = users.filter(u => u.role === 'organizer').length;
  const totalEvents = events.length;
  const totalTickets = tickets.length;

  res.json({
    totalUsers,
    totalOrganizers,
    totalEvents,
    totalTickets
  });
});

// Users list for Admin
app.get('/users', (req, res) => {
  console.log(`GET /users - Count: ${users.length}`);
  res.json(users.map(({ password, ...u }) => u));
});

// Backwards compatibility
app.get('/admin/users', (req, res) => res.redirect('/users'));
app.get('/admin/stats', (req, res) => res.redirect('/analytics'));

// Events
app.get('/events', (req, res) => {
  console.log(`GET /events - Count: ${events.length}`);
  res.json(events);
});

app.post('/create-event', (req, res) => {
  console.log(`POST /create-event - title: ${req.body.title}`);
  const newEvent = {
    ...req.body,
    id: `evt-${Date.now()}`,
    soldTickets: 0
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Tickets
app.post('/buy-ticket', (req, res) => {
  const { eventId, userId, userEmail, txHash } = req.body;
  const email = userEmail || userId;
  const strEventId = String(eventId);
  console.log(`POST /buy-ticket - eventId: ${strEventId}, user: ${email}, tx: ${txHash || 'none'}`);
  
  const event = events.find(e => String(e.id) === strEventId);
  if (!event) {
    console.error(`POST /buy-ticket - Event ${strEventId} not found in:`, events.map(e => e.id));
    return res.status(404).json({ message: 'Event not found' });
  }
  
  if (event.totalTickets && event.soldTickets >= event.totalTickets) {
    return res.status(400).json({ message: 'Event sold out' });
  }

  const ticket = {
    id: `TICK-${Date.now()}`,
    ticketId: `TICK-${Date.now()}`,
    eventId: strEventId,
    eventName: event.title || event.name,
    userId: email,
    used: false,
    purchaseDate: new Date().toISOString()
  };

  tickets.push(ticket);
  event.soldTickets += 1;
  console.log(`POST /buy-ticket - Success: ${ticket.id}`);
  res.status(201).json(ticket);
});

app.get('/my-tickets', (req, res) => {
  const { email } = req.query;
  console.log(`GET /my-tickets - email: ${email}`);
  const userTickets = tickets.filter(t => t.userId === email);
  res.json(userTickets);
});

app.post('/verify-ticket', (req, res) => {
  const { ticketId } = req.body;
  console.log(`POST /verify-ticket - id: ${ticketId}`);
  const ticket = tickets.find(t => t.id === ticketId || t.ticketId === ticketId);
  if (!ticket) return res.status(404).json({ message: 'Invalid ticket' });
  if (ticket.used) return res.status(400).json({ message: 'Ticket already used' });

  ticket.used = true;
  res.json({ message: 'Ticket verified successfully', ticket });
});

// 404 Handler - MUST BE LAST
app.use((req, res) => {
  console.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.url} not found` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


