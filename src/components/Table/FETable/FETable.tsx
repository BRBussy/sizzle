import React, {useState} from 'react';
import {
    IconButton, Paper, Table,
    TableBody, TableCell,
    TableHead, TablePagination, TableRow
} from '@material-ui/core';
import {FilterList as FilterIcon} from '@material-ui/icons';
import useStyles, {tableTitleRowHeight} from './style';

interface FETableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    title: string;
    height?: number;
    initialRowsPerPage?: number;
    tableSize?: 'medium' | 'small';
}

interface Column {
    field?: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    accessor?: (data: {[key: string]: any}, dataIdx: number) => string | number | React.ReactNode;
    addStyle?: { [key: string]: any };
}

const renderCellData = (
    data: { [key: string]: any },
    dataIdx: number,
    field?: string,
    accessor?: (data: {[key: string]: any}, dataIdx: number) => string | number | React.ReactNode
): string | number | React.ReactNode => {
    try {
        // if an accessor function was provided, call it with the data
        let accessedData: string | number | React.ReactNode = '';
        if (accessor) {
            accessedData = accessor(data, dataIdx);
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

export default function FETable(props: FETableProps) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.initialRowsPerPage ? props.initialRowsPerPage : 10);
    const [paginationComponentHeight, setPaginationComponentHeight] = useState(56);
    const [tableHeadHeight, setTableHeadHeight] = useState(53);
    const tableHeight = props.height ? props.height : 600;

    const tableWrapperHeight = tableHeight - tableTitleRowHeight - paginationComponentHeight;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            {props.title &&
            <div className={classes.tableTitleLayout}>
                <div className={classes.tableTitle}>{props.title}</div>
                <div className={classes.tableTitleControlLayout}>
                    <IconButton size={'small'}>
                        <FilterIcon/>
                    </IconButton>
                </div>
            </div>}
            <div
                className={classes.tableWrapper}
                style={{height: tableWrapperHeight}}
            >
                <Table stickyHeader size={props.tableSize ? props.tableSize : 'small'}>
                    <TableHead
                        ref={(tableHeadRef: HTMLTableSectionElement | null) => {
                            if (!tableHeadRef) {
                                return;
                            }
                            if (tableHeadRef.clientHeight && tableHeadRef.clientHeight !== tableHeadHeight) {
                                setTableHeadHeight(tableHeadRef.clientHeight);
                            }
                        }}
                    >
                        <TableRow>
                            {props.columns.map((col, colIdx) => (
                                <TableCell
                                    key={colIdx}
                                    align={col.align}
                                    style={{minWidth: col.minWidth}}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, rowIdx) => {
                            return (
                                <TableRow key={rowIdx}>
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
                                                    rowIdx,
                                                    col.field,
                                                    col.accessor
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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
                rowsPerPageOptions={[10, 20, 25, 100, 150, 200, 250, 300, 350, 400]}
                component='div'
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}