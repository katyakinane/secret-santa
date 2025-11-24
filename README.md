# Secret Santa Generator

A modern, user-friendly Secret Santa assignment generator built with Next.js and TypeScript. This app helps you organize your Secret Santa exchange with intelligent assignment generation, email sending capabilities, and historical tracking to avoid repeat matches.

## Features

- **Participant Management**: Add, edit, and remove participants with names and email addresses
- **Smart Assignment Algorithm**: Generates assignments with multiple constraints:
  - No self-assignment
  - Respects exclusion pairs (e.g., spouses, roommates)
  - Avoids repeat matches from the last 2 years
- **Year Management**: Auto-detects current year with manual override option
- **Historical Tracking**: Stores previous years' assignments in browser LocalStorage
- **CSV Import/Export**:
  - Import previous year assignments
  - Download current year assignments as CSV
- **Email Integration**: Send assignment emails via EmailJS service
- **Temporary Storage**: Work in draft mode until you're ready to save permanently

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## EmailJS Setup

To send assignment emails, you need to set up EmailJS:

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{to_name}}` - Recipient's name (the person receiving the email)
   - `{{to_email}}` - Recipient's email
   - `{{recipient_name}}` - The person they should buy a gift for

Example template:
```
Hi {{to_name}},

You are the Secret Santa for: {{recipient_name}}

Happy gifting!
```

4. Get your credentials:
   - Service ID
   - Template ID
   - Public Key

5. Enter these credentials in the app when prompted

## Usage

### Basic Workflow

1. **Set the Year**: The app auto-detects the current year, or you can override it
2. **Add Participants**: Enter names and email addresses for all participants
3. **Define Exclusion Pairs** (optional): Specify pairs who shouldn't be matched
4. **Import Previous Years** (optional): Upload CSV files from previous years to avoid repeat matches
5. **Generate Assignments**: Click to create random assignments respecting all constraints
6. **Review**: Check the generated assignments
7. **Send Emails**: Send assignment emails to all participants via EmailJS
8. **Save to CSV**: Download and permanently save the assignments

### Data Storage

- **Temporary Storage**: Participants and exclusion pairs are stored in browser LocalStorage until you clear them
- **Permanent Storage**: Year assignments are saved to LocalStorage only when you click "Save to CSV"
- **CSV Downloads**: Assignments are downloaded to your computer for backup

### CSV Format

The app uses the following CSV format:
```csv
Year,Giver Name,Giver Email,Recipient Name,Recipient Email
2024,John Doe,john@example.com,Jane Smith,jane@example.com
2024,Jane Smith,jane@example.com,Bob Johnson,bob@example.com
```

## Project Structure

```
/app
  /page.tsx           # Main application page
  /layout.tsx         # Root layout
/components
  /ParticipantForm.tsx    # Add/edit participants
  /ExclusionManager.tsx   # Manage exclusion pairs
  /AssignmentViewer.tsx   # Display generated assignments
  /YearSelector.tsx       # Year selection and historical data
/lib
  /secretSanta.ts         # Assignment generation algorithm
  /storage.ts             # LocalStorage utilities
  /csvHandler.ts          # CSV import/export
  /emailService.ts        # EmailJS integration
/types
  /index.ts               # TypeScript interfaces
```

## Technologies Used

- **Next.js 14+**: React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **EmailJS**: Email sending service
- **Papa Parse**: CSV parsing library
- **LocalStorage**: Browser-based data persistence

## Algorithm Details

The Secret Santa assignment algorithm uses a backtracking approach to find valid assignments:

1. Shuffles participants randomly
2. Attempts to assign each giver to a recipient
3. Validates each assignment against:
   - Self-assignment (not allowed)
   - Exclusion pairs (not allowed)
   - Historical data (no repeats within 2 years)
4. Retries up to 1000 times if constraints cannot be satisfied
5. Returns error if no valid assignment is possible

## Browser Compatibility

Requires a modern browser with support for:
- ES6+ JavaScript
- LocalStorage API
- Fetch API

## License

This project is open source and available for personal use.

## Support

For issues or questions, please create an issue in the repository.
