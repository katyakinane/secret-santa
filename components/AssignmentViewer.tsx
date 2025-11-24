'use client';

import { Assignment } from '@/types';

interface AssignmentViewerProps {
  assignments: Assignment[];
  year: number;
  onClear: () => void;
}

export default function AssignmentViewer({
  assignments,
  year,
  onClear,
}: AssignmentViewerProps) {
  if (assignments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Generated Assignments for {year}
        </h2>
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Clear Assignments
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> These assignments are temporary until you save them. Review
          carefully before sending emails or saving to CSV.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giver
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giver Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                →
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assignment.giverName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {assignment.giverEmail}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-gray-400">
                  →
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assignment.recipientName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {assignment.recipientEmail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-600">
        Total assignments: <span className="font-semibold">{assignments.length}</span>
      </p>
    </div>
  );
}
