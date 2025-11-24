# Wishlist CSV Format Guide

This guide explains how to prepare your wishlist CSV file for import into the Secret Santa Generator.

## CSV Format

Your CSV file should have these **exact column headers**:

```csv
Timestamp,Username,What is your name?,Any exclusions?,What would you like for Christmas this year?,Where would you like your Christmas gift sent to?
```

## Column Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| `Timestamp` | When the entry was created | Optional | `2025/11/17 5:16:55 PM GMT` |
| `Username` | Email address of the participant | **Required** | `john@example.com` |
| `What is your name?` | Participant's full name | **Required** | `John Doe` |
| `Any exclusions?` | Names of people they shouldn't be matched with, separated by semicolons or commas | Optional | `Jane;Bob` or `Jane,Bob` |
| `What would you like for Christmas this year?` | Their wishlist (can be multiple lines) | Optional | `New headphones, Blue sweater size M` |
| `Where would you like your Christmas gift sent to?` | Shipping address | Optional | `123 Main St, City, Country, ZIP` |

## Important Notes

### Email Addresses (Username)
- **Must be unique** for each participant
- Used as the unique identifier
- Will be used to send assignment emails
- Format: `user@example.com`

### Name
- The display name shown in assignments
- Used for matching exclusions

### Exclusions
- Can be **names** of other participants (case-insensitive matching)
- Separate multiple exclusions with **semicolons (;)** or **commas (,)**
- Examples:
  - `Sofia` - excludes one person
  - `Sofia;Elaine` - excludes two people
  - `Sofia,Elaine,Rebecca` - excludes three people
- The app will automatically create exclusion pairs in both directions

### Wishlist
- Can be multi-line text
- Will be included in the email sent to their Secret Santa
- Can include URLs, sizes, colors, etc.
- **This is what the Secret Santa sees when they get their assignment**

### Address
- Full shipping address where the gift should be sent
- Can include multiple lines
- Will be included in the assignment email
- **Important:** Make sure addresses are complete and accurate

## Example CSV

```csv
Timestamp,Username,What is your name?,Any exclusions?,What would you like for Christmas this year?,Where would you like your Christmas gift sent to?
2025/11/17 5:16:55 PM GMT,sofia@example.com,Sofia,,Reebok Club C revenge sneakers,"Dublin Road, Dundalk, Ireland"
2025/11/17 6:02:30 PM GMT,elaine@example.com,Elaine,,Hunter women's play clogs size 7 green or navy,"144a Croxted Road, London SE21 8NS, UK"
2025/11/17 6:14:51 PM GMT,rebecca@example.com,Rebecca,,"Soup Maker, Running stuff, Sea salt candles","Seaview, Isle of Man, IM9 5BG"
2025/11/17 7:36:02 PM GMT,misha@example.com,Misha,Bronwyn,"Le creuset saucepan, Padel racquet, On runners size 8","144A Croxted Road, London SE21 8NR"
```

## How to Create a Wishlist CSV

### Option 1: Google Forms → Google Sheets → CSV

This is the **recommended method** and appears to be what you're using based on your file:

1. Create a Google Form with questions:
   - Email field → "Username"
   - Short answer → "What is your name?"
   - Short answer → "Any exclusions?"
   - Paragraph → "What would you like for Christmas this year?"
   - Paragraph → "Where would you like your Christmas gift sent to?"

2. Send the form to all participants

3. Open responses in Google Sheets (Form → View responses in Sheets)

4. Download as CSV:
   - File → Download → Comma Separated Values (.csv)

5. Upload to the Secret Santa app

### Option 2: Manual Creation in Excel/Google Sheets

1. Create a new spreadsheet
2. Add the header row with exact column names (copy from above)
3. Fill in participant data row by row
4. Save/Export as CSV
5. Upload to the app

### Option 3: Edit Existing CSV

1. Open your existing wishlist CSV in Excel or Google Sheets
2. Make sure column headers match exactly
3. Verify all required fields (Username, Name) are filled
4. Save as CSV
5. Upload to the app

## What Happens When You Import

When you upload the wishlist CSV:

1. ✅ **Participants are loaded** with names, emails, wishlists, and addresses
2. ✅ **Exclusion pairs are created** automatically from the "Any exclusions?" column
3. ✅ **All data is stored** in browser LocalStorage
4. ✅ **Ready to generate** assignments immediately

The app will:
- Parse all participants
- Create exclusion pairs based on names
- Store wishlist and address with each participant
- Show you a summary of imported participants and exclusions

## Troubleshooting

### "Row X is missing required fields"
- Make sure **Username** and **What is your name?** are filled for every row
- Check for empty cells in these columns

### "Failed to parse CSV"
- Ensure column headers match exactly (including punctuation)
- Check that the file is actually a .csv file
- Try re-exporting from your spreadsheet program

### Exclusions not working
- Names in exclusions must match participant names exactly
- Check for typos or extra spaces
- Names are matched case-insensitively (Sofia = sofia = SOFIA)

### Multi-line text not showing correctly
- Make sure wishlist/address fields with multiple lines are properly quoted in the CSV
- Google Sheets and Excel handle this automatically when exporting

## Email Integration

When you generate assignments and send emails:

1. Each participant gets an email with:
   - Their assigned person's **name**
   - Their assigned person's **wishlist** (exactly as entered in the CSV)
   - Their assigned person's **shipping address** (exactly as entered)

2. Email template variables:
   - `{{to_name}}` - Giver's name
   - `{{recipient_name}}` - Recipient's name
   - `{{recipient_wishlist}}` - Recipient's wishlist from CSV
   - `{{recipient_address}}` - Recipient's address from CSV

See `EMAILJS_SETUP.md` for complete email template setup instructions.

## Privacy & Security

- All data stays in your browser's LocalStorage
- Wishlist CSV is processed client-side (not sent to any server)
- Only when you click "Send Emails" does data go to EmailJS
- You can clear browser data at any time to remove all information

## Tips for Best Results

1. **Get complete addresses** - Include apartment numbers, postal codes, countries
2. **Be specific in wishlists** - Include sizes, colors, links
3. **Double-check exclusions** - Especially for spouses, roommates, close family
4. **Test with small group first** - Import a test CSV with 3-4 people before the full group
5. **Keep a backup** - Save your wishlist CSV file in a safe place

---

Need help? Check the main README.md for more information about the Secret Santa Generator.
