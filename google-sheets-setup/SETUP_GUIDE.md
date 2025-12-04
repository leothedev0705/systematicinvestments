# Google Sheets Integration Setup Guide

This guide will help you connect the Portfolio Review form to Google Sheets so all submissions are automatically saved.

## Overview

The form data flows like this:
```
Website Form → Google Apps Script → Google Sheets
                     ↓
              Email Notification
```

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it: `Systematic Investments - Portfolio Review Leads`
4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
   The Sheet ID is the long string between `/d/` and `/edit`

---

## Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **"New Project"**
3. Name it: `Systematic Investments Form Handler`
4. Delete all the default code
5. Copy ALL the code from `google-apps-script.js` and paste it
6. Find this line at the top and replace with your Sheet ID:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
7. Click **Save** (💾 icon or Ctrl+S)

---

## Step 3: Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **"Web app"**
4. Configure:
   - **Description**: `Portfolio Review Form Handler`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
5. Click **"Deploy"**
6. Click **"Authorize access"** and follow the prompts
   - You may see a warning "This app isn't verified" - click **"Advanced"** → **"Go to (your project)"**
7. Copy the **Web app URL** that looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXX/exec
   ```

---

## Step 4: Configure Website

1. Create or edit the `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
   ```
2. Replace the URL with your actual Web App URL from Step 3
3. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

---

## Step 5: Test the Integration

1. Go to your website's Book Review page
2. Fill out the form with test data
3. Submit the form
4. Check your Google Sheet - you should see:
   - The form data in a new row
   - Headers automatically created
   - Row highlighted in light yellow
5. Check your email for the notification

---

## Google Sheet Structure

The script automatically creates these columns:

| Column | Description |
|--------|-------------|
| Timestamp | Date/time of submission |
| Full Name | Client's full name |
| Email | Email address |
| Phone | Phone number |
| Age | Client's age |
| Occupation | Job/profession |
| Investment Range | Portfolio value range |
| Investment Goals | Selected goals (comma-separated) |
| Existing Investments | Current investments |
| Preferred Date | Requested consultation date |
| Preferred Time | Requested time slot |
| Message | Additional message |
| Status | Lead status (New/Contacted/Converted) |
| Notes | Your notes about the lead |

---

## Features

### ✅ Automatic Features
- **Headers**: Created automatically on first submission
- **Formatting**: Navy header, frozen row, column widths
- **Highlighting**: New rows highlighted in yellow
- **Email Notification**: Instant email for each submission

### 📧 Email Notifications
Each submission sends an email to `info.systematic@gmail.com` with:
- All form details
- Formatted sections
- Direct link to Google Sheet

### 📊 Daily Summary (Optional)
To enable daily lead summary emails:
1. Open Google Apps Script
2. Run the `createDailySummaryTrigger` function once
3. You'll receive a summary at 9 AM daily (if there are new leads)

---

## Troubleshooting

### Form submits but no data in sheet
1. Check the Web App URL in `.env.local`
2. Verify the SHEET_ID in the Apps Script
3. Make sure the script is deployed as "Anyone" can access

### "Authorization required" error
1. Re-deploy the web app
2. Go through the authorization flow again
3. Allow all requested permissions

### Not receiving email notifications
1. Check spam folder
2. Verify the email address in the script
3. Check Apps Script execution logs: View → Executions

### CORS errors in browser console
- This is expected with `mode: "no-cors"` - the form still works
- The response won't be readable, but data is submitted

---

## Updating the Script

When you make changes to the script:
1. Save the script (Ctrl+S)
2. Go to **Deploy** → **Manage deployments**
3. Click the edit ✏️ icon
4. Select **"New version"**
5. Click **"Deploy"**

---

## Security Notes

- The Google Sheet is private (only you can see it)
- The script runs under your Google account
- Form data is encrypted in transit (HTTPS)
- No data is stored on the website server

---

## Support

If you need help with setup, contact:
- Email: info.systematic@gmail.com
- Phone: +91 82916 93953

