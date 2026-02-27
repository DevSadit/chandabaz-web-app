import { useState } from 'react';
import { Search, SlidersHorizontal, X, Image, Video, FileText } from 'lucide-react';

const MEDIA_TYPES = [
  { value: '', label: 'All Media', icon: null },
  { value: 'image', label: 'Images', icon: Image },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'pdf', label: 'Documents', icon: FileText },
];

export default function FilterBar({ filters, onChange, onClear }) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = filters.location || filters.mediaType || filters.startDate || filters.endDate;
  const activeFilterCount = [filters.location, filters.mediaType, filters.startDate, filters.endDate].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Main Search Row */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by keyword, location, or incident..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="input pl-12 pr-4 h-14 text-sm rounded-[1.25rem] bg-white border-transparent shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] focus:shadow-[0_8px_20px_-6px_rgba(1,103,56,0.15)]"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 h-14 rounded-[1.25rem] border font-bold text-sm transition-all duration-300 flex-shrink-0 ${showFilters || hasActiveFilters
              ? 'bg-primary-600 text-white border-transparent shadow-[0_8px_16px_-6px_rgba(1,103,56,0.25)]'
              : 'bg-white text-neutral-600 border-transparent shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] hover:text-primary-600'
            }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-primary-700 text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-5 h-14 rounded-[1.25rem] border border-transparent bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 hover:shadow-sm transition-all duration-200 flex-shrink-0"
          >
            <X size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card p-6 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="label text-[11px] text-neutral-500">Location</label>
              <input
                type="text"
                placeholder="e.g. Lahore, Karachi"
                value={filters.location || ''}
                onChange={(e) => onChange({ ...filters, location: e.target.value })}
                className="input text-sm h-12 rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs">Media Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {MEDIA_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange({ ...filters, mediaType: value })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all ${filters.mediaType === value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-700'
                      }`}
                  >
                    {Icon && <Icon size={12} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label text-xs">From Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
                className="input text-sm h-10"
              />
            </div>

            <div>
              <label className="label text-xs">To Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                className="input text-sm h-10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
