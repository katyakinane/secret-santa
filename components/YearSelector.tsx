'use client';

import { YearData } from '@/types';

interface YearSelectorProps {
  currentYear: number;
  isOverridden: boolean;
  historicalData: YearData[];
  onYearChange: (year: number, isOverride: boolean) => void;
}

export default function YearSelector({
  currentYear,
  isOverridden,
  historicalData,
  onYearChange,
}: YearSelectorProps) {
  const actualCurrentYear = new Date().getFullYear();

  const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2000 && value <= 2100) {
      onYearChange(value, true);
    }
  };

  const handleResetYear = () => {
    onYearChange(actualCurrentYear, false);
  };

  const yearHasData = historicalData.some((data) => data.year === currentYear);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Year Selection</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Current Year
            </label>
            <input
              type="number"
              id="year"
              value={currentYear}
              onChange={handleYearInput}
              min={2000}
              max={2100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {isOverridden && (
            <div className="pt-6">
              <button
                onClick={handleResetYear}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset to {actualCurrentYear}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOverridden ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Year Override Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Using Current Year
            </span>
          )}

          {yearHasData && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Saved Data Exists
            </span>
          )}
        </div>

        {yearHasData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Assignments for {currentYear} already exist. Saving new
              assignments will overwrite the existing data.
            </p>
          </div>
        )}
      </div>

      {/* Historical Data Summary */}
      {historicalData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Historical Data</h3>
          <div className="space-y-2">
            {historicalData
              .sort((a, b) => b.year - a.year)
              .map((data) => (
                <div
                  key={data.year}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <span className="font-medium text-gray-900">{data.year}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({data.assignments.length} assignments)
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Saved: {new Date(data.savedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
