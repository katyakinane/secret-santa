import { Participant, ExclusionPair, Assignment, YearData } from '@/types';

interface AssignmentConstraints {
  participants: Participant[];
  exclusionPairs: ExclusionPair[];
  historicalData: YearData[];
  currentYear: number;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if a giver was assigned to a recipient in the last N years
 */
function hasRecentMatch(
  giverId: string,
  recipientId: string,
  historicalData: YearData[],
  currentYear: number,
  yearsToAvoid: number = 2
): boolean {
  const recentYears = historicalData.filter(
    (data) => currentYear - data.year <= yearsToAvoid && data.year < currentYear
  );

  return recentYears.some((yearData) =>
    yearData.assignments.some(
      (assignment) =>
        assignment.giverId === giverId && assignment.recipientId === recipientId
    )
  );
}

/**
 * Checks if two participants are in an exclusion pair
 * Respects directionality: unidirectional pairs only block one direction
 */
function isExcludedPair(
  giverId: string,
  recipientId: string,
  exclusionPairs: ExclusionPair[]
): boolean {
  return exclusionPairs.some((pair) => {
    if (pair.isUnidirectional) {
      // For unidirectional (historical assignments), only block the exact direction
      return pair.participant1Id === giverId && pair.participant2Id === recipientId;
    } else {
      // For bidirectional (manual exclusions), block both directions
      return (
        (pair.participant1Id === giverId && pair.participant2Id === recipientId) ||
        (pair.participant1Id === recipientId && pair.participant2Id === giverId)
      );
    }
  });
}

/**
 * Checks if a giver -> recipient assignment is valid
 */
function isValidAssignment(
  giver: Participant,
  recipient: Participant,
  constraints: AssignmentConstraints
): boolean {
  // Cannot assign to self
  if (giver.id === recipient.id) {
    return false;
  }

  // Check exclusion pairs
  if (isExcludedPair(giver.id, recipient.id, constraints.exclusionPairs)) {
    return false;
  }

  // Check historical data
  if (
    hasRecentMatch(
      giver.id,
      recipient.id,
      constraints.historicalData,
      constraints.currentYear
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Attempts to generate valid Secret Santa assignments
 * Uses backtracking algorithm to find valid assignment
 */
function tryGenerateAssignments(
  constraints: AssignmentConstraints,
  attempt: number = 0
): Assignment[] | null {
  const { participants } = constraints;

  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Secret Santa');
  }

  // Create a shuffled list of recipients
  const recipients = shuffleArray([...participants]);
  const assignments: Assignment[] = [];
  const usedRecipients = new Set<string>();

  // Try to assign each giver to a recipient
  for (const giver of participants) {
    let assigned = false;

    for (const recipient of recipients) {
      if (
        !usedRecipients.has(recipient.id) &&
        isValidAssignment(giver, recipient, constraints)
      ) {
        assignments.push({
          giverId: giver.id,
          giverName: giver.name,
          giverEmail: giver.email,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          recipientWishlist: recipient.wishlist,
          recipientAddress: recipient.address,
        });
        usedRecipients.add(recipient.id);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      return null; // Failed to find valid assignment
    }
  }

  return assignments;
}

/**
 * Generates Secret Santa assignments with constraints
 * Will retry multiple times to find valid assignment
 */
export function generateAssignments(
  constraints: AssignmentConstraints,
  maxAttempts: number = 1000
): Assignment[] {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = tryGenerateAssignments(constraints, attempt);
    if (result) {
      return result;
    }
  }

  throw new Error(
    'Could not generate valid Secret Santa assignments after ' +
      maxAttempts +
      ' attempts. Try removing some exclusion pairs or checking historical data constraints.'
  );
}

/**
 * Validates that assignments form a complete cycle (everyone gives and receives exactly once)
 */
export function validateAssignments(
  assignments: Assignment[],
  participants: Participant[]
): boolean {
  const giverIds = new Set(assignments.map((a) => a.giverId));
  const recipientIds = new Set(assignments.map((a) => a.recipientId));

  // Check everyone gives once
  for (const participant of participants) {
    if (!giverIds.has(participant.id)) {
      return false;
    }
  }

  // Check everyone receives once
  for (const participant of participants) {
    if (!recipientIds.has(participant.id)) {
      return false;
    }
  }

  return true;
}
