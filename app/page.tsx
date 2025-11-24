'use client';

import { useState, useEffect } from 'react';
import ParticipantForm from '@/components/ParticipantForm';
import ExclusionManager from '@/components/ExclusionManager';
import AssignmentViewer from '@/components/AssignmentViewer';
import YearSelector from '@/components/YearSelector';
import { Participant, ExclusionPair, Assignment, YearData } from '@/types';
import { generateAssignments } from '@/lib/secretSanta';
import {
  loadHistoricalData,
  saveYearData,
  loadParticipants,
  saveParticipants,
  loadExclusionPairs,
  saveExclusionPairs,
} from '@/lib/storage';
import { exportToCSV, importFromCSV, importWishlistCSV } from '@/lib/csvHandler';
import {
  sendAssignmentEmails,
  sendTestEmail,
  loadEmailConfig,
  saveEmailConfig,
  validateEmailConfig,
  EmailConfig,
} from '@/lib/emailService';

/**
 * Merges two arrays of participants by name, preferring data from the first array
 */
function mergeParticipantsByName(
  primary: Participant[],
  secondary: Participant[]
): Participant[] {
  const participantMap = new Map<string, Participant>();

  // First, add all secondary participants (lower priority)
  secondary.forEach((participant) => {
    const normalizedName = participant.name.toLowerCase().trim();
    participantMap.set(normalizedName, participant);
  });

  // Then add/override with primary participants (higher priority, with latest email)
  primary.forEach((participant) => {
    const normalizedName = participant.name.toLowerCase().trim();
    const existing = participantMap.get(normalizedName);

    if (existing) {
      // Merge: use primary's email and wishlist data, keep participant linked by name
      participantMap.set(normalizedName, {
        id: participant.email, // Use latest email as ID
        name: participant.name, // Use primary's name (preserves capitalization)
        email: participant.email, // Use latest email
        wishlist: participant.wishlist || existing.wishlist,
        address: participant.address || existing.address,
        exclusions: participant.exclusions || existing.exclusions,
      });
    } else {
      participantMap.set(normalizedName, participant);
    }
  });

  return Array.from(participantMap.values());
}

/**
 * Merges two arrays of exclusion pairs, avoiding duplicates
 * Uses participant map to match by name and update IDs
 */
function mergeExclusionPairs(
  primary: ExclusionPair[],
  secondary: ExclusionPair[],
  participantMap?: Map<string, Participant>
): ExclusionPair[] {
  const pairSet = new Set<string>();
  const mergedPairs: ExclusionPair[] = [];

  // Helper to create a normalized pair key based on IDs
  const getPairKey = (id1: string, id2: string) => {
    const sorted = [id1.toLowerCase(), id2.toLowerCase()].sort();
    return `${sorted[0]}|||${sorted[1]}`;
  };

  // Add all pairs, avoiding duplicates
  [...primary, ...secondary].forEach((pair) => {
    const key = getPairKey(pair.participant1Id, pair.participant2Id);
    if (!pairSet.has(key)) {
      pairSet.add(key);
      mergedPairs.push(pair);
    }
  });

  return mergedPairs;
}

/**
 * Updates exclusion pair IDs to match current participant emails
 */
function updateExclusionPairIds(
  exclusionPairs: ExclusionPair[],
  participants: Participant[]
): ExclusionPair[] {
  // Create name -> participant map
  const nameMap = new Map<string, Participant>();
  participants.forEach((p) => {
    nameMap.set(p.name.toLowerCase().trim(), p);
  });

  // Create email -> participant map (for existing exclusions with email IDs)
  const emailMap = new Map<string, Participant>();
  participants.forEach((p) => {
    emailMap.set(p.email.toLowerCase(), p);
  });

  return exclusionPairs
    .map((pair) => {
      // Try to find participants by email first, then by name
      let participant1 = emailMap.get(pair.participant1Id.toLowerCase());
      let participant2 = emailMap.get(pair.participant2Id.toLowerCase());

      // If not found by email, try to find by name in old participants
      if (!participant1) {
        // participant1Id might be a name, try to find the participant
        const matchedByName = Array.from(nameMap.values()).find(
          (p) => p.name.toLowerCase() === pair.participant1Id.toLowerCase()
        );
        participant1 = matchedByName;
      }

      if (!participant2) {
        const matchedByName = Array.from(nameMap.values()).find(
          (p) => p.name.toLowerCase() === pair.participant2Id.toLowerCase()
        );
        participant2 = matchedByName;
      }

      if (participant1 && participant2) {
        return {
          id: `${participant1.id}-${participant2.id}`,
          participant1Id: participant1.id,
          participant2Id: participant2.id,
        };
      }

      return null; // Skip pairs where participants not found
    })
    .filter((pair): pair is ExclusionPair => pair !== null);
}

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exclusionPairs, setExclusionPairs] = useState<ExclusionPair[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isYearOverridden, setIsYearOverridden] = useState(false);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [historicalData, setHistoricalData] = useState<YearData[]>([]);
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [emailConfigForm, setEmailConfigForm] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
    });
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailProgress, setEmailProgress] = useState({ sent: 0, total: 0 });
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedParticipants = loadParticipants();
    const loadedExclusions = loadExclusionPairs();
    const loadedHistorical = loadHistoricalData();
    const loadedEmailConfig = loadEmailConfig();

    setParticipants(loadedParticipants);
    setExclusionPairs(loadedExclusions);
    setHistoricalData(loadedHistorical);
    setEmailConfig(loadedEmailConfig);

    if (loadedEmailConfig) {
      setEmailConfigForm(loadedEmailConfig);
    }
  }, []);

  // Save participants whenever they change
  useEffect(() => {
    saveParticipants(participants);
  }, [participants]);

  // Save exclusions whenever they change
  useEffect(() => {
    saveExclusionPairs(exclusionPairs);
  }, [exclusionPairs]);

  const handleAddParticipant = (participant: Participant) => {
    setParticipants([...participants, participant]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    // Also remove any exclusion pairs involving this participant
    setExclusionPairs(
      exclusionPairs.filter(
        (pair) => pair.participant1Id !== id && pair.participant2Id !== id
      )
    );
  };

  const handleUpdateParticipant = (updatedParticipant: Participant) => {
    setParticipants(
      participants.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p))
    );
  };

  const handleAddExclusion = (pair: ExclusionPair) => {
    setExclusionPairs([...exclusionPairs, pair]);
  };

  const handleRemoveExclusion = (id: string) => {
    setExclusionPairs(exclusionPairs.filter((pair) => pair.id !== id));
  };

  const handleYearChange = (year: number, isOverride: boolean) => {
    setCurrentYear(year);
    setIsYearOverridden(isOverride);
  };

  const handleGenerateAssignments = () => {
    if (participants.length < 2) {
      alert('You need at least 2 participants to generate assignments');
      return;
    }

    try {
      const assignments = generateAssignments({
        participants,
        exclusionPairs,
        historicalData,
        currentYear,
      });
      setCurrentAssignments(assignments);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate assignments');
    }
  };

  const handleSaveToCSV = () => {
    if (currentAssignments.length === 0) {
      alert('No assignments to save. Generate assignments first.');
      return;
    }

    // Save to LocalStorage
    const yearData: YearData = {
      year: currentYear,
      assignments: currentAssignments,
      savedAt: new Date().toISOString(),
    };

    saveYearData(yearData);

    // Update historical data state
    setHistoricalData(loadHistoricalData());

    // Export to CSV
    exportToCSV(currentYear, currentAssignments);

    alert(`Assignments for ${currentYear} saved successfully!`);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { yearData, participants: importedParticipants } = await importFromCSV(file);

      // Save to LocalStorage
      saveYearData(yearData);
      setHistoricalData(loadHistoricalData());

      // Merge participants by name (if wishlist was already loaded)
      if (participants.length > 0) {
        const mergedParticipants = mergeParticipantsByName(participants, importedParticipants);
        setParticipants(mergedParticipants);
      }

      // Create exclusion pairs from last year's assignments (unidirectional)
      const newExclusionPairs: ExclusionPair[] = yearData.assignments.map((assignment) => ({
        id: `${assignment.giverId}-${assignment.recipientId}`,
        participant1Id: assignment.giverId,
        participant2Id: assignment.recipientId,
        isUnidirectional: true, // Mark as unidirectional - only prevents same giver->recipient
      }));

      // Update existing exclusion pairs to use current participant email IDs
      const updatedExistingExclusions = updateExclusionPairIds(
        exclusionPairs,
        participants.length > 0 ? participants : importedParticipants
      );

      // Merge with existing exclusions, avoiding duplicates
      const mergedExclusions = mergeExclusionPairs(
        newExclusionPairs,
        updatedExistingExclusions
      );

      setExclusionPairs(mergedExclusions);

      alert(
        `Successfully imported ${yearData.assignments.length} assignments from ${yearData.year}.\n\n` +
        `Created ${newExclusionPairs.length} exclusions from last year's pairings.\n` +
        `Total exclusions: ${mergedExclusions.length}\n\n` +
        `This historical data will be used to avoid repeat pairings.`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import CSV');
    }

    // Reset file input
    event.target.value = '';
  };

  const handleImportWishlistCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { participants: importedParticipants, exclusionPairs: importedExclusions } =
        await importWishlistCSV(file);

      // Merge with existing participants by name, preferring wishlist data
      const mergedParticipants = mergeParticipantsByName(
        importedParticipants,
        participants
      );

      // Update existing exclusion pairs to use new email IDs (if participants' emails changed)
      const updatedExistingExclusions = updateExclusionPairIds(
        exclusionPairs,
        mergedParticipants
      );

      // Merge exclusion pairs, avoiding duplicates
      const mergedExclusions = mergeExclusionPairs(
        importedExclusions,
        updatedExistingExclusions
      );

      // Set merged data
      setParticipants(mergedParticipants);
      setExclusionPairs(mergedExclusions);

      const addedCount = Math.max(0, mergedParticipants.length - participants.length);
      const updatedCount = participants.length > 0 ? Math.min(participants.length, mergedParticipants.length) : 0;

      alert(
        `Successfully imported wishlist!\n\n` +
        `Participants: ${mergedParticipants.length} total\n` +
        `  - ${addedCount} new\n` +
        `  - ${updatedCount} updated with latest data\n` +
        `Exclusions: ${mergedExclusions.length} total\n\n` +
        `Historical data from previous years is preserved.`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import wishlist CSV');
    }

    // Reset file input
    event.target.value = '';
  };

  const handleSaveEmailConfig = () => {
    if (
      !emailConfigForm.serviceId ||
      !emailConfigForm.templateId ||
      !emailConfigForm.publicKey
    ) {
      alert('Please fill in all email configuration fields');
      return;
    }

    const config: EmailConfig = {
      serviceId: emailConfigForm.serviceId,
      templateId: emailConfigForm.templateId,
      publicKey: emailConfigForm.publicKey,
    };

    saveEmailConfig(config);
    setEmailConfig(config);
    setShowEmailConfig(false);
    alert('Email configuration saved successfully!');
  };

  const handleSendTestEmail = async () => {
    if (!emailConfig || !validateEmailConfig(emailConfig)) {
      alert('Please configure EmailJS settings first.');
      setShowEmailConfig(true);
      return;
    }

    setIsSendingTestEmail(true);

    try {
      await sendTestEmail(
        emailConfig,
        'ekaterinalait@gmail.com',
        'Ekaterina'
      );
      alert('Test email sent successfully to ekaterinalait@gmail.com! Check your inbox.');
    } catch (error) {
      alert(`Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSendEmails = async () => {
    if (currentAssignments.length === 0) {
      alert('No assignments to send. Generate assignments first.');
      return;
    }

    if (!emailConfig || !validateEmailConfig(emailConfig)) {
      alert('Please configure EmailJS settings first.');
      setShowEmailConfig(true);
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to send ${currentAssignments.length} emails?`
    );
    if (!confirmed) return;

    setIsSendingEmails(true);
    setEmailProgress({ sent: 0, total: currentAssignments.length });

    try {
      const results = await sendAssignmentEmails(
        currentAssignments,
        emailConfig,
        (sent, total) => {
          setEmailProgress({ sent, total });
        }
      );

      if (results.failed > 0) {
        alert(
          `Sent ${results.success} emails successfully, ${results.failed} failed.\n\nErrors:\n${results.errors.join('\n')}`
        );
      } else {
        alert(`All ${results.success} emails sent successfully!`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send emails');
    } finally {
      setIsSendingEmails(false);
      setEmailProgress({ sent: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-2">Secret Santa Generator</h1>
          <p className="text-gray-600">
            Organize your Secret Santa exchange with ease
          </p>
        </div>

        {/* Email Configuration Banner */}
        {!emailConfig && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Configure EmailJS to send assignment emails.{' '}
              <button
                onClick={() => setShowEmailConfig(true)}
                className="underline font-medium hover:text-yellow-900"
              >
                Configure Now
              </button>
            </p>
          </div>
        )}

        {/* Email Configuration Modal */}
        {showEmailConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">EmailJS Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service ID
                  </label>
                  <input
                    type="text"
                    value={emailConfigForm.serviceId}
                    onChange={(e) =>
                      setEmailConfigForm({ ...emailConfigForm, serviceId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="service_xxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template ID
                  </label>
                  <input
                    type="text"
                    value={emailConfigForm.templateId}
                    onChange={(e) =>
                      setEmailConfigForm({ ...emailConfigForm, templateId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="template_xxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={emailConfigForm.publicKey}
                    onChange={(e) =>
                      setEmailConfigForm({ ...emailConfigForm, publicKey: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="xxxxxxxxxxxxxx"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Get your EmailJS credentials from{' '}
                  <a
                    href="https://www.emailjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    emailjs.com
                  </a>
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveEmailConfig}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowEmailConfig(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <YearSelector
                currentYear={currentYear}
                isOverridden={isYearOverridden}
                historicalData={historicalData}
                onYearChange={handleYearChange}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <ParticipantForm
                participants={participants}
                onAddParticipant={handleAddParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onUpdateParticipant={handleUpdateParticipant}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ExclusionManager
                participants={participants}
                exclusionPairs={exclusionPairs}
                onAddExclusion={handleAddExclusion}
                onRemoveExclusion={handleRemoveExclusion}
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleGenerateAssignments}
                  disabled={participants.length < 2}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  Generate Assignments
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSendEmails}
                    disabled={currentAssignments.length === 0 || isSendingEmails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSendingEmails
                      ? `Sending ${emailProgress.sent}/${emailProgress.total}`
                      : 'Send Emails'}
                  </button>

                  <button
                    onClick={handleSaveToCSV}
                    disabled={currentAssignments.length === 0}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Save to CSV
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Import Wishlist CSV
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportWishlistCSV}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your wishlist CSV with participants, wishlists, and exclusions
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Import Previous Year Assignments
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload previous year CSV to avoid repeat assignments
                    </p>
                  </div>
                </div>

                {emailConfig && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowEmailConfig(true)}
                      className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Update Email Configuration
                    </button>
                    <button
                      onClick={handleSendTestEmail}
                      disabled={isSendingTestEmail}
                      className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSendingTestEmail ? 'Sending Test Email...' : 'Send Test Email to ekaterinalait@gmail.com'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Display */}
        {currentAssignments.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AssignmentViewer
              assignments={currentAssignments}
              year={currentYear}
              onClear={() => setCurrentAssignments([])}
            />
          </div>
        )}
      </div>
    </div>
  );
}
