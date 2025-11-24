# Data Merge Behavior Guide

This document explains how the Secret Santa Generator intelligently merges data when importing CSVs in any order.

## Overview

The app now **merges** data intelligently instead of replacing it, allowing you to import files in any order without losing data.

## Key Principles

### 1. **Name-Based Matching**
- Participants are matched by **name** (case-insensitive)
- Email addresses can change between years
- The latest email is always used

### 2. **Data Priority**
- Wishlist CSV data takes priority
- Historical data is preserved
- Exclusions are combined from all sources

### 3. **Import Order Flexibility**
- Import in any order
- Data is merged intelligently
- No data loss

---

## Merging Rules

### Participant Merging

**Scenario 1: Import Previous Year, Then Wishlist**

```
Step 1: Import 2024 assignments
  - Sofia (sofia_old@gmail.com)
  - Elaine (elaine_old@gmail.com)

Step 2: Import Wishlist
  - Sofia (softleokoh@gmail.com) + wishlist + address
  - Elaine (elainemlait@gmail.com) + wishlist + address

Result:
  - Sofia → Uses NEW email (softleokoh@gmail.com)
  - Sofia → Has wishlist and address from wishlist CSV
  - Elaine → Uses NEW email (elainemlait@gmail.com)
  - Elaine → Has wishlist and address from wishlist CSV
  - Historical 2024 assignments → Preserved ✓
```

**Scenario 2: Import Wishlist, Then Previous Year**

```
Step 1: Import Wishlist
  - Sofia (softleokoh@gmail.com) + wishlist + address
  - Elaine (elainemlait@gmail.com) + wishlist + address

Step 2: Import 2024 assignments
  - Sofia (sofia_old@gmail.com)
  - Elaine (elaine_old@gmail.com)

Result:
  - Sofia → Keeps NEW email (softleokoh@gmail.com)
  - Sofia → Keeps wishlist and address ✓
  - Elaine → Keeps NEW email (elainemlait@gmail.com)
  - Elaine → Keeps wishlist and address ✓
  - Historical 2024 assignments → Preserved ✓
```

### Name Matching Logic

Names are matched **case-insensitively** and **trimmed**:

```
✓ "Sofia" matches "sofia"
✓ "Sofia" matches "SOFIA"
✓ "Sofia" matches " Sofia "
✓ "Rebecca" matches "rebecca"
✗ "Rebecca" does NOT match "Becca"
✗ "Sam" does NOT match "Samuel"
```

**Important**: Names must be spelled **exactly the same** (ignoring case/spaces) to be matched.

---

## Exclusion Pair Merging

### How It Works

1. **From Previous Year**: Exclusions are extracted from assignments
2. **From Wishlist**: Exclusions are parsed from "Any exclusions?" column
3. **Merged**: Both sets combined, duplicates removed
4. **IDs Updated**: Exclusion pairs updated to use latest email addresses

### Example

```
Previous Year Import:
  - Sofia gave to Elaine → No exclusion created
  - (Previous year data doesn't create exclusions)

Wishlist Import:
  - Katya exclusions: "Elaine;Sofia;Colman"
  - Misha exclusions: "Bronwyn"

Result:
  - Katya ↔ Elaine (excluded)
  - Katya ↔ Sofia (excluded)
  - Katya ↔ Colman (excluded)
  - Misha ↔ Bronwyn (excluded)
  - Total: 4 exclusion pairs
```

### Duplicate Prevention

Exclusions are compared by **normalized pair keys**:

```
Exclusion 1: Katya → Elaine
Exclusion 2: Elaine → Katya (duplicate, ignored)

Result: Only one pair stored (bidirectional by design)
```

---

## Email Address Updates

### The Problem

Participants' email addresses might change between years:

```
2024: Sofia used sofia_2024@gmail.com
2025: Sofia now uses softleokoh@gmail.com
```

### The Solution

1. **Match by name**: "Sofia" in 2024 = "Sofia" in 2025
2. **Update email**: Use latest email (softleokoh@gmail.com)
3. **Update exclusions**: All exclusion pairs updated to use new email
4. **Historical assignments**: Still reference old email in stored data, but matched by name during algorithm

### How Exclusion IDs Are Updated

```
Before (after importing 2024):
  Exclusion: misha_old@gmail.com ↔ bronwyn_old@gmail.com

After (importing wishlist):
  1. Find "Misha" in new participants → mishavaswani@gmail.com
  2. Find "Bronwyn" in new participants → bronwyn_new@gmail.com
  3. Update exclusion: mishavaswani@gmail.com ↔ bronwyn_new@gmail.com
```

---

## Complete Workflow Examples

### Example 1: Standard Workflow

```
1. Import secret-santa-2024.csv (previous year)
   → 6 participants loaded from history
   → Historical data saved
   → 0 exclusions (no exclusions in assignment CSVs)

2. Import Christmas Wish List.csv (wishlist)
   → 6 participants merged by name
   → Emails updated to latest
   → Wishlists and addresses added
   → 3 exclusion pairs from CSV
   → Historical data preserved

Result:
   - Participants: 6 (with latest emails, wishlists, addresses)
   - Exclusions: 3 (from wishlist CSV)
   - Historical: 2024 assignments preserved
```

### Example 2: Multiple Previous Years

```
1. Import secret-santa-2024.csv
   → Historical 2024 saved

2. Import secret-santa-2023.csv
   → Historical 2023 saved
   → 2024 data still preserved

3. Import Christmas Wish List.csv
   → Participants merged with latest data
   → Wishlists and addresses added
   → Exclusions from CSV added
   → Historical 2024 + 2023 both preserved

Result:
   - Participants: Current year with latest data
   - Exclusions: From wishlist
   - Historical: 2024 + 2023 both available for avoiding repeats
```

### Example 3: Reverse Order (Wishlist First)

```
1. Import Christmas Wish List.csv
   → 6 participants with wishlists/addresses
   → 3 exclusions from CSV

2. Import secret-santa-2024.csv
   → Participants merged (wishlist data retained)
   → Emails from wishlist retained (latest)
   → Wishlists/addresses retained
   → Historical 2024 saved
   → Exclusions remain (3 from wishlist)

Result: Same as Example 1!
```

---

## What Gets Merged vs Replaced

### ✅ Merged (Combined)

- **Participants**: By name, latest email wins
- **Exclusions**: Combined from all sources, duplicates removed
- **Historical data**: All years preserved separately

### ❌ Not Merged (Latest Wins)

For participants with the same name:
- **Email**: Latest import wins
- **Wishlist**: Latest import wins (if provided)
- **Address**: Latest import wins (if provided)

---

## Edge Cases

### Case 1: New Participant in Wishlist

```
Previous Year: Sofia, Elaine, Rebecca, Misha, Sam, Katya (6 people)
Wishlist: Sofia, Elaine, Rebecca, Misha, Sam, Katya, NewPerson (7 people)

Result: 7 participants total (NewPerson added)
```

### Case 2: Missing Participant in Wishlist

```
Previous Year: Sofia, Elaine, Rebecca, Misha, Sam, Katya (6 people)
Wishlist: Sofia, Elaine, Rebecca, Misha, Sam (5 people - Katya missing)

Result: 5 participants total (Katya not participating this year)
```

### Case 3: Name Changed

```
Previous Year: "Rebecca"
Wishlist: "Becca"

Result: Treated as 2 different people
- "Rebecca" from previous year
- "Becca" from wishlist

Solution: Use consistent names, or manually edit one of the files
```

### Case 4: Exclusion for Non-Existent Participant

```
Wishlist Exclusion: Katya excludes "Colman"
Participants: Sofia, Elaine, Rebecca, Misha, Sam, Katya (no Colman)

Result: Exclusion ignored (Colman not in participant list)
```

---

## Best Practices

### 1. **Consistent Names**
Use the exact same name spelling each year:
- ✅ "Rebecca" every year
- ❌ "Rebecca" one year, "Becca" another year

### 2. **Email Changes Are OK**
Email addresses can change; the app handles it:
- 2024: sofia_old@gmail.com
- 2025: softleokoh@gmail.com
- App matches by name, uses latest email ✓

### 3. **Import Order Doesn't Matter**
Choose what's easiest:
- Previous years first, then wishlist (recommended for clarity)
- Wishlist first, then previous years (works the same)

### 4. **Multiple Previous Years**
Import all previous years you want to avoid:
- 2024 (avoid for next 2 years)
- 2023 (avoid for next 2 years)
- 2022 (optional, won't affect 2025 but good for records)

---

## Verification

After importing, check:

1. **Participant Count**: Matches expected number
2. **Exclusion Count**: All exclusions from wishlist CSV present
3. **Historical Data Section**: Shows all imported years
4. **Email Addresses**: Latest emails shown in participant table

---

## Troubleshooting

### "Participant disappeared after import"

**Cause**: Name doesn't match exactly between files

**Solution**:
- Check name spelling in both CSVs
- Names must match exactly (case-insensitive)
- Update one file to use consistent name

### "Exclusion not working"

**Cause**: Excluded person's name doesn't match participant name

**Solution**:
- Check spelling in "Any exclusions?" column
- Must match participant names exactly
- Case doesn't matter, but spelling does

### "Email not updating"

**Cause**: Import order or name mismatch

**Solution**:
- Verify name matches in both files
- Wishlist CSV should have latest email
- Re-import wishlist CSV to force update

---

## Summary

The Secret Santa Generator now intelligently merges data:

✅ **Match by name**, not email
✅ **Use latest email** from most recent import
✅ **Combine exclusions** from all sources
✅ **Preserve historical data** across all imports
✅ **Import in any order** without data loss

This makes managing multi-year Secret Santa exchanges much easier!
