'use client';

interface ItineraryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ItineraryTabs({ activeTab, setActiveTab }: ItineraryTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Daily Schedule' },
    { id: 'accommodations', label: 'Accommodations' },
    { id: 'costs', label: 'Cost Breakdown' },
    { id: 'insights', label: 'Local Insights' },
    { id: 'practical', label: 'Practical Info' }
  ];

  return (
    <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
