import { Dispatch, ReactElement, SetStateAction } from 'react';
import { singleFilterParams } from './TableFilters';

export interface OnPageChangeParams {
  currentPageNumber: number;
  rowsPerPage: number;
  searchText?: string;
}

export type SortingCol =
  | undefined
  | {
      colIndex: number;
      direction: 'asc' | 'desc';
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableRowDataProps = Record<string, string | number | boolean | Record<string, string> | any>;

export interface CellProps {
  rowIndex?: number;
  rowData: TableRowDataProps;
  updatedRowDataVariable: Record<string, unknown>;
  setUpdatedRowDataVariable: Dispatch<SetStateAction<TableRowDataProps>>;
}

export type TableCellProps = (object: CellProps) => string | number | JSX.Element;

export type TableColumnConfig = {
  hide?: boolean;
  selectorKey?: string;
  cell?: TableCellProps;
  columnLabel: string | JSX.Element;
  align?: 'left' | 'center' | 'right' | 'justify';
  onSort?: (param: 'asc' | 'desc') => null | 'asc' | 'desc' | void;
};

export interface CustomTableProps {
  maxData: number;
  isLoading: boolean;
  noDataText?: string | ReactElement;
  keyExtractor: string;
  data: TableRowDataProps[];
  errorMsg?: boolean | string;
  incrementalRowText?: string;
  config: TableColumnConfig[];
  initialSorting?: SortingCol;
  variant?: 'standard' | 'mini';
  filters?: singleFilterParams[];
  currentSelectedPageNumber?: number;
  onPageChange?: (value: OnPageChangeParams) => void;
}
