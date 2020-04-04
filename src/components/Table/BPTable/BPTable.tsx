import {
    CircularProgress,
    Collapse, Grid, IconButton, Paper, Table, TableBody,
    TableCell, TableHead, TablePagination, TableRow, Checkbox
} from '@material-ui/core';
import {
    FilterList as FilterIcon
} from '@material-ui/icons';
import {Query} from 'bizzle/search/query';
import React, {useEffect, useRef, useState} from 'react';
import useStyles, {tableFilterPanelHeight, tableTitleRowHeight} from './style';
import cx from 'classnames';
import {isEqual as _isEqual} from 'lodash';

interface BPTableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    initialQuery?: Query;
    height?: number;
    title: string;
    filters: React.ReactNode[];
    onQueryChange: (newQuery: Query) => void;
    totalNoRecords: number;
    loading?: boolean;
    tableSize?: 'medium' | 'small';
    onRowClick?: (rowClickProps: {
        clickedRowData: { [key: string]: any },
        clickedRowIdx: number
    }) => void;
    onSelectedDataChange?: (allSelectedData: { [key: string]: any }[]) => void;
    toolBarControls?: React.ReactNode[];
}

interface Column {
    field?: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    accessor?: (data: any) => string | number;
    addStyle?: { [key: string]: any };
}

const rowsPerPageOptions = [10, 25, 100, 150, 200, 250, 300, 350, 400];

const BPTable = (props: BPTableProps) => {
    const classes = useStyles();
    const [paginationComponentHeight, setPaginationComponentHeight] = useState(56);
    const [tableHeadHeight, setTableHeadHeight] = useState(53);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [query, setQuery] = useState(new Query({
        limit: props.initialQuery ? props.initialQuery.limit : 10,
        offset: props.initialQuery ? props.initialQuery.offset : 0,
        sorting: []
    }));
    const prevData = usePrevious(props.data);
    const tableHeight = props.height ? props.height : 600;
    const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([]);

    const tableWrapperHeight = filterPanelOpen
        ? tableHeight - tableTitleRowHeight - tableFilterPanelHeight - paginationComponentHeight
        : tableHeight - tableTitleRowHeight - paginationComponentHeight;
    const loadingWrapperHeight = tableWrapperHeight - tableHeadHeight;

    useEffect(() => {
        // this checks for a change in data to remove row selection
        if (!_isEqual(props.data, prevData)) {
            if (props.onSelectedDataChange) {
                props.onSelectedDataChange([]);
            }
            setSelectedRowIndices([]);
            return;
        }
        // if the data itself has not changed (i.e. contents of objects)
        // this checks to see if new objects have been constructed
        if ((props.data.length > 0) && (prevData !== undefined)) {
            const prevDataTyped: { [key: string]: any }[] = prevData as unknown as { [key: string]: any }[];
            if (props.data[0] !== prevDataTyped[0]) {
                setSelectedRowIndices([]);
                return;
            }
        }
    }, [props, props.data, prevData]);

    const handleChangePage = (event: unknown, newPage: number) => {
        if (props.loading) {
            return;
        }
        query.offset = newPage * query.limit;
        setQuery(new Query(query));
        props.onQueryChange(query);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.loading) {
            return;
        }
        query.offset = 0;
        query.limit = +event.target.value;
        setQuery(new Query(query));
        props.onQueryChange(query);
    };

    const renderCellData = (
        data: { [key: string]: any },
        field?: string,
        accessor?: (data: any) => string | number
    ): string | number => {
        try {
            // if an accessor function was provided, call it with the data
            let accessedData: string | number = '';
            if (accessor) {
                accessedData = accessor(data);
            } else if (field) {
                // otherwise use provided field to get data
                accessedData = data[field];
            } else {
                console.error('neither field nor accessor provided to column');
                return '-';
            }
            return accessedData;
        } catch (e) {
            console.error('error rendering cell data', e);
            return '-';
        }
    };

    const handleRowSelect = (
        clickedRowIdx: number,
        clickedRowData: { [key: string]: any }
    ) => () => {
        let updatedSelectedRowIndices: number[] = [];
        // check if this row is already selected
        if (selectedRowIndices.includes(clickedRowIdx)) {
            // remove the selected row idx
            updatedSelectedRowIndices = selectedRowIndices.filter((selectedRowIdx) =>
                selectedRowIdx !== clickedRowIdx
            );
        } else {
            // add it this row idx as a selected one
            updatedSelectedRowIndices = [
                ...selectedRowIndices,
                clickedRowIdx
            ];
        }
        setSelectedRowIndices(updatedSelectedRowIndices);
        if (props.onRowClick) {
            props.onRowClick({
                clickedRowData,
                clickedRowIdx
            });
        }
        if (props.onSelectedDataChange) {
            props.onSelectedDataChange(props.data.filter((data, idx) => updatedSelectedRowIndices.includes(idx)));
        }
    };

    const handleSelectAll = () => {
        if (selectedRowIndices.length === props.data.length) {
            // all rows already selected, clear rows selection
            setSelectedRowIndices([]);
            if (props.onSelectedDataChange) {
                props.onSelectedDataChange([]);
            }
        } else {
            // not all rows are selected, set all rows to selected
            setSelectedRowIndices(props.data.map((data, idx) => (idx)));
            if (props.onSelectedDataChange) {
                props.onSelectedDataChange(props.data);
            }
        }
    };

    return (
        <Paper className={classes.root}>
            <div className={classes.tableTitleLayout}>
                <div className={classes.tableTitle}>{props.title}</div>
                <div className={classes.tableTitleControlLayout}>
                    <Grid container spacing={1}>
                        {props.toolBarControls
                            ? props.toolBarControls.map((f, idx) => (
                                <Grid item key={idx}>
                                    {f}
                                </Grid>))
                            : null
                        }
                        <Grid item>
                            <IconButton
                                size={'small'}
                                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                                className={cx(
                                    classes.filterIcon,
                                    {[classes.filterIconPanelOpen]: filterPanelOpen || selectedRowIndices.length}
                                )}
                            >
                                <FilterIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Collapse in={filterPanelOpen}>
                <div className={classes.filterLayout}>
                    <Grid container spacing={2} alignItems={'center'}>
                        {props.filters.map((f, idx) => (
                            <Grid item key={idx}>
                                {f}
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Collapse>
            <div
                className={classes.tableWrapper}
                style={{height: tableWrapperHeight}}
            >
                <Table stickyHeader size={props.tableSize ? props.tableSize : 'small'}>
                    <TableHead
                        ref={(tableHeadRef: HTMLDivElement) => {
                            if (!tableHeadRef) {
                                return;
                            }
                            if (tableHeadRef.clientHeight && tableHeadRef.clientHeight !== tableHeadHeight) {
                                setTableHeadHeight(tableHeadRef.clientHeight);
                            }
                        }}
                    >
                        <TableRow>
                            <TableCell
                                align={'center'}
                                className={classes.tableHeaderCell}
                                padding={'checkbox'}
                            >
                                <Checkbox
                                    color={'primary'}
                                    indeterminate={!(
                                        selectedRowIndices.length === props.data.length || selectedRowIndices.length === 0
                                    )}
                                    checked={selectedRowIndices.length !== 0 && props.data.length === selectedRowIndices.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            {props.columns.map((col, idx) => (
                                <TableCell
                                    key={idx}
                                    align={col.align}
                                    style={{minWidth: col.minWidth}}
                                    className={classes.tableHeaderCell}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {!props.loading &&
                    <TableBody>
                        {props.data.map((data, rowIdx) => {
                            const rowIsSelected = selectedRowIndices.includes(rowIdx);
                            return (
                                <TableRow
                                    key={rowIdx}
                                    onClick={handleRowSelect(rowIdx, data)}
                                    className={cx(
                                        classes.tableRow,
                                        {[classes.tableRowSelected]: rowIsSelected}
                                    )}
                                >
                                    <TableCell
                                        align={'center'}
                                        className={classes.tableCell}
                                        padding={'checkbox'}
                                    >
                                        <Checkbox
                                            color={'primary'}
                                            checked={rowIsSelected}
                                        />
                                    </TableCell>
                                    {props.columns.map((col, colIdx) => {
                                        let addStyle: { [key: string]: any } = {};
                                        if (col.addStyle) {
                                            addStyle = col.addStyle;
                                        }
                                        return (
                                            <TableCell
                                                key={colIdx}
                                                style={addStyle}
                                            >
                                                {renderCellData(
                                                    data,
                                                    col.field,
                                                    col.accessor
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>}
                </Table>
                {props.loading &&
                <div
                  className={classes.loadingWrapper}
                  style={{height: loadingWrapperHeight}}
                >
                  <CircularProgress size={70}/>
                </div>}
            </div>
            <TablePagination
                ref={(paginationRef: HTMLDivElement) => {
                    if (!paginationRef) {
                        return;
                    }
                    if (paginationRef.clientHeight && paginationComponentHeight !== paginationRef.clientHeight) {
                        setPaginationComponentHeight(paginationRef.clientHeight);
                    }
                }}
                rowsPerPageOptions={(() => {
                    // check if rows per page options includes initial query.limit amount
                    if (props.initialQuery && !rowsPerPageOptions.includes(props.initialQuery.limit)) {
                        return ([
                            ...rowsPerPageOptions,
                            props.initialQuery.limit
                        ]).sort((a, b) => (a - b));
                    }
                    return rowsPerPageOptions;
                })()}
                component='div'
                count={props.totalNoRecords}
                rowsPerPage={query.limit}
                page={query.offset / query.limit}
                backIconButtonProps={{'aria-label': 'previous page'}}
                nextIconButtonProps={{'aria-label': 'next page'}}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
};


function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default BPTable;
