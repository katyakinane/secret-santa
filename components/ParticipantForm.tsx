'use client';

import { useState } from 'react';
import { Participant } from '@/types';

interface ParticipantFormProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
  onUpdateParticipant: (participant: Participant) => void;
}

export default function ParticipantForm({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateParticipant,
}: ParticipantFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Please enter both name and email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (editingId) {
      // Update existing participant
      onUpdateParticipant({
        id: editingId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
      setEditingId(null);
    } else {
      // Add new participant
      const participant: Participant = {
        id: email.trim().toLowerCase(), // Use email as ID
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };

      // Check for duplicate email
      if (participants.some((p) => p.id === participant.id)) {
        alert('A participant with this email already exists');
        return;
      }

      onAddParticipant(participant);
    }

    setName('');
    setEmail('');
  };

  const handleEdit = (participant: Participant) => {
    setName(participant.name);
    setEmail(participant.email);
    setEditingId(participant.id);
  };

  const handleCancelEdit = () => {
    setName('');
    setEmail('');
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Participants</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {editingId ? 'Update Participant' : 'Add Participant'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Participants List */}
      {participants.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {participant.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {participant.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(participant)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
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
          No participants added yet. Add at least 2 participants to generate assignments.
        </p>
      )}

      <p className="text-sm text-gray-600">
        Total participants: <span className="font-semibold">{participants.length}</span>
      </p>
    </div>
  );
}
