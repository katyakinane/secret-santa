# CSV Import Guide - Quick Reference

This guide helps you understand the two different CSV formats used in the Secret Santa Generator.

## Two Types of CSV Imports

### 🎁 Import #1: Wishlist CSV (Green Button)
**Purpose**: Load participants with their wishlists, addresses, and exclusions for THIS year

### 📅 Import #2: Previous Year Assignments (Gray Button)
**Purpose**: Load old assignments to prevent repeat pairings

---

## Quick Comparison

| Feature | Wishlist CSV | Previous Year CSV |
|---------|--------------|-------------------|
| **Button Color** | 🟢 Green | ⚪ Gray |
| **Button Label** | "Import Wishlist CSV" | "Import Previous Year Assignments" |
| **When to Use** | At the start, to load participants | Before generating, to avoid repeats |
| **Required Columns** | 6 columns | 5 columns |
| **Contains** | Wishlists, addresses, exclusions | Who gave to whom |
| **Year** | Current year (auto) | Specific past year |
| **How Many Files** | One per year | One per past year |

---

## Format #1: Wishlist CSV (Green Button)

### Purpose
Load your participants for the current Secret Santa event, including their wishlists and shipping addresses.

### Required Headers
```csv
Timestamp,Username,What is your name?,Any exclusions?,What would you like for Christmas this year?,Where would you like your Christmas gift sent to?
```

### Example
```csv
Timestamp,Username,What is your name?,Any exclusions?,What would you like for Christmas this year?,Where would you like your Christmas gift sent to?
2025/11/17 5:16:55 PM GMT,sofia@example.com,Sofia,,Reebok sneakers,"Dublin, Ireland"
2025/11/17 6:02:30 PM GMT,elaine@example.com,Elaine,,Hunter clogs size 7,"London, UK"
2025/11/17 6:14:51 PM GMT,rebecca@example.com,Rebecca,,"Soup maker, candles","Isle of Man"
2025/11/17 7:36:02 PM GMT,misha@example.com,Misha,Bronwyn,"Le creuset pan","London, UK"
2025/11/17 8:31:26 PM GMT,katya@example.com,Katya,Elaine;Sofia,"Kindle gift card","Dublin, Ireland"
```

### What It Does
- ✅ Loads all participants into the app
- ✅ Stores their wishlists
- ✅ Stores their shipping addresses
- ✅ Creates exclusion pairs automatically
- ✅ Ready to generate assignments

### Source
- Google Forms responses (download from Google Sheets)
- Manual spreadsheet
- Your existing `Christmas Wish List.csv` file

---

## Format #2: Previous Year Assignments (Gray Button)

### Purpose
Tell the app who gave to whom in previous years so it can avoid repeat pairings.

### Required Headers
```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
```

### Example - 2024 Assignments
```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2024,Sofia,sofia@example.com,Elaine,elaine@example.com
2024,Elaine,elaine@example.com,Rebecca,rebecca@example.com
2024,Rebecca,rebecca@example.com,Misha,misha@example.com
2024,Misha,misha@example.com,Sam,sam@example.com
2024,Sam,sam@example.com,Katya,katya@example.com
2024,Katya,katya@example.com,Sofia,sofia@example.com
```

### What It Does
- ✅ Saves historical assignment data
- ✅ Prevents same pairings for 2+ years
- ✅ Shows in "Historical Data" section
- ✅ Optionally loads participants (asks you)

### Source
- CSV files downloaded from this app in previous years
- Manual creation from old records
- The `example-2024-assignments.csv` template

---

## Step-by-Step Workflow

### Starting Fresh (No Previous Data)

1. **Import Wishlist CSV** (Green Button)
   - Upload your `Christmas Wish List.csv`
   - Participants, wishlists, addresses loaded ✓

2. **Generate Assignments**
   - Click "Generate Assignments"
   - Review the assignments

3. **Send Emails**
   - Configure EmailJS
   - Send assignment emails

4. **Save for Next Year**
   - Click "Save to CSV"
   - Downloads `secret-santa-2025.csv`
   - **Keep this file for next year!**

### With Previous Year Data (Recommended Order)

1. **Import Previous Year(s) FIRST** (Gray Button)
   - Upload `secret-santa-2024.csv` ✓
   - Upload `secret-santa-2023.csv` ✓
   - Historical data saved ✓
   - **Note**: This does NOT load participants, just saves history

2. **Import Wishlist CSV SECOND** (Green Button)
   - Upload your `Christmas Wish List.csv`
   - Participants loaded ✓
   - **Note**: This REPLACES any existing participants
   - Historical data from step 1 is PRESERVED ✓

3. **Generate Assignments**
   - Algorithm avoids 2024 and 2023 pairings
   - Respects exclusions from wishlist
   - New assignments created ✓

4. **Send Emails & Save**
   - Send emails with wishlists/addresses
   - Download 2025 assignments for next year

### ⚠️ Important: Import Order

**The order matters!**

✅ **Correct Order:**
1. Previous Year CSVs (gray button) - saves historical data
2. Wishlist CSV (green button) - loads current participants

❌ **If you import in wrong order:**
1. Wishlist CSV first
2. Previous Year CSV second
- Result: Historical data is saved correctly, but no issue!

**Bottom line:** You can import in any order, but it's clearest to import previous years first, then the wishlist. The wishlist CSV always replaces current participants (and will warn you if you already have participants loaded).

---

## Real Example: Your Family

### Your Wishlist CSV (Already Have)
```
Username: softleokoh@gmail.com, elainemlait@gmail.com, eklait@gmail.com,
          mishavaswani@gmail.com, skennaugh@ymail.com, ekaterinalait@gmail.com
Names: Sofia, Elaine, Rebecca, Misha, Sam, Katya
Exclusions: Katya → Elaine, Colman, Sofia; Misha → Bronwyn
Wishlists: [included for each person]
Addresses: [included for each person]
```

### If You Have 2024 Assignments (Example)
```
2024: Sofia → Elaine
2024: Elaine → Rebecca
2024: Rebecca → Misha
2024: Misha → Sam
2024: Sam → Katya
2024: Katya → Sofia
```

### Result When Generating 2025
```
Algorithm will:
✓ Respect exclusions (Katya can't get Elaine/Colman/Sofia, Misha can't get Bronwyn)
✓ Avoid 2024 matches (Sofia won't get Elaine again, etc.)
✓ Create new valid assignments
✓ Include wishlists and addresses in emails
```

---

## Files in Your Project

| File | Type | Use For |
|------|------|---------|
| `data/Christmas Wish List.csv` | Wishlist CSV | Import with GREEN button |
| `example-2024-assignments.csv` | Previous Year CSV | Template/example only |
| (Future) `secret-santa-2025.csv` | Previous Year CSV | Download after saving, use next year with GRAY button |

---

## Common Mistakes

### ❌ Uploading Wishlist CSV to Gray Button
**Result**: Error - missing "Year" column

**Fix**: Use the GREEN button for wishlist CSV

### ❌ Uploading Previous Year CSV to Green Button
**Result**: Error - missing required wishlist headers

**Fix**: Use the GRAY button for previous year assignments

### ❌ Multiple Years in One Previous Year CSV
**Result**: Error - "CSV contains multiple years"

**Fix**: Create separate files: `2024.csv`, `2023.csv`, `2022.csv`

### ❌ Not Keeping Downloaded CSVs
**Result**: Can't prevent repeats next year

**Fix**: Always keep the `secret-santa-YEAR.csv` file you download

---

## Quick Tips

1. **Green = New participants** (this year's wishlists)
2. **Gray = Old assignments** (last year's pairings)
3. **Import gray files first**, then green file
4. **Always download** your generated assignments
5. **Keep all downloaded CSVs** in a safe place for future years

---

## Need Help?

- Wishlist CSV format details: See `WISHLIST_CSV_FORMAT.md`
- Previous Year CSV format details: See `PREVIOUS_YEAR_CSV_FORMAT.md`
- EmailJS setup: See `EMAILJS_SETUP.md`
- General usage: See `README.md`

---

**Ready to start?**
1. Open http://localhost:3001
2. Import your `Christmas Wish List.csv` with the GREEN button
3. Generate assignments!
