# Troubleshooting Guide

Common issues and solutions for the Secret Santa Generator.

## CSV Import Issues

### ❌ "Participants disappear after importing previous year"

**Problem:** You imported previous year assignments, clicked "Yes" to load participants, then imported wishlist CSV which replaced them.

**Solution (Fixed!):** The app no longer asks to load participants from previous year CSVs. Previous year imports now ONLY save historical data.

**Workflow:**
1. Import previous year CSV (gray button) → Historical data saved ✓
2. Import wishlist CSV (green button) → Current participants loaded ✓

---

### ❌ "Exclusions are erased after importing wishlist"

**Expected behavior:** The wishlist CSV import **replaces** all participants and exclusions with the data from the CSV.

**Why:** The wishlist CSV is your source of truth for THIS year's participants and their exclusions.

**Solution:**
- Make sure your wishlist CSV has the "Any exclusions?" column filled correctly
- The app will warn you before replacing existing data
- Historical data from previous years is PRESERVED

---

### ❌ "CSV file contains multiple years"

**Problem:** Your previous year CSV has different years in the "Year" column.

**Example of error:**
```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2024,Sofia,sofia@example.com,Elaine,elaine@example.com
2023,Elaine,elaine@example.com,Rebecca,rebecca@example.com  ← Different year!
```

**Solution:** Create separate files for each year:
- `2024-assignments.csv` (all rows have 2024)
- `2023-assignments.csv` (all rows have 2023)

---

### ❌ "Missing required fields"

**Problem:** Required columns are empty in your CSV.

**For Wishlist CSV:**
- Required: `Username` (email) and `What is your name?`
- Optional: Exclusions, Wishlist, Address

**For Previous Year CSV:**
- All 5 columns are required: Year, Giver Name, Giver Email, Recipient Name, Recipient Email

**Solution:** Check your CSV and fill in all required fields.

---

### ❌ "Failed to parse CSV"

**Common causes:**
1. **Wrong file format** - File is .xlsx instead of .csv
2. **Incorrect headers** - Column names don't match exactly
3. **Special characters** - Unusual characters in data
4. **Encoding issues** - File not saved as UTF-8

**Solution:**
1. Re-export from Google Sheets or Excel as CSV
2. Check column headers match exactly (copy from docs)
3. Open in a text editor to check for weird characters

---

## Assignment Generation Issues

### ❌ "Could not generate valid assignments after 1000 attempts"

**Problem:** Too many constraints make it impossible to find valid assignments.

**Common causes:**
1. Too many exclusions
2. Small group with lots of historical data
3. Conflicting constraints

**Example:**
- 4 people total
- Person A excludes B and C
- Person A gave to D last year
- Result: Person A has no one to give to!

**Solutions:**
1. **Remove some exclusions** - Keep only critical ones (spouses, roommates)
2. **Expand the group** - Add more participants
3. **Clear old history** - Remove very old year data
4. **Check exclusions** - Make sure they're necessary

---

### ❌ "Same person got same assignment as last year"

**Check these:**

1. **Did you import previous year CSV?**
   - Go to "Historical Data" section
   - Verify the year shows up

2. **Is the year correct?**
   - Check "Year Selection" section
   - Make sure it's not set to a past year

3. **Are emails the same?**
   - Algorithm matches by email address
   - If someone changed email, it won't recognize them

**Solution:**
- Import previous 2 years' CSVs before generating
- Verify in "Historical Data" section
- Use consistent email addresses

---

## Email Issues

### ❌ "Emails not sending"

**Check EmailJS Configuration:**

1. **Are credentials correct?**
   - Service ID
   - Template ID
   - Public Key

2. **Is template set up?**
   - Must include all variables: `{{to_name}}`, `{{recipient_name}}`, `{{recipient_wishlist}}`, `{{recipient_address}}`

3. **Is email service connected?**
   - Check EmailJS dashboard
   - Verify Gmail/Outlook is connected

**Solution:** See `EMAILJS_SETUP.md` for complete setup instructions.

---

### ❌ "Wishlist/Address missing in emails"

**Problem:** Email template doesn't include the new variables.

**Solution:** Update your EmailJS template to include:
```
{{recipient_wishlist}}
{{recipient_address}}
```

See `EMAILJS_SETUP.md` for full template.

---

### ❌ "Emails going to spam"

**Solutions:**
1. Ask recipients to check spam folder
2. Add sender email to contacts
3. Use a professional email address for sending
4. Warm up the email service (send test emails first)

---

## Data Persistence Issues

### ❌ "My data disappeared after closing browser"

**Likely causes:**
1. **Browser privacy mode** - Incognito/Private browsing doesn't save LocalStorage
2. **Cleared browser data** - Manually cleared cache/cookies
3. **Different browser** - LocalStorage is per-browser

**Solutions:**
- Don't use private/incognito mode
- Always download CSVs as backup
- Use the same browser

---

### ❌ "Historical data is gone"

**Check:**
1. Same browser?
2. Same computer?
3. Did you clear browser data?

**Prevention:**
- Keep downloaded CSV files
- Re-import if needed

---

## UI/Display Issues

### ❌ "Can't see all participants"

**Check:**
- Scroll down in the table
- Window size (responsive design)
- Number shown at bottom (e.g., "Total participants: 6")

---

### ❌ "Exclusion pairs not showing"

**After importing wishlist CSV:**
- Check "Total exclusion pairs" count
- Verify names in CSV match exactly
- Names are case-insensitive but must be spelled the same

---

### ❌ "Generate Assignments button is disabled"

**Requirements:**
- Must have at least 2 participants
- Check participant count at bottom of section

---

### ❌ "Send Emails button is disabled"

**Requirements:**
- Must have generated assignments first
- Assignments must be visible on screen

---

## Advanced Troubleshooting

### Check Browser Console

1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Look for error messages in red
4. Share errors if asking for help

### Check LocalStorage

1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Click LocalStorage → http://localhost:3001
4. See what's stored:
   - `secret-santa-data` - Historical year data
   - `secret-santa-participants` - Current participants
   - `secret-santa-exclusions` - Current exclusions
   - `secret-santa-email-config` - EmailJS credentials

### Clear All Data (Fresh Start)

If things are really broken:

1. Open DevTools (F12)
2. Application/Storage tab
3. LocalStorage → http://localhost:3001
4. Click "Clear All" or delete individual keys
5. Refresh page
6. Re-import your CSVs

---

## Getting Help

If you're still stuck:

1. **Check the guides:**
   - `README.md` - General usage
   - `CSV_IMPORT_GUIDE.md` - CSV format comparison
   - `EMAILJS_SETUP.md` - Email setup
   - `WISHLIST_CSV_FORMAT.md` - Wishlist details
   - `PREVIOUS_YEAR_CSV_FORMAT.md` - Previous year details

2. **Check browser console** for error messages

3. **Try fresh start:**
   - Clear LocalStorage
   - Reload page
   - Re-import CSVs

4. **Check your CSV files:**
   - Open in text editor
   - Verify headers match exactly
   - Check for missing data

---

## Common Warnings (Not Errors)

These are expected and normal:

✅ **"This will replace your current X participants"**
- Shows before importing wishlist CSV
- Confirms you want to replace existing data
- Click OK to continue

✅ **"Warning: Assignments for 2025 already exist"**
- You've already saved assignments for this year
- Saving again will overwrite
- Normal if regenerating

✅ **"Year Override Active"**
- You manually changed the year
- Click "Reset to 2025" to use current year
- Normal if testing with different years

---

## Tips for Smooth Operation

1. **Always import in order:**
   - Previous years first (gray button)
   - Wishlist second (green button)

2. **Keep backups:**
   - Save downloaded CSV files
   - Keep wishlist CSV from Google Forms

3. **Test first:**
   - Try with small group
   - Send test email to yourself

4. **One year per file:**
   - Don't mix years in previous year CSVs
   - Create separate files for 2024, 2023, etc.

5. **Consistent emails:**
   - Use same email addresses each year
   - Don't change someone's email between years
