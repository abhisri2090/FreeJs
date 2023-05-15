import React, { memo, useState } from 'react';
import { TableCell } from '@mui/material';
import { TableColumnConfig, TableRowDataProps } from './MuiTable.schema';

/**
 * Translate - this is the wrapper around the react-i18n for internationalisation
 * uncomment this for time being (to escape from error)
 */
// const Translate = ({ children }) => <span>{children}</span>;

interface CustomTableRowProps {
  rowData: TableRowDataProps;
  rowIndex: number;
  config: TableColumnConfig[];
}

// move this variable to the constant files
const noCellData = '--';
const CustomTableRow: React.FC<CustomTableRowProps> = ({
  rowData,
  rowIndex,
  config,
}) => {
  const [updatedRowDataVariable, setUpdatedRowDataVariable] = useState<
    Record<string, unknown>
  >({});

  const row: JSX.Element[] = [];
  config.forEach((heading, cellIndex) => {
    const { hide, align } = config[cellIndex];
    if (hide) return false;

    const { selectorKey, cell } = heading;
    let cellData;
    if (selectorKey) cellData = rowData[selectorKey];
    else if (cell)
      cellData = cell({
        rowData,
        rowIndex,
        setUpdatedRowDataVariable,
        updatedRowDataVariable,
      });

    row.push(
      <TableCell align={align} key={cellIndex}>
        <Translate>{cellData ?? noCellData}</Translate>
      </TableCell>
    );
  });

  return <>{row}</>;
};

export default memo(CustomTableRow);
