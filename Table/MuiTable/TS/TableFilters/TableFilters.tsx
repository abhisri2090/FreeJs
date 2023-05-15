/**
 * This is just one example of search box that we can show on above the table.
 * Whereas, more custom filter on the bases of different page can be passed to
 * 'filters' prop of Mui Table.
 */
import React, { useState, FC, useRef } from 'react';
import {
  Box,
  InputAdornment,
  makeStyles,
  PrimaryButton,
  SearchIcon,
  TextField,
  withStyles,
  Theme,
} from '@c2fo/react-components';

import { OnPageChangeParams } from '../MuiTable.schema';

interface SearchBoxParams {
  onSearch: (value: OnPageChangeParams) => void;
  label: string;
}

export interface singleFilterParams {
  type: 'search';
  props: SearchBoxParams;
}

interface PaginationParams {
  currentPageNumber: number;
  rowsPerPage: number;
}
interface TableFiltersProps extends PaginationParams {
  filters?: singleFilterParams[];
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    borderBottom: '1px Solid rgb(0, 58, 80)',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inputBox: {
    alignItems: 'center',
    display: 'flex',
  },
  button: { fontSize: theme.typography.pxToRem(14) },
}));

const SearchBox = withStyles(({ palette, typography }) => ({
  root: {
    '& input': {
      fontSize: typography.pxToRem(14),
      padding: '12px',
      paddingRight: '0px',
      borderRight: `1px Solid ${palette.divider}`,
      marginRight: '12px',
      borderColor: palette.error.main,
    },
    '& input: focus': {
      borderColor: palette.error.main,
      fontSize: typography.pxToRem(14),
      padding: '12px',
      paddingRight: '0px',
    },
  },
}))(TextField);

const TableFilters: FC<TableFiltersProps> = ({
  filters,
  currentPageNumber,
  rowsPerPage,
}) => {
  const searchBoxRef = useRef<HTMLInputElement | null>(null);
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState<string>('');

  const onSearchPress = (searchFun: CallableFunction) => {
    searchFun({
      searchText: searchBoxRef?.current?.value || '',
      currentPageNumber,
      rowsPerPage,
    });
  };

  const searchBar = ({ label, onSearch }: SearchBoxParams) => {
    return (
      <Box key={`${label}_searchBox`} className={classes.inputBox}>
        <SearchBox
          placeholder={label}
          role="FormInputField"
          type="text"
          // Uncomment this to show label on the top of search box
          // label={searchValue ? label : ''}
          value={searchValue}
          variant="outlined"
          inputProps={{
            'data-testid': `TableSearchFilter_${label}`,
            ref: (r: HTMLInputElement) => {
              searchBoxRef.current = r;
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="inherit" />
              </InputAdornment>
            ),
            endAdornment: (
              <PrimaryButton
                size="small"
                variant="text"
                className={classes.button}
                onClick={() => onSearchPress(onSearch)}
              >
                SEARCH
              </PrimaryButton>
            ),
          }}
          onChange={({ target }) => {
            setSearchValue(target.value);
          }}
        />
      </Box>
    );
  };

  if (!(Array.isArray(filters) && filters.length > 0)) return null;
  return (
    <Box className={classes.container}>
      {filters.map((item: singleFilterParams) => searchBar(item.props))}
    </Box>
  );
};

export default TableFilters;
