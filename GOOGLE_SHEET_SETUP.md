# Google Sheets Lead Integration Guide

This allows every lead submitted on the Shloka Global Education landing page to be automatically added as a new row in your Google Sheet in real time.

---

## Step 1: Create your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Name it **Shloka Global Education Leads**.
3. In Row 1, add these exact column headers:
   - **A1:** Timestamp
   - **B1:** Full Name
   - **C1:** Mobile Number
   - **D1:** Email ID
   - **E1:** Qualification
   - **F1:** Enquiry Type
   - **G1:** Course Name
   - **H1:** Course Fee
   - **I1:** Training Mode
   - **J1:** Source
   - **K1:** UTM Parameters
   - **L1:** Page URL

---

## Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor and paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var fullName = data.fullName || "";
    var mobileNumber = data.mobileNumber || "";
    var email = data.email || "";
    var qualification = data.qualification || "";
    var enquiryType = data.enquiryType || "";
    var courseName = data.courseName || "";
    var courseFee = data.courseFee || "";
    var trainingMode = data.trainingMode || "100% Online";
    var source = data.source || "Meta Ads";
    var utmParameters = data.utmParameters ? JSON.stringify(data.utmParameters) : "";
    var pageUrl = data.pageUrl || "";

    sheet.appendRow([
      timestamp,
      fullName,
      "'" + mobileNumber, // Leading quote preserves mobile number formatting
      email,
      qualification,
      enquiryType,
      courseName,
      courseFee,
      trainingMode,
      source,
      utmParameters,
      pageUrl
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Row added successfully" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** (floppy disk) icon.

---

## Step 3: Deploy as Web App
1. Click the blue **Deploy** button at top right > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill in the fields:
   - **Description:** `Shloka Leads Webhook`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(Important: Must be 'Anyone' so the website can post leads)*
4. Click **Deploy**.
5. Click **Authorize access** and choose your Google account. (If you see "Google hasn't verified this app", click *Advanced* > *Go to Untitled project (unsafe)* > *Allow*).
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`).

---

## Step 4: Add to your `.env.local`
Paste the copied Web App URL into your `.env.local` file:
```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec
```

Now every new submission will automatically populate into your Google Sheet!
