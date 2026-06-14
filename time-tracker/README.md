# TimeTrack — Daily Activity Tracker

A lightweight, single-file web app to track how much time you spend on daily
activities (learning, exercise, sleeping, work, reading, and more) and visualize
your habits on a dashboard.

## Features

- **Log activities** by category with hours/minutes, date, and an optional note.
- **Live timer** — start a stopwatch for the selected activity and save the
  elapsed time as an entry when you stop.
- **Dashboard** with:
  - Summary cards: total tracked, daily average, top activity, entry count.
  - **Time by activity** doughnut chart.
  - **Daily breakdown** stacked bar chart (hours per day).
  - Filter by Today / Last 7 days / Last 30 days / All time.
  - Full, deletable list of entries.
- **Export / Import** your data as JSON.
- Data is stored locally in your browser via `localStorage` — no server needed.

## Run

Just open `index.html` in any modern browser. That's it.

```bash
open index.html        # macOS
```

(Chart.js is loaded from a CDN, so an internet connection is needed the first
time for the charts to render.)

## Notes

- Sample data is seeded on first launch so the dashboard isn't empty. Delete the
  entries (or clear them) to start fresh.
- All data lives only in your browser. Use **Export JSON** to back it up or move
  it to another device.
