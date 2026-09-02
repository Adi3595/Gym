'use client';

import React from 'react';
import styles from './DataTable.module.css';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick,
  searchPlaceholder = 'Search...'
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) => {
      // Check if any value in the item matches the search query
      return Object.values(item).some((val) => 
        String(val).toLowerCase().includes(lowerQuery)
      );
    });
  }, [data, searchQuery]);

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
        <div className={styles.actions}>
          <Button variant="secondary" icon={<Filter size={18} />}>
            Filter
          </Button>
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
                  <td className={styles.actionCol}>
                    <button className={styles.iconButton}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
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
