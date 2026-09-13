# Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya
## Yearly Activities Archive (2026) & Automated GitHub Actions Bot

This directory contains the photographic archive system for the academic year 2026.

---

### 1. How to Upload New Activity Photos

To add photos for any month in 2026:

1. Place your `.jpg` or `.png` images into:
   ```
   assets/yearly-activities/2026/<month_name>/
   ```
   Examples:
   - `assets/yearly-activities/2026/april/`
   - `assets/yearly-activities/2026/may/`
   - `assets/yearly-activities/2026/june/`
   - `assets/yearly-activities/2026/august/`
   - `assets/yearly-activities/2026/september/`
   - etc.

2. **File Naming Conventions**:
   You can use either of the following naming formats:
   - Standard format: `2026-<mon>-<day>-<event-name>-<sequence>.jpg`
     - Example: `2026-sep-05-teachers-day-01.jpg`
     - Example: `2026-sep-05-teachers-day-02.jpg`
   - Simple format: `<Month>-<Day>-<Sequence>.jpg`
     - Example: `March-1-1.jpg`
     - Example: `March-1-2.jpg`

---

### 2. Automated GitHub Actions Bot

Whenever new photos are committed and pushed to `assets/yearly-activities/2026/**`:
1. The GitHub Action `.github/workflows/update-yearly-activities.yml` automatically triggers.
2. It executes `node scripts/generate-yearly-activities.js`.
3. The script scans the folder, parses the dates, groups photos by event, sorts them chronologically, and updates `assets/yearly-activities/activities-2026.json`.
4. It automatically commits and pushes the updated manifest back to your repository using `[skip ci]`.
5. The live website automatically displays the newly uploaded activities!

---

### 3. Website Integration & Offline Support

- The website dynamically fetches `assets/yearly-activities/activities-2026.json` on load.
- If running offline or viewing locally (`file:///`), the website seamlessly falls back to the embedded 2026 data.
- Months with no uploaded photos display a clean, reassuring **"NO ACTIVITIES UPLOADED YET"** state with a direct WhatsApp enquiry button.
