/**
 * Google Apps Script for Systematic Investments - Portfolio Review Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Click "New Project"
 * 3. Delete the default code and paste this entire file
 * 4. Click on "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy"
 * 9. Copy the Web App URL and add it to your .env.local file
 */

// Google Sheet ID - Get this from your Google Sheet URL
// Example: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Portfolio Review Leads';

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Timestamp',
        'Full Name',
        'Email',
        'Phone',
        'Age',
        'Occupation',
        'Investment Range',
        'Investment Goals',
        'Existing Investments',
        'Preferred Date',
        'Preferred Time',
        'Message',
        'Status',
        'Notes'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      newSheet.getRange(1, 1, 1, headers.length)
        .setBackground('#0A2540')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
      
      // Freeze header row
      newSheet.setFrozenRows(1);
      
      // Set column widths
      newSheet.setColumnWidth(1, 180);  // Timestamp
      newSheet.setColumnWidth(2, 150);  // Name
      newSheet.setColumnWidth(3, 200);  // Email
      newSheet.setColumnWidth(4, 120);  // Phone
      newSheet.setColumnWidth(5, 60);   // Age
      newSheet.setColumnWidth(6, 150);  // Occupation
      newSheet.setColumnWidth(7, 150);  // Investment Range
      newSheet.setColumnWidth(8, 250);  // Goals
      newSheet.setColumnWidth(9, 200);  // Existing Investments
      newSheet.setColumnWidth(10, 120); // Preferred Date
      newSheet.setColumnWidth(11, 150); // Preferred Time
      newSheet.setColumnWidth(12, 300); // Message
      newSheet.setColumnWidth(13, 100); // Status
      newSheet.setColumnWidth(14, 200); // Notes
    }
    
    // Get the sheet (either existing or newly created)
    const targetSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Prepare row data
    const rowData = [
      data.timestamp || new Date().toLocaleString(),
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.age || '',
      data.occupation || '',
      data.investmentRange || '',
      data.goals || '',
      data.existingInvestments || '',
      data.preferredDate || '',
      data.preferredTime || '',
      data.message || '',
      'New',  // Default status
      ''      // Notes (empty)
    ];
    
    // Append the data
    targetSheet.appendRow(rowData);
    
    // Get the last row number
    const lastRow = targetSheet.getLastRow();
    
    // Highlight new row
    targetSheet.getRange(lastRow, 1, 1, 14).setBackground('#FFF9E6');
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data saved successfully',
        row: lastRow 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error
    console.error('Error:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'Systematic Investments Form API is running' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send email notification for new lead
 */
function sendEmailNotification(data) {
  // Email recipient - Change to your email
  const NOTIFICATION_EMAIL = 'vivekbhande79@gmail.com';
  
  const subject = `🔔 New Portfolio Review Request - ${data.fullName}`;
  
  const body = `
New Portfolio Review Request Received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERSONAL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Age: ${data.age || 'Not provided'}
Occupation: ${data.occupation || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVESTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Investment Range: ${data.investmentRange || 'Not provided'}
Goals: ${data.goals || 'Not provided'}
Existing Investments: ${data.existingInvestments || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREFERRED SCHEDULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${data.preferredDate || 'Not specified'}
Time: ${data.preferredTime || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || 'No additional message'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${data.timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all leads in Google Sheets:
https://docs.google.com/spreadsheets/d/${SHEET_ID}

--
Systematic Investments Lead Management
  `;
  
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
    });
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}

/**
 * Create trigger to send daily summary (optional)
 * Run this function once to set up the trigger
 */
function createDailySummaryTrigger() {
  ScriptApp.newTrigger('sendDailySummary')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

/**
 * Send daily summary of new leads
 */
function sendDailySummary() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Get today's date
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-IN');
  
  // Filter today's leads
  let newLeadsCount = 0;
  let newLeadsList = [];
  
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][0]);
    if (timestamp.toLocaleDateString('en-IN') === todayStr) {
      newLeadsCount++;
      newLeadsList.push(`${data[i][1]} - ${data[i][3]} (${data[i][6]})`);
    }
  }
  
  if (newLeadsCount > 0) {
    const subject = `📊 Daily Lead Summary - ${newLeadsCount} New Lead(s) - ${todayStr}`;
    const body = `
Daily Lead Summary for ${todayStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New Leads Today: ${newLeadsCount}

${newLeadsList.map((lead, i) => `${i + 1}. ${lead}`).join('\n')}

Total Leads in Sheet: ${data.length - 1}

View all leads: https://docs.google.com/spreadsheets/d/${SHEET_ID}

--
Systematic Investments
    `;
    
    MailApp.sendEmail({
      to: 'vivekbhande79@gmail.com',
      subject: subject,
      body: body,
    });
  }
}

