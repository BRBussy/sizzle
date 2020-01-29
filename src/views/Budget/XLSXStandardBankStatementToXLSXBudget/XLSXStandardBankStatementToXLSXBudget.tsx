import {
    AppBar,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    makeStyles,
    Tab,
    Tabs,
    Theme,
    Typography
} from '@material-ui/core';
import {Budget, BudgetAdmin} from 'bizzle/budget';
import cx from 'classnames';
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {FETable} from 'components/Table';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridRowGap: theme.spacing(1)
    },
    budgetsLoadingLayout: {
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'center'
    },
    budgetsLayout: {
        // display: 'grid',
        // gridTemplateRows: 'auto 1fr',
        // gridTemplateColumns: '1fr'
    }
}));

const XLSXStandardBankStatementToXLSXBudget = () => {
    const classes = useStyles();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedBudgetTabIndex, setSelectedBudgetTabIndex] = useState<number>(0);
    const [selectedBudgetTabCategory, setSelectedBudgetTabCategory] = useState<string>('Summary');
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');
            reader.onloadend = async () => {
                setLoading(true);
                const fileData: string = reader.result as string;
                try {
                    setSelectedBudgetTabIndex(0);
                    setBudgets((await BudgetAdmin.XLSXStandardBankStatementToBudgets({
                        xlsxStatement: fileData.slice(fileData.indexOf(',') + 1)
                    })).budgets);
                } catch (e) {
                    console.error('error processing file', e);
                }
                setLoading(false);
            };
            reader.readAsDataURL(file);
        });
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const handleBudgetTabIndexChange = (e: any, newTabValue: number) => {
        setSelectedBudgetTabIndex(newTabValue);
    };

    const handleBudgetCategoryTabChange = (e: any, newTabValue: string) => {
        setSelectedBudgetTabCategory(newTabValue);
    };

    return (
        <div className={classes.root}>
            <Card>
                <CardHeader title={'Upload XLSX File'}/>
                <CardContent {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive
                        ? <p>Drop file here</p>
                        : <p>Drag & drop file here, or click to select</p>
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader title={'Budgets'}/>
                <CardContent
                    classes={{
                        root: cx({
                            [classes.budgetsLoadingLayout]: loading,
                            [classes.budgetsLayout]: !loading
                        })
                    }}
                >
                    {loading
                        ? (
                            <CircularProgress/>
                        )
                        : (
                            <React.Fragment>
                                {budgets.length
                                    ? (
                                        <React.Fragment>
                                            <AppBar position={'static'}>
                                                <Tabs
                                                    scrollButtons={'on'}
                                                    value={selectedBudgetTabIndex}
                                                    variant={'scrollable'}
                                                    onChange={handleBudgetTabIndexChange}
                                                >
                                                    {budgets.map((b, idx) => (
                                                        <Tab
                                                            key={idx}
                                                            label={`${b.year} - ${b.month}`}
                                                            value={idx}
                                                        />
                                                    ))}
                                                </Tabs>
                                            </AppBar>
                                            <Card>
                                                <CardContent>
                                                    <AppBar position={'static'}>
                                                        <Tabs
                                                            scrollButtons={'on'}
                                                            value={selectedBudgetTabCategory}
                                                            variant={'scrollable'}
                                                            onChange={handleBudgetCategoryTabChange}
                                                        >
                                                            <Tab
                                                                label={'Summary'}
                                                                value={'Summary'}
                                                            />
                                                            {Object.keys(budgets[selectedBudgetTabIndex].entries).map((category, idx) => (
                                                                <Tab
                                                                    key={idx}
                                                                    label={category}
                                                                    value={category}
                                                                />
                                                            ))}
                                                        </Tabs>
                                                    </AppBar>
                                                    {(()=>{
                                                        if (selectedBudgetTabCategory === 'Summary') {
                                                            return (
                                                              <div>Summary</div>
                                                            );
                                                        }
                                                        return (
                                                            <FETable
                                                                data={budgets[selectedBudgetTabIndex].entries[selectedBudgetTabCategory]}
                                                                columns={[
                                                                    {
                                                                        field: 'date',
                                                                        label: 'Date'
                                                                    },
                                                                    {
                                                                        field: 'description',
                                                                        label: 'Description'
                                                                    },
                                                                    {
                                                                        field: 'amount',
                                                                        label: 'Amount'
                                                                    }
                                                                ]}
                                                                height={400}
                                                                title={selectedBudgetTabCategory}
                                                            />
                                                        )
                                                    })()}
                                                </CardContent>
                                            </Card>
                                        </React.Fragment>
                                    )
                                    : (
                                        <Typography>
                                            No Budget
                                        </Typography>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default XLSXStandardBankStatementToXLSXBudget;
