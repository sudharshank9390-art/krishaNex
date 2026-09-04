import React from 'react';
import { clsx } from 'clsx';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data available' }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/60">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono font-bold uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={clsx('px-4 py-3.5', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={clsx('px-4 py-3.5 font-medium', col.className)}>
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
