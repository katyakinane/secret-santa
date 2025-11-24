import Papa from 'papaparse';
import { Assignment, YearData, CSVRow, Participant, WishlistCSVRow, ExclusionPair } from '@/types';

/**
 * Converts assignments to CSV format and triggers download
 */
export function exportToCSV(year: number, assignments: Assignment[]): void {
  const csvData: CSVRow[] = assignments.map((assignment) => ({
    Year: year.toString(),
    'Giver Name': assignment.giverName,
    'Giver Email': assignment.giverEmail,
    'Recipient Name': assignment.recipientName,
    'Recipient Email': assignment.recipientEmail,
  }));

  const csv = Papa.unparse(csvData);
  downloadCSV(csv, `secret-santa-${year}.csv`);
}

/**
 * Downloads a CSV string as a file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parses CSV file and extracts year data
 */
export function importFromCSV(
  file: File
): Promise<{ yearData: YearData; participants: Participant[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error(
              `CSV parsing errors: ${results.errors.map((e) => e.message).join(', ')}`
            );
          }

          if (results.data.length === 0) {
            throw new Error('CSV file is empty');
          }

          // Extract year from first row
          const year = parseInt(results.data[0].Year);
          if (isNaN(year)) {
            throw new Error('Invalid year in CSV file');
          }

          // Validate all rows have the same year
          const allSameYear = results.data.every(
            (row) => parseInt(row.Year) === year
          );
          if (!allSameYear) {
            throw new Error('CSV file contains multiple years');
          }

          // Extract participants (unique givers and recipients)
          const participantsMap = new Map<string, Participant>();

          results.data.forEach((row, index) => {
            // Validate row
            if (
              !row['Giver Name'] ||
              !row['Giver Email'] ||
              !row['Recipient Name'] ||
              !row['Recipient Email']
            ) {
              throw new Error(`Row ${index + 2} is missing required fields`);
            }

            // Add giver
            const giverEmail = row['Giver Email'].trim().toLowerCase();
            if (!participantsMap.has(giverEmail)) {
              participantsMap.set(giverEmail, {
                id: giverEmail,
                name: row['Giver Name'].trim(),
                email: giverEmail,
              });
            }

            // Add recipient
            const recipientEmail = row['Recipient Email'].trim().toLowerCase();
            if (!participantsMap.has(recipientEmail)) {
              participantsMap.set(recipientEmail, {
                id: recipientEmail,
                name: row['Recipient Name'].trim(),
                email: recipientEmail,
              });
            }
          });

          // Convert to assignments
          const assignments: Assignment[] = results.data.map((row) => {
            const giverEmail = row['Giver Email'].trim().toLowerCase();
            const recipientEmail = row['Recipient Email'].trim().toLowerCase();

            return {
              giverId: giverEmail,
              giverName: row['Giver Name'].trim(),
              giverEmail: giverEmail,
              recipientId: recipientEmail,
              recipientName: row['Recipient Name'].trim(),
              recipientEmail: recipientEmail,
            };
          });

          const yearData: YearData = {
            year,
            assignments,
            savedAt: new Date().toISOString(),
          };

          const participants = Array.from(participantsMap.values());

          resolve({ yearData, participants });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Validates CSV file structure without fully parsing
 */
export function validateCSVFile(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.csv')) {
      reject(new Error('File must be a CSV file'));
      return;
    }

    Papa.parse<CSVRow>(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        const requiredHeaders = [
          'Year',
          'Giver Name',
          'Giver Email',
          'Recipient Name',
          'Recipient Email',
        ];

        const headers = results.meta.fields || [];
        const hasAllHeaders = requiredHeaders.every((header) =>
          headers.includes(header)
        );

        if (!hasAllHeaders) {
          reject(
            new Error(
              `CSV must have headers: ${requiredHeaders.join(', ')}`
            )
          );
          return;
        }

        resolve(true);
      },
      error: (error) => {
        reject(new Error(`Invalid CSV file: ${error.message}`));
      },
    });
  });
}

/**
 * Parses wishlist CSV file and extracts participants with their wishlists and exclusions
 */
export function importWishlistCSV(
  file: File
): Promise<{ participants: Participant[]; exclusionPairs: ExclusionPair[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<WishlistCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error(
              `CSV parsing errors: ${results.errors.map((e) => e.message).join(', ')}`
            );
          }

          if (results.data.length === 0) {
            throw new Error('CSV file is empty');
          }

          const participants: Participant[] = [];
          const exclusionPairs: ExclusionPair[] = [];
          const participantMap = new Map<string, Participant>();

          results.data.forEach((row, index) => {
            // Validate required fields
            if (!row.Username || !row['What is your name?']) {
              throw new Error(`Row ${index + 2} is missing required fields (Username or Name)`);
            }

            const email = row.Username.trim().toLowerCase();
            const name = row['What is your name?'].trim();
            const wishlist = row['What would you like for Christmas this year?']?.trim() || '';
            const address = row['Where would you like your Christmas gift sent to?']?.trim() || '';
            const exclusionsRaw = row['Any exclusions?']?.trim() || '';

            const participant: Participant = {
              id: email,
              name: name,
              email: email,
              wishlist: wishlist,
              address: address,
              exclusions: exclusionsRaw,
            };

            participants.push(participant);
            participantMap.set(email, participant);
          });

          // Process exclusions after all participants are loaded
          participants.forEach((participant) => {
            if (participant.exclusions) {
              // Split by semicolon or comma
              const exclusionNames = participant.exclusions
                .split(/[;,]/)
                .map((name) => name.trim())
                .filter((name) => name.length > 0);

              exclusionNames.forEach((excludedName) => {
                // Find participant by name
                const excludedParticipant = participants.find(
                  (p) => p.name.toLowerCase() === excludedName.toLowerCase()
                );

                if (excludedParticipant) {
                  // Create exclusion pair (avoid duplicates)
                  const pairId1 = `${participant.id}-${excludedParticipant.id}`;
                  const pairId2 = `${excludedParticipant.id}-${participant.id}`;

                  const exists = exclusionPairs.some(
                    (pair) => pair.id === pairId1 || pair.id === pairId2
                  );

                  if (!exists) {
                    exclusionPairs.push({
                      id: pairId1,
                      participant1Id: participant.id,
                      participant2Id: excludedParticipant.id,
                    });
                  }
                }
              });
            }
          });

          resolve({ participants, exclusionPairs });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse wishlist CSV: ${error.message}`));
      },
    });
  });
}
