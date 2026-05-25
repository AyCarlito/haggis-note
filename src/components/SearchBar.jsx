export default function SearchBar({ query, onChange, onClear }) {
  return (
    <div className="px-2 pt-2 pb-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
          &#x2315;
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search folders and notes..."
          className="w-full bg-white/[0.06] border border-white/10 rounded pl-7 pr-7 py-1.5 text-sm text-sidebar-fg placeholder-gray-500 outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-colors"
          data-search-input
        />
        {query && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sidebar-fg text-xs transition-colors"
            aria-label="Clear search"
          >
            &#x2715;
          </button>
        )}
      </div>
    </div>
  )
}
