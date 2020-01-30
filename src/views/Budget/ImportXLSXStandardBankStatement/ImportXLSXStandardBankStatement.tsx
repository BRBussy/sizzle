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

enum AppStep {
    selectFile,
    parseFile,
    performDuplicateCheck,
    prepareImport,
    performImport
}

const ImportXLSXStandardBankStatement = () => {
    const classes = useStyles();
    const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
    const [activeAppStep, setActiveAppStep] = useState<AppStep>(AppStep.selectFile);

    const handleFinishBudgetEntryParse = async (parsedBudgetEntries: BudgetEntry[]) => {
        setActiveAppStep(AppStep.performDuplicateCheck);
        setActiveAppStep(AppStep.performDuplicateCheck);
    };

    return (
        <Card>
            <CardHeader
                title={<Stepper activeStep={activeAppStep} alternativeLabel>
                    <Step key={AppStep.selectFile}>
                        <StepLabel>Select File</StepLabel>
                    </Step>
                    <Step key={AppStep.parseFile}>
                        <StepLabel>Parse File</StepLabel>
                    </Step>
                    <Step key={AppStep.performDuplicateCheck}>
                        <StepLabel>Duplicate Check</StepLabel>
                    </Step>
                    <Step key={AppStep.selectFile}>
                        <StepLabel>Prepare Import</StepLabel>
                    </Step>
                    <Step key={AppStep.selectFile}>
                        <StepLabel>Perform Import</StepLabel>
                    </Step>
                </Stepper>}
            />
            <CardContent>
                {(() => {
                    switch (activeAppStep) {
                        case AppStep.selectFile:
                            return (
                                <SelectFileStep
                                    onStartStatementParse={() => setActiveAppStep(AppStep.parseFile)}
                                    onFinishStatementParse={handleFinishBudgetEntryParse}
                                />
                            );

                        case AppStep.parseFile:
                        case AppStep.performDuplicateCheck:
                            return (<CircularProgress/>)
                        default:
                            return null;
                    }
                })()}
            </CardContent>
        </Card>
    );
};

export default ImportXLSXStandardBankStatement;

interface SelectFileStepProps {
    onStartStatementParse: () => void;
    onFinishStatementParse: (parsedBudgetEntries: BudgetEntry[]) => void;
}


const useSelectFileStepStyles = makeStyles((theme: Theme) => createStyles({}));

const SelectFileStep = (props: SelectFileStepProps) => {
    const classes = useSelectFileStepStyles();
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');
            reader.onloadend = async () => {
                const fileData: string = reader.result as string;
                try {
                    props.onStartStatementParse();
                    props.onFinishStatementParse((await BudgetEntryAdmin.XLSXStandardBankStatementToBudgetEntries({
                        xlsxStatement: fileData.slice(fileData.indexOf(',') + 1)
                    })).budgetEntries);
                } catch (e) {
                    console.error('error processing file', e);
                }
            };
            reader.readAsDataURL(file);
        });
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <Card>
            <CardHeader title={'Select File'}/>
            <CardContent {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive
                    ? <p>Drop file here</p>
                    : <p>Drag & drop file here, or click to select</p>
                }
            </CardContent>
        </Card>
    )
};
