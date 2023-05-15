// -------------- Under Development --------------

import React from 'react';
import { screen, render } from '@testing-library/react';
import MuiTable from './MuiTable';
import { TableColumnConfig } from './MuiTable.schema';

const ROW_PER_PAGE = 20;
const noCellData = '--';

const columnConfig: TableColumnConfig[] = [
  {
    columnLabel: 'randomColumnLabel',
    selectorKey: 'apiKey_A',
  },
  {
    columnLabel: 'randomColumnLabel2',
    cell: ({ rowData }) => rowData.apiKey_B as string,
  },
];

describe('Custom Table Testing', () => {
  it('Normal table rendering', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          maxData={2}
          config={columnConfig}
          data={[
            { apiKey_A: '1aa', apiKey_B: '1bb' },
            { apiKey_A: '2aa', apiKey_C: '' },
          ]}
          isLoading={false}
        />
      </MuiThemeProvider>
    );

    expect(screen.getByText('randomColumnLabel')).toBeInTheDocument();
    expect(screen.getByText('randomColumnLabel2')).toBeInTheDocument();
    expect(screen.getByText('1aa')).toBeInTheDocument();
    expect(screen.getByText('2aa')).toBeInTheDocument();
    expect(screen.getByText('1bb')).toBeInTheDocument();
    expect(screen.getByText(noCellData)).toBeInTheDocument();
  });

  it.skip('Table rendering in loading state', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          maxData={2}
          config={[
            {
              ...columnConfig[0],
              right: true,
            },
          ]}
          data={[{ apiKey_A: 'aa' }, { apiKey_A: '11' }]}
          keyExtractor="apiKey_A"
          isLoading={true}
        />
      </MuiThemeProvider>
    );

    expect(screen.getByText('randomColumnLabel')).toBeInTheDocument();
    expect(screen.queryByText('aa')).not.toBeInTheDocument();
  });

  it.skip('Table rendering in with no data', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          maxData={0}
          config={[columnConfig[0]]}
          data={[]}
          isLoading={false}
        />
      </MuiThemeProvider>
    );

    expect(screen.getByText('randomColumnLabel')).toBeInTheDocument();
    expect(screen.queryByText('aa')).not.toBeInTheDocument();
    expect(
      screen.getByText('There are no records to display')
    ).toBeInTheDocument();
  });

  it.skip('Table rendering in case of error', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          maxData={0}
          config={[columnConfig[0]]}
          data={[]}
          isLoading={false}
          errorMsg={true}
        />
      </MuiThemeProvider>
    );

    expect(screen.getByText('randomColumnLabel')).toBeInTheDocument();
    expect(screen.queryByText('aa')).not.toBeInTheDocument();
    expect(screen.getByText('Error: Unable to find data')).toBeInTheDocument();
  });

  it.skip('Table rendering in case of error with error specified msg', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          maxData={0}
          config={[columnConfig[0]]}
          data={[]}
          isLoading={false}
          errorMsg="GQL api failed test"
        />
      </MuiThemeProvider>
    );

    expect(screen.getByText('randomColumnLabel')).toBeInTheDocument();
    expect(screen.queryByText('aa')).not.toBeInTheDocument();
    expect(screen.getByText('Error: GQL api failed test')).toBeInTheDocument();
  });

  it.skip('Testing for number of rows displayed per page', async () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          maxData={45}
          config={columnConfig}
          data={new Array(20).fill({ apiKey_A: '1aa', apiKey_B: '1bb' })}
          isLoading={false}
        />
      </MuiThemeProvider>
    );

    expect(await screen.findAllByText('1aa')).toHaveLength(ROW_PER_PAGE);
  });

  it.skip('Testing NEXT page button clicked', async () => {
    const onPageChangeMock = jest.fn(({ currentPageNumber, rowsPerPage }) => {
      expect(currentPageNumber).toBe(2);
      expect(rowsPerPage).toBe(ROW_PER_PAGE);
    });

    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          config={columnConfig}
          data={new Array(20).fill({ apiKey_A: '1aa', apiKey_B: '1bb' })}
          maxData={40}
          isLoading={false}
          onPageChange={onPageChangeMock}
        />
      </MuiThemeProvider>
    );

    screen.getByText('NEXT').click();
    expect(onPageChangeMock).toBeCalledTimes(1);
  });

  it.skip('Testing BACK page button clicked', () => {
    const onPageChangeMock = jest.fn(
      ({ currentPageNumber, nextOffset, requiredDataCount }) => {}
    );

    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          config={columnConfig}
          data={new Array(20).fill({ apiKey_A: '1aa', apiKey_B: '1bb' })}
          maxData={40}
          isLoading={false}
          onPageChange={onPageChangeMock}
        />
      </MuiThemeProvider>
    );

    screen.getByText('NEXT').click();
    screen.getByText('BACK').click();

    expect(onPageChangeMock).toBeCalledTimes(2);
  });

  it.skip('Testing for search filter', async () => {
    const onSearchClickedMock = jest.fn(
      ({ currentPageNumber, rowsPerPage, searchText }) => {
        expect(currentPageNumber).toBe(1);
        expect(rowsPerPage).toBe(ROW_PER_PAGE);
        expect(searchText).toBe('randomSearchValue');
      }
    );

    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          config={columnConfig}
          data={[{ apiKey_A: '1aa', apiKey_B: '1bb' }]}
          maxData={1}
          isLoading={false}
          filters={[
            {
              type: 'search',
              props: {
                onSearch: onSearchClickedMock,
                label: 'mockSearchLabel',
              },
            },
          ]}
        />
      </MuiThemeProvider>
    );

    const searchBox = screen.getByTestId('TableSearchFilter_mockSearchLabel');

    userEvent.type(searchBox, 'randomSearchValue');
    screen.getByText('SEARCH').click();

    expect(onSearchClickedMock).toBeCalledTimes(1);
  });

  it.skip('Testing for search filter on no filter provided', () => {
    render(
      <MuiThemeProvider>
        <MuiTable
          keyExtractor="apiKey_A"
          config={columnConfig}
          data={[{ apiKey_A: '1aa', apiKey_B: '1bb' }]}
          maxData={1}
          isLoading={false}
          filters={[]}
        />
      </MuiThemeProvider>
    );

    expect(screen.queryByText('SEARCH')).not.toBeInTheDocument();
  });
});
