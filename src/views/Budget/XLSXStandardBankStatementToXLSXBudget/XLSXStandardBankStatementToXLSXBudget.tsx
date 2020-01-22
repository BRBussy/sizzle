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
        display: 'grid',
        gridTemplateRows: 'auto 1fr'
    }
}));

const XLSXStandardBankStatementToXLSXBudget = () => {
    const classes = useStyles();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');
            reader.onloadend = async () => {
                setLoading(true);
                const fileData: string = reader.result as string;
                try {
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
                                        <AppBar position={'static'}>
                                            <Tabs value={0}>
                                                {budgets.map((b, idx) => (
                                                    <Tab
                                                        key={idx}
                                                        label={b.month}
                                                        value={idx}
                                                    />
                                                ))}
                                            </Tabs>
                                        </AppBar>
                                    )
                                    : (
                                        <Typography>
                                            No Budgets
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
