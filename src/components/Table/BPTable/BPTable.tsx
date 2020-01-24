import {
    CircularProgress,
    Collapse, Grid, IconButton, Paper, Table, TableBody,
    TableCell, TableHead, TablePagination, TableRow
} from '@material-ui/core';
import {
    FilterList as FilterIcon
} from '@material-ui/icons';
import {Query} from 'bizzle/search/query';
import React, {useState} from 'react';
import useStyles, {tableFilterPanelHeight, tableTitleRowHeight} from './style';

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
}

interface Column {
    field?: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    accessor?: (data: any) => string | number;
    addStyle?: { [key: string]: any };
}

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
    const tableHeight = props.height ? props.height : 600;

    const tableWrapperHeight = filterPanelOpen
        ? tableHeight - tableTitleRowHeight - tableFilterPanelHeight - paginationComponentHeight
        : tableHeight - tableTitleRowHeight - paginationComponentHeight;
    const loadingWrapperHeight = tableWrapperHeight - tableHeadHeight;

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

    return (
        <Paper className={classes.root}>
            <div className={classes.tableTitleLayout}>
                <div className={classes.tableTitle}>{props.title}</div>
                <div className={classes.tableTitleControlLayout}>
                    <IconButton
                        size={'small'}
                        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                    >
                        <FilterIcon/>
                    </IconButton>
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
                <Table stickyHeader>
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
                            {props.columns.map((col, idx) => (
                                <TableCell
                                    key={idx}
                                    align={col.align}
                                    style={{minWidth: col.minWidth}}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {!props.loading &&
                    <TableBody>
                        {props.data.map((data, rowIdx) => {
                            return (
                                <TableRow
                                    key={rowIdx}
                                >
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
                rowsPerPageOptions={[10, 15, 20, 25, 100]}
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

export default BPTable;
