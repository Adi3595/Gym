'use client';

import React from 'react';
import styles from './DataTable.module.css';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortValue?: (item: T) => any;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
  renderActions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick,
  searchPlaceholder = 'Search...',
  renderActions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showFilter, setShowFilter] = React.useState(false);

  const filteredData = React.useMemo(() => {
    let result = data;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((item) => {
        return Object.values(item).some((val) => 
          String(val).toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (sortKey) {
      result = [...result].sort((a: any, b: any) => {
        const colDef = columns.find(c => c.key === sortKey);
        const aVal = colDef?.sortValue ? colDef.sortValue(a) : a[sortKey];
        const bVal = colDef?.sortValue ? colDef.sortValue(b) : b[sortKey];
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortKey, sortOrder]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={searchPlaceholder} 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.actions} style={{ position: 'relative' }}>
          <Button variant="secondary" icon={<Filter size={18} />} onClick={() => setShowFilter(!showFilter)}>
            Sort
          </Button>

          {showFilter && (
            <div className={styles.filterDropdown}>
              <div style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sort By</div>
              {columns.map(col => (
                <button 
                  key={col.key} 
                  className={styles.filterOption}
                  onClick={() => {
                    if (sortKey === col.key) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortKey(col.key);
                      setSortOrder('asc');
                    }
                  }}
                >
                  {col.header} 
                  {sortKey === col.key && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </button>
              ))}
              <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <button 
                  className={styles.filterOption} 
                  style={{ color: '#EF4444' }}
                  onClick={() => { setSortKey(null); setShowFilter(false); }}
                >
                  Clear Sort
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
              <th className={styles.actionCol}></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.emptyState}>
                  No data found.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? styles.clickableRow : ''}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.cell ? col.cell(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {renderActions ? (
                    <td className={styles.actionCol}>
                      {renderActions(item)}
                    </td>
                  ) : (
                    <td className={styles.actionCol}>
                      <button className={styles.iconButton}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of {data.length} entries</span>
        <div className={styles.pageControls}>
          <Button variant="ghost" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="ghost" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
