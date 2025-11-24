import emailjs from '@emailjs/browser';
import { Assignment } from '@/types';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

/**
 * Sends Secret Santa assignment emails using EmailJS
 * Note: You need to set up EmailJS account and create a template
 * Template variables should include: to_name, to_email, recipient_name, recipient_wishlist, recipient_address
 */
export async function sendAssignmentEmails(
  assignments: Assignment[],
  config: EmailConfig,
  onProgress?: (sent: number, total: number) => void
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (let i = 0; i < assignments.length; i++) {
    const assignment = assignments[i];

    try {
      await sendSingleEmail(assignment, config);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(
        `Failed to send to ${assignment.giverName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    if (onProgress) {
      onProgress(i + 1, assignments.length);
    }

    // Small delay between emails to avoid rate limiting
    if (i < assignments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Sends a single assignment email
 */
async function sendSingleEmail(
  assignment: Assignment,
  config: EmailConfig
): Promise<void> {
  const templateParams = {
    to_name: assignment.giverName,
    to_email: assignment.giverEmail,
    recipient_name: assignment.recipientName,
    recipient_wishlist: assignment.recipientWishlist || 'No wishlist provided',
    recipient_address: assignment.recipientAddress || 'No address provided',
  };

  await emailjs.send(
    config.serviceId,
    config.templateId,
    templateParams,
    config.publicKey
  );
}

/**
 * Sends a test email to verify EmailJS configuration
 */
export async function sendTestEmail(
  config: EmailConfig,
  testEmail: string,
  testName: string
): Promise<void> {
  const templateParams = {
    to_name: testName,
    to_email: testEmail,
    recipient_name: 'Test Recipient (Santa Claus)',
    recipient_wishlist: 'This is a test wishlist:\n• A new sleigh\n• More cookies\n• Extra milk\n• Vacation time after Christmas',
    recipient_address: 'Test Address:\n123 North Pole Lane\nArctic Circle\nH0H 0H0',
  };

  await emailjs.send(
    config.serviceId,
    config.templateId,
    templateParams,
    config.publicKey
  );
}

/**
 * Validates EmailJS configuration
 */
export function validateEmailConfig(config: EmailConfig): boolean {
  return !!(config.serviceId && config.templateId && config.publicKey);
}

/**
 * Storage keys for EmailJS configuration
 */
const EMAIL_CONFIG_KEY = 'secret-santa-email-config';

/**
 * Saves EmailJS configuration to localStorage
 */
export function saveEmailConfig(config: EmailConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Loads EmailJS configuration from localStorage
 */
export function loadEmailConfig(): EmailConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(EMAIL_CONFIG_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as EmailConfig;
  } catch (error) {
    console.error('Error loading email config:', error);
    return null;
  }
}
