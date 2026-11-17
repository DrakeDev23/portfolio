export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter projects by category"
      className="scrollbar-none mb-8 flex gap-6 overflow-x-auto border-b border-white/5"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`relative -mb-px whitespace-nowrap rounded-sm pb-3 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090514] ${
              isActive
                ? 'font-medium text-gray-100'
                : 'font-normal text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-1.5 text-xs text-gray-600">{tab.count}</span>
            )}
            {isActive && (
              <span
                className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full"
                style={{ backgroundColor: '#7A33FF' }}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
