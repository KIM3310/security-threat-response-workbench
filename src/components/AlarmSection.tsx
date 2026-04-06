import { Activity, Search } from 'lucide-react';
import type { Alarm, Severity } from '../types';
import { CardSection } from './CardSection';
import { AlarmRow } from './DataCards';

const severityFilters: Array<{ label: string; value: 'all' | Severity }> = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' },
  { label: 'Info', value: 'info' },
];

export function AlarmSection({
  filteredAlarms,
  orderedAlarms,
  severityFilter,
  setSeverityFilter,
  searchQuery,
  setSearchQuery,
}: {
  filteredAlarms: Alarm[];
  orderedAlarms: Alarm[];
  severityFilter: 'all' | Severity;
  setSeverityFilter: (value: 'all' | Severity) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  return (
    <CardSection
      icon={<Activity className="section-icon" aria-hidden="true" />}
      kicker="Security queue"
      title="Prioritized event triage"
      copy="The table is intentionally action-first: severity, signal, impact, and owner decision. That makes it easier to discuss 24x365 operational judgment in interviews."
    >
      <div className="filter-toolbar">
        <label className="search-field">
          <span className="search-label">
            <Search aria-hidden="true" />
            Quick filter
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search signal, owner, impact, or action"
            aria-label="Filter security events"
          />
        </label>

        <div className="filter-group" aria-label="Severity filter">
          {severityFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`filter-pill ${severityFilter === filter.value ? 'is-active' : ''}`}
              onClick={() => setSeverityFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="filter-result-copy">
        Showing {filteredAlarms.length} of {orderedAlarms.length} events
      </p>

      {filteredAlarms.length > 0 ? (
        <div className="alarm-table" role="table" aria-label="Prioritized security event queue">
          <div className="alarm-table-header" role="row">
            <span role="columnheader">Severity</span>
            <span role="columnheader">Signal</span>
            <span role="columnheader">Impact</span>
            <span role="columnheader">Owner / Next action</span>
          </div>
          {filteredAlarms.map((alarm) => (
            <AlarmRow key={alarm.id} alarm={alarm} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <h3>No events match the current filter</h3>
          <p>Try a broader keyword or switch the severity filter back to `All`.</p>
        </div>
      )}
    </CardSection>
  );
}
