import { YearData, SecretSantaState, Participant, ExclusionPair } from '@/types';

const STORAGE_KEY = 'secret-santa-data';
const PARTICIPANTS_KEY = 'secret-santa-participants';
const EXCLUSIONS_KEY = 'secret-santa-exclusions';

/**
 * Loads all historical year data from LocalStorage
 */
export function loadHistoricalData(): YearData[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as YearData[];
  } catch (error) {
    console.error('Error loading historical data:', error);
    return [];
  }
}

/**
 * Saves year data to LocalStorage
 * This permanently stores the assignments for a specific year
 */
export function saveYearData(yearData: YearData): void {
  if (typeof window === 'undefined') return;

  try {
    const historical = loadHistoricalData();

    // Remove any existing data for this year and add the new data
    const filtered = historical.filter((data) => data.year !== yearData.year);
    filtered.push(yearData);

    // Sort by year descending
    filtered.sort((a, b) => b.year - a.year);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving year data:', error);
    throw error;
  }
}

/**
 * Loads participants from LocalStorage (temporary storage)
 */
export function loadParticipants(): Participant[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(PARTICIPANTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Participant[];
  } catch (error) {
    console.error('Error loading participants:', error);
    return [];
  }
}

/**
 * Saves participants to LocalStorage (temporary storage)
 */
export function saveParticipants(participants: Participant[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving participants:', error);
    throw error;
  }
}

/**
 * Loads exclusion pairs from LocalStorage (temporary storage)
 */
export function loadExclusionPairs(): ExclusionPair[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(EXCLUSIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ExclusionPair[];
  } catch (error) {
    console.error('Error loading exclusion pairs:', error);
    return [];
  }
}

/**
 * Saves exclusion pairs to LocalStorage (temporary storage)
 */
export function saveExclusionPairs(exclusionPairs: ExclusionPair[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EXCLUSIONS_KEY, JSON.stringify(exclusionPairs));
  } catch (error) {
    console.error('Error saving exclusion pairs:', error);
    throw error;
  }
}

/**
 * Gets data for a specific year
 */
export function getYearData(year: number): YearData | null {
  const historical = loadHistoricalData();
  return historical.find((data) => data.year === year) || null;
}

/**
 * Deletes data for a specific year
 */
export function deleteYearData(year: number): void {
  if (typeof window === 'undefined') return;

  try {
    const historical = loadHistoricalData();
    const filtered = historical.filter((data) => data.year !== year);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting year data:', error);
    throw error;
  }
}

/**
 * Clears all temporary data (participants and exclusions, but not historical)
 */
export function clearTemporaryData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PARTICIPANTS_KEY);
    localStorage.removeItem(EXCLUSIONS_KEY);
  } catch (error) {
    console.error('Error clearing temporary data:', error);
    throw error;
  }
}
