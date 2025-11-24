# Previous Year Assignments CSV Format

This guide explains the format for uploading previous years' Secret Santa assignments to avoid repeat pairings.

## CSV Format

Your previous year assignments CSV should have these **exact column headers**:

```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
```

## Column Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| `Year` | The year these assignments are from | **Required** | `2024` |
| `Giver Name` | Name of the person giving the gift | **Required** | `John Doe` |
| `Giver Email` | Email of the giver | **Required** | `john@example.com` |
| `Recipient Name` | Name of the person receiving the gift | **Required** | `Jane Smith` |
| `Recipient Email` | Email of the recipient | **Required** | `jane@example.com` |

## Important Rules

### Year Column
- **All rows must have the same year**
- Each CSV file should contain only one year's data
- The year is stored to check against future assignments
- Format: `2024`, `2023`, etc. (just the number)

### Email Format
- Must be valid email addresses
- Used to match participants across years
- Should match the emails in your current wishlist CSV
- Format: `user@example.com`

### Names
- Can be any format (First Last, nickname, etc.)
- Not used for matching (emails are used)
- Just for display/reference

## Example CSV File

### 2024 Assignments Example

```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2024,Sofia,sofia@example.com,Elaine,elaine@example.com
2024,Elaine,elaine@example.com,Rebecca,rebecca@example.com
2024,Rebecca,rebecca@example.com,Misha,misha@example.com
2024,Misha,misha@example.com,Sam,sam@example.com
2024,Sam,sam@example.com,Katya,katya@example.com
2024,Katya,katya@example.com,Sofia,sofia@example.com
```

### 2023 Assignments Example

```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2023,Sofia,sofia@example.com,Sam,sam@example.com
2023,Sam,sam@example.com,Rebecca,rebecca@example.com
2023,Rebecca,rebecca@example.com,Elaine,elaine@example.com
2023,Elaine,elaine@example.com,Misha,misha@example.com
2023,Misha,misha@example.com,Katya,katya@example.com
2023,Katya,katya@example.com,Sofia,sofia@example.com
```

## How to Create Previous Year CSV

### Option 1: From Saved Assignments

If you used this app last year:
1. You should have downloaded a CSV file like `secret-santa-2024.csv`
2. That file is already in the correct format!
3. Just upload it directly

### Option 2: Manual Creation

If you have previous year assignments in another format:

1. Create a new spreadsheet (Excel or Google Sheets)
2. Add the header row: `Year,Giver Name,Giver Email,Recipient Name,Recipient Email`
3. For each assignment, add a row with:
   - Year (e.g., `2024`)
   - Who gave (name and email)
   - Who received (name and email)
4. Save as CSV
5. Upload to the app

### Option 3: Convert from Other Format

If you have emails or notes:
1. Create a spreadsheet
2. Copy your assignment data
3. Organize into the 5 required columns
4. Make sure **all rows have the same year**
5. Export as CSV

## What Happens When You Import

When you upload a previous year assignments CSV:

1. ✅ **Year data is saved** to LocalStorage permanently
2. ✅ **Historical record is created** for that year
3. ✅ **Algorithm will avoid** those pairings for 2+ years
4. 📊 **Shows in "Historical Data"** section on the app

The app will:
- Parse all assignments
- Store them by year
- Use them to prevent repeats when generating new assignments
- Optionally ask if you want to load those participants

## How Repeat Avoidance Works

The app prevents repeat assignments for **2 years**:

- **Current year: 2025**
- **Will avoid**: Pairings from 2024 and 2023
- **Allowed**: Pairings from 2022 and earlier

### Example

If you upload 2024 and 2023 assignments:

**2024 CSV:**
- Sofia → Elaine

**2023 CSV:**
- Sofia → Sam

**Result in 2025:**
- Sofia **CANNOT** get Elaine (was 2024)
- Sofia **CANNOT** get Sam (was 2023)
- Sofia **CAN** get Rebecca, Misha, or Katya

## Multiple Years

You can upload multiple years by importing each file separately:

1. Upload `secret-santa-2024.csv` → saves 2024 data
2. Upload `secret-santa-2023.csv` → saves 2023 data
3. Upload `secret-santa-2022.csv` → saves 2022 data (won't affect 2025, but good for records)

Each year is stored independently in LocalStorage.

## Template

Here's a template you can copy:

```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2024,Person1 Name,person1@example.com,Person2 Name,person2@example.com
2024,Person2 Name,person2@example.com,Person3 Name,person3@example.com
2024,Person3 Name,person3@example.com,Person4 Name,person4@example.com
2024,Person4 Name,person4@example.com,Person5 Name,person5@example.com
2024,Person5 Name,person5@example.com,Person6 Name,person6@example.com
2024,Person6 Name,person6@example.com,Person1 Name,person1@example.com
```

Just replace:
- `2024` with the actual year
- `PersonX Name` with actual names
- `personX@example.com` with actual emails

## Common Errors & Solutions

### "CSV file contains multiple years"
- **Problem**: Different years in the Year column
- **Solution**: Each CSV should have only ONE year. Create separate files for each year.

### "Invalid year in CSV file"
- **Problem**: Year column has text or is empty
- **Solution**: Year must be a number (e.g., `2024`, not `Year 2024`)

### "Row X is missing required fields"
- **Problem**: One or more required columns are empty
- **Solution**: All 5 columns must be filled for every row

### "Failed to parse CSV"
- **Problem**: File format issue
- **Solution**: Make sure it's a .csv file with correct headers

## Tips

1. **Keep your downloaded CSVs** - Save the CSV files the app generates each year
2. **Consistent emails** - Use the same email addresses each year for same people
3. **Upload before generating** - Import previous years before creating new assignments
4. **Check Historical Data** - After importing, verify years show in the "Historical Data" section
5. **Download backup** - Always download and save your generated assignments

## Difference from Wishlist CSV

| Feature | Previous Year CSV | Wishlist CSV |
|---------|------------------|--------------|
| **Purpose** | Avoid repeat assignments | Load participants with wishlists |
| **Columns** | 5 columns (Year, names, emails) | 6 columns (Timestamp, Username, Name, Exclusions, Wishlist, Address) |
| **Year** | One specific year | Current year (auto-detected) |
| **Import Button** | Gray "Import Previous Year" | Green "Import Wishlist CSV" |
| **Result** | Saves historical data | Loads current participants |
| **Multiple files** | Import one per year | Import once per event |

## Quick Checklist

Before uploading your previous year CSV:

- [ ] File is in .csv format
- [ ] Has exact headers: `Year,Giver Name,Giver Email,Recipient Name,Recipient Email`
- [ ] All rows have the same year
- [ ] Year is a number (e.g., 2024)
- [ ] All emails are valid format
- [ ] No empty cells in required columns
- [ ] Each giver appears exactly once (everyone gives to exactly one person)
- [ ] Each recipient appears exactly once (everyone receives from exactly one person)

---

Need help? Check the main README.md or WISHLIST_CSV_FORMAT.md for more information.
