# Velocity Ticket

**Velocity Ticket** is a high-concurrency event ticketing platform designed to handle flash-sale-style demand without overselling. It uses a distributed job queue and locking layer to process booking requests safely, even when hundreds of users try to grab the last few seats at the same time.

---

## Features

- **Event Explorer** — browse upcoming events with live capacity and available-slot tracking
- **Race-condition-safe booking** — booking requests are queued (not processed synchronously), so seat inventory is never double-allocated under load
- **Auth flow** — user login & registration with session context on the client
- **Async ticket status tracking** — after a booking request is submitted, the client polls a status page until the job resolves (`ISSUED`, `FAILED`, etc.)
- **Email confirmations** — booked users receive a templated confirmation email
- **Load testing utility** — built-in script to simulate concurrent booking traffic and verify no overselling occurs

---

## Architecture

```
Browser (Next.js client)
     │
     ▼
Express API (routes/controllers)
     │
     ▼
BullMQ Queue (Redis) ──► Ticket Worker ──► Lock Manager ──► MongoDB
     │                         │
     │                         ▼
     │                  Email Worker ──► Nodemailer (EJS template)
     ▼
Ticket status endpoint (polled by client)
```

**Why a queue?** Instead of decrementing seat counts directly inside the HTTP request (which is prone to race conditions under load), a booking click enqueues a job. A dedicated worker pulls jobs off the queue one at a time (or with distributed locks per event), checks remaining inventory, and only then issues a ticket — guaranteeing no event is oversold even under heavy concurrent traffic.

---

## Project Structure

```
Velocity_Ticket/
├── client/                      # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── events/[id]/     # Event detail + booking page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── tickets/status/  # Async booking status page
│   │   ├── components/
│   │   │   └── ui/              # Button, Input, EventCard
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── lib/
│   │       └── apiClient.ts
│   └── ...
├── config/                      # db.js, mailer.js, queue.js, redis.js
├── controllers/                 # ticketController.js, userController.js
├── models/                      # Event.js, Ticket.js, User.js
├── routes/                      # ticketRoutes.js, userRoutes.js
├── utils/
│   ├── loadTestRunner.js        # concurrency/load testing script
│   └── lockManager.js           # distributed locking for seat allocation
├── views/emails/
│   └── ticketConfirmation.ejs
├── workers/
│   ├── emailWorker.js
│   └── ticketWorker.js
├── seeder.js                    # seed sample events into the DB
└── server.js
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Redis (local or hosted)

### 1. Clone the repo
```bash
git clone https://github.com/darshiB27/Veloity_Ticket.git
cd Veloity_Ticket
```

### 2. Install dependencies
```bash
# backend
npm install

# frontend
cd client
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
PORT=5000
```

### 4. Seed sample events (optional)
```bash
node seeder.js
```

### 5. Run the backend
```bash
node server.js
```
This also starts the `ticketWorker` and `emailWorker` processes that consume jobs from the BullMQ queue.

### 6. Run the frontend
```bash
cd client
npm run dev
```
Visit `http://localhost:3000`.

---

## Load Testing

`utils/loadTestRunner.js` simulates many concurrent booking requests against a single event to verify the locking/queue layer prevents overselling. Run it with:
```bash
node utils/loadTestRunner.js
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, Express |
| Database | MongoDB |
| Queue / Locking | Redis, BullMQ |
| Email | Nodemailer + EJS templates |

---

## Roadmap Ideas
- [ ] Admin dashboard for event management
- [ ] Seat-map style selection instead of general admission
- [ ] Payment gateway integration
- [ ] Rate limiting on booking endpoint

---
