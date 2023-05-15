import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Theme,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  makeStyles,
  TableSortLabel,
  TableContainer,
  AncillaryButton,
  Tooltip,
  useTheme,
  SearchDuotoneIcon,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomTableRow from './TableRow';
import TableFilters from './TableFilters';
// move this file to common TS types folder
import { CustomTableProps, SortingCol } from './MuiTable.schema';

// use an Error img
// import Error from '../assets/svg/Error.svg';

/**
 * Translate - this is the wrapper around the react-i18n for internationalisation
 * uncomment this for time being (to escape from error)
 */
// const Translate = ({ children }) => <span>{children}</span>;

// move this variable to the constant files
const ROW_PER_PAGE = 20;

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    paddingBottom: theme.spacing(1),
  },
  tableContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  tableFooter: {
    flex: 1,
    padding: theme.spacing(2),
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullTableHeight: {
    minHeight: '32rem',
  },
  tableBody: {
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: {
    height: '103px',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(4),
    width: '100px',
  },
  miniPagination: {
    padding: '8px',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}));

/**
 * @param {} config configuration of the table column (column header & cell data)
 * @param {} customFilters array of custom filters
 * @param {} filters array of filters (only default filters) (currently it has only Search filter)
 * @param {} maxData max data count (used for pagination count)
 * @param {} onPageChange callback on Next or Prev button click
 * @param {} data array of objects for the table row
 * @param {} isLoading makes table in loading state
 * @param {} noDataText in case table doesn't have any data (data array is empty)
 * @param {} errorMsg in case of error for table list api
 * @param {} keyExtractor pass an api primary key, which is unique for a row data
 * @example
 * <CustomTable
    data={[]}
    config={[
      {
        columnLabel: ('User Name'),
        cell: ({ rowData }) => {
          const {firstName, lastName} = rowData
          return `${firstName} ${lastName}`
        },
      },
      {
        columnLabel: 'Email',
        selectorKey: 'emailAddress',
      },
    ]}
    keyExtractor="userId"
    maxData={totalDataCount}
    noDataText="No Data Found"
    errorMsg={listingApiError && 'Unable to load data'}
    isLoading={listingApiLoading}
    onPageChange={onTablePageChange}
    variant='mini'
    incrementalRowText="show more merchants"
    filters={[
      { type: 'search', props: { onSearch: handelTableAction, label: 'Search User' } }
    ]}
    customFilters={[
       ({ currentPageNumber, rowsPerPage, searchText }: OnPageChangeParams) => <Button>Filter 1</Button>,
       ({ currentPageNumber, rowsPerPage, searchText }: OnPageChangeParams) => <Button>Filter 2</Button>,
     ]}
  />
 */
const CustomTable: React.FC<CustomTableProps> = ({
  data,
  config,
  filters,
  variant,
  errorMsg,
  noDataText,
  maxData = 1,
  keyExtractor,
  onPageChange,
  initialSorting,
  isLoading = false,
  incrementalRowText,
  currentSelectedPageNumber,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  // Considering lowest page number as 1
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const { t } = useTranslation();
  const [currentSelectedPage, setCurrentSelectedPage] = useState(
    currentSelectedPageNumber || 0
  );
  // keep track of column's sorting
  const [sortedCol, setSortedCol] = useState<SortingCol>(initialSorting);

  useEffect(() => {
    setMaxPageNumber(Math.ceil(maxData / ROW_PER_PAGE));
  }, [maxData]);

  useEffect(() => {
    if (
      currentSelectedPageNumber &&
      currentSelectedPageNumber !== currentSelectedPage
    )
      setCurrentSelectedPage(currentSelectedPageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedPageNumber]);

  const handleChangePage = useCallback(
    (isNextPressed = false) => {
      setCurrentSelectedPage((pre) => {
        let currentPageNumber = 0;
        if (isNextPressed) currentPageNumber = pre + 1;
        else currentPageNumber = pre - 1 < 0 ? 0 : pre - 1;
        if (onPageChange)
          onPageChange({ currentPageNumber, rowsPerPage: ROW_PER_PAGE });
        return currentPageNumber;
      });
    },
    [onPageChange]
  );

  const getSortingTitle = (isSorted: boolean, type?: 'asc' | 'desc') => {
    if (!isSorted) return t('newBuyerApp.sortInAsc', 'Sort in ascending order');
    if (type === 'asc')
      return t('newBuyerApp.sortedInAsc', 'Sorted in ascending order');
    return t('newBuyerApp.sortedInDesc', 'Sorted in descending order');
  };

  const getTableHeadingRow = () => {
    const tableHeader: JSX.Element[] = [];
    config.forEach((header, index) => {
      const { hide, columnLabel, align, onSort } = header;
      if (hide) return false;
      const isSorted = sortedCol?.colIndex === index;
      tableHeader.push(
        <TableCell key={`header${columnLabel}`} align={align}>
          {onSort === undefined ? (
            <Translate TypeTableHeader>{columnLabel}</Translate>
          ) : (
            <Tooltip
              title={getSortingTitle(isSorted, sortedCol?.direction)}
              placement="top"
            >
              <TableSortLabel
                active={isSorted}
                direction={isSorted ? sortedCol?.direction : 'asc'}
                onClick={() => {
                  if (onSort) {
                    const dir =
                      isSorted && sortedCol?.direction === 'asc'
                        ? 'desc'
                        : 'asc';
                    const direction = onSort(dir);
                    // this is done, if on some condition we don't want to sort the column
                    if (direction === null) return;
                    setSortedCol({
                      colIndex: index,
                      direction:
                        typeof direction === 'string' ? direction : dir,
                    });
                  }
                }}
              >
                <Translate TypeTableHeader>{columnLabel}</Translate>
              </TableSortLabel>
            </Tooltip>
          )}
        </TableCell>
      );
    });
    return tableHeader;
  };

  const getTableBody = () => {
    if (!isLoading && Array.isArray(data) && data.length > 0)
      return (
        <TableBody>
          {data.map((rowData, index) => {
            return (
              <TableRow
                tabIndex={-1}
                key={`row${rowData[keyExtractor]}-${index}`}
              >
                <CustomTableRow
                  key={`${rowData[keyExtractor]}`}
                  rowData={rowData}
                  rowIndex={index}
                  config={config}
                />
              </TableRow>
            );
          })}
        </TableBody>
      );
    return null;
  };

  const isBackDisabled = useCallback(() => {
    return currentSelectedPage === 0;
  }, [currentSelectedPage]);

  const isNextDisabled = useCallback(() => {
    // Table data is empty
    if (!isLoading && !(Array.isArray(data) && data.length > 0)) return true;
    // Is last page
    if (currentSelectedPage === maxPageNumber - 1) return true;
    return false;
  }, [currentSelectedPage, data, isLoading, maxPageNumber]);

  const loadingBody = () => <Translate k="loading">Loading</Translate>;

  const noDataBody = () => (
    <Box className={classes.row}>
      <SearchDuotoneIcon className={classes.img} />
      <>
        {noDataText ? (
          <Translate>{noDataText}</Translate>
        ) : (
          <Translate k="noRecords">There are no records to display</Translate>
        )}
      </>
    </Box>
  );

  const errorBody = () => (
    <Box className={classes.row}>
      <img src={Error} className={classes.img} />
      <Translate>{`Error: ${
        typeof errorMsg === 'string' ? errorMsg : 'Unable to find data'
      }`}</Translate>
    </Box>
  );

  const fullWidthTableBody = () => {
    let ui;
    if (isLoading) ui = loadingBody();
    // if we got the data;
    else if (Array.isArray(data) && data.length > 0) return null;
    else if (errorMsg) ui = errorBody();
    else if (Array.isArray(data)) ui = noDataBody();

    return (
      <Box className={[classes.fullTableHeight, classes.tableBody].join(' ')}>
        {ui}
      </Box>
    );
  };

  const tablePagination = () => {
    if (!data || data.length === 0) return null;
    if (variant === 'mini')
      return (
        <>
          <Box
            style={{
              flex: 1,
              height: '100%',
            }}
          />
          <Box
            className={classes.miniPagination}
            onClick={() => handleChangePage(true)}
          >
            {/* TODO: Add translation key for 'incrementalRowText' as well OR restrict it for string */}
            <AncillaryButton size="small">
              {incrementalRowText || 'show more'}
            </AncillaryButton>
          </Box>
        </>
      );
    return (
      <Box width={1} className={classes.tableFooter}>
        <AncillaryButton
          disabled={isBackDisabled()}
          onClick={() => handleChangePage(false)}
        >
          <Translate k="back">BACK</Translate>
        </AncillaryButton>
        {maxPageNumber > 0 && (
          <Translate
            variant="body2"
            TypeTableHeader
            customColor={theme.palette.text.primary}
          >{`${currentSelectedPage + 1} of ${maxPageNumber}`}</Translate>
        )}
        <AncillaryButton
          disabled={isNextDisabled()}
          onClick={() => handleChangePage(true)}
        >
          <Translate k="next">NEXT</Translate>
        </AncillaryButton>
      </Box>
    );
  };

  return (
    <>
      {/* This will be added on top of you table if in case you want to have some search bar like functionality */}
      <TableFilters
        filters={filters}
        currentPageNumber={currentSelectedPage}
        rowsPerPage={ROW_PER_PAGE}
      />
      <TableContainer className={classes.tableContainer}>
        <Table
          className={classes.table}
          style={{
            // this is a just to fix max width of table, most probably you want to remove it
            minWidth: '700px',
          }}
          aria-label="customized table"
        >
          <TableHead>
            {/* This renders the table header row */}
            <TableRow>{getTableHeadingRow()}</TableRow>
          </TableHead>
          {/* This renders the main body of the table / data */}
          {getTableBody()}
        </Table>
        {/* This is required in case of error / loading / no data; when we don't want to show table column */}
        {fullWidthTableBody()}
        {!isLoading && tablePagination()}
      </TableContainer>
    </>
  );
};

export default CustomTable;
