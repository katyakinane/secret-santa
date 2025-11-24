'use client';

import { useState } from 'react';
import { Participant, ExclusionPair } from '@/types';

interface ExclusionManagerProps {
  participants: Participant[];
  exclusionPairs: ExclusionPair[];
  onAddExclusion: (pair: ExclusionPair) => void;
  onRemoveExclusion: (id: string) => void;
}

export default function ExclusionManager({
  participants,
  exclusionPairs,
  onAddExclusion,
  onRemoveExclusion,
}: ExclusionManagerProps) {
  const [person1Id, setPerson1Id] = useState('');
  const [person2Id, setPerson2Id] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!person1Id || !person2Id) {
      alert('Please select both participants');
      return;
    }

    if (person1Id === person2Id) {
      alert('Cannot exclude a person from themselves');
      return;
    }

    // Check if pair already exists (in either direction)
    const pairExists = exclusionPairs.some(
      (pair) =>
        (pair.participant1Id === person1Id && pair.participant2Id === person2Id) ||
        (pair.participant1Id === person2Id && pair.participant2Id === person1Id)
    );

    if (pairExists) {
      alert('This exclusion pair already exists');
      return;
    }

    const newPair: ExclusionPair = {
      id: `${person1Id}-${person2Id}`,
      participant1Id: person1Id,
      participant2Id: person2Id,
    };

    onAddExclusion(newPair);
    setPerson1Id('');
    setPerson2Id('');
  };

  const getParticipantName = (id: string): string => {
    const participant = participants.find((p) => p.id === id);
    return participant ? participant.name : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Exclusion Pairs</h2>
        <p className="text-sm text-gray-600 mt-1">
          Specify pairs who should not be matched (e.g., spouses, roommates)
        </p>
      </div>

      {/* Add Exclusion Form */}
      {participants.length >= 2 ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="person1" className="block text-sm font-medium text-gray-700 mb-1">
                Person 1
              </label>
              <select
                id="person1"
                value={person1Id}
                onChange={(e) => setPerson1Id(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a participant</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="person2" className="block text-sm font-medium text-gray-700 mb-1">
                Person 2
              </label>
              <select
                id="person2"
                value={person2Id}
                onChange={(e) => setPerson2Id(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a participant</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Add Exclusion Pair
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Add at least 2 participants before creating exclusion pairs
          </p>
        </div>
      )}

      {/* Exclusion Pairs List */}
      {exclusionPairs.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excluded Pairs
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exclusionPairs.map((pair) => (
                <tr key={pair.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{getParticipantName(pair.participant1Id)}</span>
                      {pair.isUnidirectional ? (
                        <span className="text-blue-600 mx-2 font-bold" title="One-way exclusion (cannot give to)">
                          →
                        </span>
                      ) : (
                        <span className="text-red-600 mx-2 font-bold" title="Two-way exclusion (neither can give to the other)">
                          ↔
                        </span>
                      )}
                      <span className="font-medium">{getParticipantName(pair.participant2Id)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {pair.isUnidirectional ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Historical
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onRemoveExclusion(pair.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
          No exclusion pairs defined. Add pairs to prevent certain people from being matched.
        </p>
      )}

      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">
          Total exclusion pairs: <span className="font-semibold">{exclusionPairs.length}</span>
        </p>
        <div className="flex space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="text-blue-600 font-bold mr-1">→</span>
            <span>One-way (historical): Person on left cannot give to person on right</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-600 font-bold mr-1">↔</span>
            <span>Two-way (manual): Neither can give to the other</span>
          </div>
        </div>
      </div>
    </div>
  );
}
