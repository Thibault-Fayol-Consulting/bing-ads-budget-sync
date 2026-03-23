# Google Ads Budget Exporter for Bing Sync

A Google Ads Script that exports your campaign names and daily budgets to a Google Sheet. You can then use this Sheet as a reference to manually sync or automate budget updates in Microsoft Advertising.

## What It Does

- Lists all enabled Google Ads campaigns with their daily budgets
- Exports the data to a Google Sheet with a date column for historical tracking
- Sends an email confirmation after each export

## Setup

1. Create a Google Sheet and note its URL
2. In Google Ads, go to **Tools & Settings > Bulk Actions > Scripts**
3. Paste the contents of `main_en.gs` (or `main_fr.gs` for French)
4. Update the `CONFIG` values
5. Set `TEST_MODE` to `false` when ready
6. Schedule the script daily or weekly

## CONFIG Reference

| Parameter            | Type    | Default | Description                                       |
|----------------------|---------|---------|---------------------------------------------------|
| `TEST_MODE`          | Boolean | `true`  | When true, logs data but does not write to Sheet   |
| `SHEET_URL`          | String  | —       | Full URL of the destination Google Sheet           |
| `NOTIFICATION_EMAIL` | String  | —       | Email address for confirmation and error alerts    |

## How It Works

1. Iterates over all enabled campaigns using the Google Ads Scripts API
2. Collects each campaign name and daily budget amount
3. Writes all rows to the Sheet in a single batch using `setValues()` for performance
4. Sends an email summary

## Requirements

- Google Ads account with active campaigns
- A Google Sheet with edit access granted to the script
- Google Ads Scripts access

## License

MIT — Thibault Fayol Consulting
