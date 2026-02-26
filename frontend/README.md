# WISSEN Technology – Seat Booking System

## Quick Start

```bash
npm install
npm run dev
```

---

## Folder Structure

```
wissen-booking/
├── index.html                        # HTML shell
├── vite.config.js                    # Vite + React plugin
├── package.json
└── src/
    ├── main.jsx                      # ReactDOM entry point
    ├── App.jsx                       # Root – wires layout + pages + providers
    │
    ├── data/
    │   └── index.js                  # Static data: SPOTS, MEMBERS, BATCH_SCHEDULE
    │
    ├── utils/
    │   └── index.js                  # Pure helpers: dateStr, isWorkingDay, formatDate …
    │
    ├── hooks/
    │   └── index.js                  # useClock · useNotification · useDateSelector
    │
    ├── context/
    │   └── BookingContext.jsx        # Global state: bookings, released seats, floaters
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx            # Top bar – brand + clock + floater status
    │   │   ├── Navbar.jsx            # Tab navigation
    │   │   └── DateSelector.jsx      # Horizontal date chip strip
    │   └── ui/
    │       ├── GlobalStyles.jsx      # <style> tag injected once at root
    │       ├── Notification.jsx      # Toast messages (success / error)
    │       ├── FloaterBookingModal.jsx  # Modal to pick a floater seat
    │       ├── SpotCard.jsx          # Spot tile with 8-seat grid (used in FloorPlan)
    │       └── MemberAvatar.jsx      # Initials avatar, batch-coloured
    │
    └── pages/
        ├── DashboardPage.jsx         # Stats + batch schedules + floater panel
        ├── FloorPlanPage.jsx         # All 10 spot cards in a responsive grid
        ├── MyBookingPage.jsx         # Member selector + 14-day booking rows
        └── MembersPage.jsx           # All 80 members with live booking status
```

---

## Business Rules Implemented

| Rule | Where |
|------|-------|
| 50 seats / 10 spots / 8 per spot | `data/index.js` |
| Batch 1: Week1 Mon–Wed, Week2 Thu–Fri | `data/index.js` + `utils/index.js` |
| Batch 2: Cyclic opposite | same |
| 10 buffer floater seats always available | `context/BookingContext.jsx` |
| Designated seat bookable anytime (up to 14 days) | `MyBookingPage.jsx` |
| Floater booking only after 3:00 PM | `FloaterBookingModal.jsx` + `BookingContext` |
| Non-working members can only book floater for next day (today) | `MyBookingPage.jsx` |
| Release seat → becomes floater (11th+) | `BookingContext.releaseDesignatedSeat` |
| 1 employee = 1 seat per day | enforced in `bookDesignatedSeat` + `bookFloaterSeat` |
