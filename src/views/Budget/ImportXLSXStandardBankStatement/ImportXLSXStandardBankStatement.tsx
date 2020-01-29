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
    Typography,
    Stepper,
    Step,
    StepLabel,
} from '@material-ui/core';
import {BudgetEntry, BudgetEntryAdmin} from 'bizzle/budget/entry';
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

enum AppState {
    selectFile,
    parseFile,
    performDuplicateCheck,
    prepareImport
}

const ImportXLSXStandardBankStatement = () => {
    const classes = useStyles();
    const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [appState, setAppState] = useState<AppState>(AppState.selectFile);
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');
            reader.onloadend = async () => {
                setLoading(true);
                const fileData: string = reader.result as string;
                try {
                    setBudgetEntries((await BudgetEntryAdmin.XLSXStandardBankStatementToBudgetEntries({
                        xlsxStatement: fileData.slice(fileData.indexOf(',') + 1)
                    })).budgetEntries);
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
                <CardHeader
                    title={<Stepper activeStep={appState} alternativeLabel>
                        <Step key={AppState.selectFile}>
                            <StepLabel>Select File</StepLabel>
                        </Step>
                        <Step key={AppState.selectFile}>
                            <StepLabel>Prepare Import</StepLabel>
                        </Step>
                    </Stepper>}
                />
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
                        : ((() => {
                            switch (appState) {
                                case AppState.selectFile:
                                    return;
                            }
                            return null;
                        })())
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default ImportXLSXStandardBankStatement;

const SelectFileStep = () => {
    return (
        <div></div>
    )
};
