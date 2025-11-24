export interface Participant {
  id: string;
  name: string;
  email: string;
  wishlist?: string;
  address?: string;
  exclusions?: string;
}

export interface ExclusionPair {
  id: string;
  participant1Id: string;
  participant2Id: string;
  isUnidirectional?: boolean; // true for historical assignments (one-way), false/undefined for manual exclusions (two-way)
}

export interface Assignment {
  giverId: string;
  giverName: string;
  giverEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientWishlist?: string;
  recipientAddress?: string;
}

export interface YearData {
  year: number;
  assignments: Assignment[];
  savedAt: string;
}

export interface SecretSantaState {
  participants: Participant[];
  exclusionPairs: ExclusionPair[];
  currentYear: number;
  currentAssignments: Assignment[];
  historicalData: YearData[];
  isYearOverridden: boolean;
}

export interface CSVRow {
  Year: string;
  'Giver Name': string;
  'Giver Email': string;
  'Recipient Name': string;
  'Recipient Email': string;
}

export interface WishlistCSVRow {
  Timestamp: string;
  Username: string;
  'What is your name?': string;
  'Any exclusions?': string;
  'What would you like for Christmas this year?': string;
  'Where would you like your Christmas gift sent to?': string;
}
