# EmailJS Setup Guide for Secret Santa Generator

This guide will walk you through setting up EmailJS to send Secret Santa assignment emails.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** in the top right corner
3. Sign up with your email or use Google/GitHub authentication
4. Verify your email address if required

## Step 2: Add an Email Service

Once logged in:

1. In the EmailJS dashboard, click **Email Services** in the left sidebar
2. Click **Add New Service**
3. Choose your email provider (recommended options):
   - **Gmail** - If you use Gmail (most common)
   - **Outlook** - If you use Outlook/Hotmail
   - **Yahoo** - If you use Yahoo Mail
   - Or choose another provider

### For Gmail (Recommended):

1. Select **Gmail**
2. Click **Connect Account**
3. Sign in with the Google account you want to send emails from
4. Grant EmailJS permission to send emails on your behalf
5. Give your service a name (e.g., "Secret Santa Emails")
6. Click **Create Service**
7. **IMPORTANT**: Copy your **Service ID** (looks like `service_xxxxxxx`) - you'll need this later

### For Other Email Providers:

1. Select your provider
2. Follow the authentication steps
3. You may need to enter SMTP settings or app-specific passwords
4. Copy your **Service ID** when done

## Step 3: Create an Email Template

1. Click **Email Templates** in the left sidebar
2. Click **Create New Template**
3. You'll see a template editor with several fields

### Template Configuration:

**Template Name**: Give it a descriptive name (e.g., "Secret Santa Assignment")

**From Name**: How you want the email to appear from (e.g., "Secret Santa Organizer")

**From Email**: Leave as default or use a custom email

**Subject Line**: Enter a subject, you can use variables:
```
Your Secret Santa Assignment
```
Or with personalization:
```
{{to_name}}, Your Secret Santa Assignment is Ready!
```

**Content (Body)**: This is the email message. Use these **exact variable names**:
- `{{to_name}}` - The giver's name (person receiving the email)
- `{{recipient_name}}` - The recipient's name (person they're buying for)
- `{{recipient_wishlist}}` - What the recipient wants for Christmas
- `{{recipient_address}}` - Where to send the gift
- `{{to_email}}` - The giver's email (usually in To: field automatically)

### Example Template (Copy and Paste):

```
Hi {{to_name}},

Your Secret Santa assignment for this year is:

🎁 {{recipient_name}} 🎁

WISHLIST:
{{recipient_wishlist}}

SHIPPING ADDRESS:
{{recipient_address}}

Please keep this secret! Remember to get a gift within the agreed budget and send it to the address above.

If you have any questions, please reach out to the organizer.

Happy gifting!

---
This is an automated message from the Secret Santa Generator.
```

### HTML Template (Optional - Better Looking):

If you want a nicer looking email, switch to the HTML tab and use:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
    }
    .header {
      background: linear-gradient(135deg, #c31432 0%, #2a5c24 100%);
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .recipient-box {
      background-color: #fff5f5;
      border-left: 4px solid #c31432;
      padding: 15px;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .info-box {
      background-color: #f0f9ff;
      border-left: 4px solid #0284c7;
      padding: 15px;
      margin: 15px 0;
      white-space: pre-wrap;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎅 Secret Santa Assignment 🎄</h1>
    </div>
    <div class="content">
      <p>Hi {{to_name}},</p>

      <p>Your Secret Santa assignment for this year is:</p>

      <div class="recipient-box">
        🎁 {{recipient_name}} 🎁
      </div>

      <div class="info-box">
        <strong>📝 WISHLIST:</strong><br>
        {{recipient_wishlist}}
      </div>

      <div class="info-box">
        <strong>📦 SHIPPING ADDRESS:</strong><br>
        {{recipient_address}}
      </div>

      <p><strong>Important reminders:</strong></p>
      <ul>
        <li>Keep this assignment secret!</li>
        <li>Stay within the agreed budget</li>
        <li>Send your gift to the address above</li>
      </ul>

      <p>If you have any questions, please reach out to the organizer.</p>

      <p>Happy gifting!</p>

      <div class="footer">
        This is an automated message from the Secret Santa Generator.
      </div>
    </div>
  </div>
</body>
</html>
```

4. Click **Save** in the top right
5. **IMPORTANT**: Copy your **Template ID** (looks like `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. Click on your account name in the top right corner
2. Select **Account** from the dropdown
3. Look for the **General** tab or **API Keys** section
4. Find your **Public Key** (looks like a random string of letters/numbers, about 15-20 characters)
5. Copy this key

**Note**: Do NOT use your Private Key - only use the Public Key for frontend apps.

## Step 5: Configure the Secret Santa App

Now you have all three pieces of information:

1. **Service ID**: `service_xxxxxxx`
2. **Template ID**: `template_xxxxxxx`
3. **Public Key**: `xxxx-xxxxxxxxxxxxx` (or similar format)

### Enter in the App:

1. Go to your Secret Santa app at http://localhost:3001
2. You'll see a yellow banner saying "Setup Required: Configure EmailJS"
3. Click **Configure Now**
4. Paste your three credentials:
   - Service ID
   - Template ID
   - Public Key
5. Click **Save**

## Step 6: Test the Email System

Before sending to everyone:

1. Add yourself as a participant in the app
2. Add at least one other person (can be fake for testing)
3. Generate assignments
4. Click **Send Emails**
5. Check your inbox to verify the email arrived correctly

## Troubleshooting

### Email Not Sending

- **Check credentials**: Make sure all three IDs are correct (no extra spaces)
- **Verify service**: Make sure your email service is connected in EmailJS dashboard
- **Check template variables**: Ensure you used `{{to_name}}` and `{{recipient_name}}` exactly
- **Account limits**: Free EmailJS accounts have limits (200 emails/month)

### Email Goes to Spam

- Ask recipients to check spam/junk folders
- Add your sending email to their contacts
- Use a professional email address (not a personal one)

### Template Variables Not Working

- Make sure you used double curly braces: `{{variable_name}}`
- Variable names must be exactly: `to_name`, `to_email`, `recipient_name`
- No spaces inside the curly braces

### Gmail Blocking

If using Gmail and emails aren't sending:

1. Go to your Google Account settings
2. Enable "Less secure app access" (if available)
3. Or use an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate an app password for EmailJS

## EmailJS Free Tier Limits

- **200 emails per month**
- **2 email templates**
- **1 email service**

For larger groups or multiple events, you may need to upgrade to a paid plan.

## Security Notes

- Your Public Key is safe to use in the frontend app
- Never share your Private Key
- EmailJS credentials are stored in your browser's LocalStorage (only on your computer)
- Clear your browser data if you want to remove saved credentials

## Alternative: Using Your Own Email Client

If you prefer not to use EmailJS or hit the limits, you can:

1. Generate assignments in the app
2. Click "Save to CSV" to download the file
3. Open the CSV in Excel/Google Sheets
4. Manually send emails using your regular email client
5. Use mail merge if you're familiar with it

---

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Available through their dashboard
- Test your setup with small groups first!

Happy Secret Santa organizing! 🎅🎄
