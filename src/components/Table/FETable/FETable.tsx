import React, {useState} from 'react';
import {
    IconButton,
    makeStyles, Paper, Table,
    TableBody, TableCell,
    TableHead, TablePagination, TableRow
} from '@material-ui/core';
import {FilterList as FilterIcon} from '@material-ui/icons';
import useStyles, {tableTitleRowHeight} from './style';

interface OldColumn {
    id: 'name' | 'code' | 'population' | 'size' | 'density';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: OldColumn[] = [
    {id: 'name', label: 'Name', minWidth: 170},
    {id: 'code', label: 'ISO\u00a0Code', minWidth: 100},
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString()
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString()
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toFixed(2)
    }
];

interface Data {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

function createData(name: string, code: string, population: number, size: number): Data {
    const density = population / size;
    return {name, code, population, size, density};
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767)
];

interface FETableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    title: string;
    height?: number;
}

interface Column {
    field?: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    accessor?: (data: any) => string | number;
    addStyle?: { [key: string]: any };
}

export default function FETable(props: FETableProps) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
            <div className={classes.tableTitleLayout}>
                <div className={classes.tableTitle}>{props.title}</div>
                <div className={classes.tableTitleControlLayout}>
                    <IconButton size={'small'}>
                        <FilterIcon/>
                    </IconButton>
                </div>
            </div>
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
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                            return (
                                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
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
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}