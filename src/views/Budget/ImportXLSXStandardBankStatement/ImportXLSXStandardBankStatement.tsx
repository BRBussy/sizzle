import {
    AppBar, Button, Card, CardContent, CardHeader,
    CircularProgress, Tab, Tabs, Stepper,
    Step, StepLabel, TextField, MenuItem
} from '@material-ui/core';
import { BudgetEntry, BudgetEntryAdmin } from 'bizzle/budget/entry';
import { BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore } from 'bizzle/budget/entry/categoryRule';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FETable } from 'components/Table';
import { DuplicateCheckResponse, DuplicateEntries } from 'bizzle/budget/entry/Admin';
import moment from 'moment';

enum AppStep {
    preparation,
    selectFile,
    parseFile,
    performDuplicateCheck,
    prepareImport,
    performImport,
    done
}

const ImportXLSXStandardBankStatement = () => {
    const [, setBudgetEntries] = useState<BudgetEntry[]>([]);
    const [activeAppStep, setActiveAppStep] = useState<AppStep>(AppStep.preparation);
    const [error, setError] = useState<string | undefined>(undefined);
    const [duplicateCheckResponse, setDuplicateCheckResponse] = useState<DuplicateCheckResponse>({
        uniques: [],
        exactDuplicates: [],
        suspectedDuplicates: []
    });
    const [budgetEntryCategoryRules, setBudgetEntryCategoryRules] = useState<BudgetEntryCategoryRule[]>([]);

    useEffect(() => {
        const fetchBudgetEntryCategoryRules = async () => {
            try {
                setBudgetEntryCategoryRules((await BudgetEntryCategoryRuleStore.FindMany({
                    criteria: {}
                })).records);
                setActiveAppStep(AppStep.selectFile);
            } catch (e) {
                console.error(`error fetching budget entry category rules: ${e.message ? e.message : e.toString()}`)
            }
        };
        fetchBudgetEntryCategoryRules().finally();
    }, []);

    const handleFinishBudgetEntryParse = async (parsedBudgetEntries: BudgetEntry[]) => {
        setActiveAppStep(AppStep.performDuplicateCheck);
        setBudgetEntries(parsedBudgetEntries);
        try {
            setDuplicateCheckResponse(await BudgetEntryAdmin.DuplicateCheck({
                budgetEntries: parsedBudgetEntries
            }));
        } catch (e) {
            console.error('error performing duplicate check', e.message ? e.message : e.toString);
            setError(e.message ? e.message : e.toString);
            return;
        }
        setActiveAppStep(AppStep.prepareImport);
    };

    const handleImport = async (entriesToCreate: BudgetEntry[], entriesToUpdate: BudgetEntry[]) => {
        setActiveAppStep(AppStep.performImport);
        try {
            await BudgetEntryAdmin.CreateMany({
                budgetEntries: entriesToCreate
            })
        } catch (e) {
            console.error('error performing import', e.message ? e.message : e.toString);
            setError(e.message ? e.message : e.toString);
            return;
        }
        setActiveAppStep(AppStep.done);
    };

    if (error) {
        return (
            <div>
                {error}
            </div>
        )
    }

    return (
        <Card>
            <CardHeader
                title={<Stepper activeStep={activeAppStep} alternativeLabel>
                    <Step key={AppStep.preparation}>
                        <StepLabel>Preparation</StepLabel>
                    </Step>
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
                        case AppStep.preparation:
                            return (<CircularProgress />);

                        case AppStep.selectFile:
                            return (
                                <SelectFileStep
                                    onStartStatementParse={() => setActiveAppStep(AppStep.parseFile)}
                                    onFinishStatementParse={handleFinishBudgetEntryParse}
                                />
                            );

                        case AppStep.parseFile:
                        case AppStep.performDuplicateCheck:
                            return (<CircularProgress />);

                        case AppStep.prepareImport:
                            return (
                                <PrepareImportStep
                                    budgetEntryCategoryRules={budgetEntryCategoryRules}
                                    duplicateCheckResponse={duplicateCheckResponse}
                                    onImport={handleImport}
                                />
                            );

                        case AppStep.performImport:
                            return (<CircularProgress />);

                        case AppStep.done:
                            return (<div>Done!</div>);

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

// const useSelectFileStepStyles = makeStyles((theme: Theme) => createStyles({}));

const SelectFileStep = (props: SelectFileStepProps) => {
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
    }, [props]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Card>
            <CardHeader title={'Select File'} />
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

interface PrepareImportStepProps {
    budgetEntryCategoryRules: BudgetEntryCategoryRule[];
    duplicateCheckResponse: DuplicateCheckResponse;
    onImport: (entriesToCreate: BudgetEntry[], entriesToUpdate: BudgetEntry[]) => void
}

// const usePrepareImportStepStyles = makeStyles((theme: Theme) => createStyles({}));

enum PrepareImportTab {
    uniques = 'Uniques',
    duplicates = 'Duplicates',
    suspectDuplicates = 'Suspect Duplicates'
}

const PrepareImportStep = (props: PrepareImportStepProps) => {
    const [selectedTab, setSelectedTab] = useState(PrepareImportTab.uniques);
    const [uniquesToImport, setUniquesToImport] = useState(props.duplicateCheckResponse.uniques);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: PrepareImportTab) => {
        setSelectedTab(newValue);
    };

    const handleUniqueEntryCategoryChange = (uniqueEntryIdx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        uniquesToImport[uniqueEntryIdx].categoryRuleID = e.target.value;
        setUniquesToImport([...uniquesToImport]);
    }

    return (
        <Card>
            <CardHeader
                title={
                    <AppBar position='static'>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            variant={'scrollable'}
                            scrollButtons={'auto'}
                        >
                            <Tab label={PrepareImportTab.uniques} value={PrepareImportTab.uniques} />
                            <Tab label={PrepareImportTab.duplicates} value={PrepareImportTab.duplicates} />
                            <Tab label={PrepareImportTab.suspectDuplicates} value={PrepareImportTab.suspectDuplicates} />
                        </Tabs>
                    </AppBar>
                }
            />
            <CardContent>
                <Button
                    onClick={() => props.onImport(props.duplicateCheckResponse.uniques, [])}
                >
                    Perform Import
                </Button>
                {(() => {
                    switch (selectedTab) {
                        case PrepareImportTab.uniques:
                            return (
                                <FETable
                                    height={435}
                                    columns={[
                                        {
                                            label: 'Date',
                                            field: 'date',
                                            minWidth: 90,
                                            accessor: (data: any) => {
                                                const be = data as BudgetEntry;
                                                return moment(be.date).format('YY-MM-DD')
                                            }
                                        },
                                        {
                                            label: 'Description',
                                            field: 'description'
                                        },
                                        {
                                            label: 'Amount',
                                            field: 'amount'
                                        },
                                        {
                                            label: 'Category',
                                            field: 'category',
                                            accessor: (data: any, dataIdx: number) => {
                                                const be = data as BudgetEntry;
                                                return (
                                                    <TextField
                                                        select
                                                        value={be.categoryRuleID}
                                                        onChange={handleUniqueEntryCategoryChange(dataIdx)}
                                                    >
                                                        {props.budgetEntryCategoryRules.map((bcr) => (
                                                            <MenuItem key={bcr.id} value={bcr.id}>
                                                                {bcr.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                );
                                            }
                                        }
                                    ]}
                                    data={uniquesToImport}
                                    title={'These will be created'}
                                />
                            );

                        case PrepareImportTab.duplicates:
                            return (
                                <FETable
                                    height={435}
                                    columns={[
                                        {
                                            label: 'Date',
                                            field: 'date',
                                            minWidth: 90,                                            
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return moment(de.existing.date).format('YY-MM-DD');
                                            }
                                        },
                                        {
                                            label: 'Description',
                                            field: 'description',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return de.existing.description
                                            }
                                        },
                                        {
                                            label: 'Amount',
                                            field: 'amount',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return de.existing.amount
                                            }
                                        },
                                        {
                                            label: 'Category',
                                            field: 'category',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <TextField
                                                        select
                                                        value={de.existing.categoryRuleID}
                                                    >
                                                        <MenuItem value={''}>Other</MenuItem>
                                                        {props.budgetEntryCategoryRules.map((bcr) => (
                                                            <MenuItem key={bcr.id} value={bcr.id}>
                                                                {bcr.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                );                                                
                                            }
                                        }
                                    ]}
                                    data={props.duplicateCheckResponse.exactDuplicates}
                                    title={'These will be ignored'}
                                />
                            );

                        case PrepareImportTab.suspectDuplicates:
                            return (
                                <FETable
                                    height={435}
                                    columns={[
                                        {
                                            label: 'Date',
                                            field: 'date'
                                        },
                                        {
                                            label: 'Description',
                                            field: 'description'
                                        },
                                        {
                                            label: 'Amount',
                                            field: 'amount'
                                        },
                                        {
                                            label: 'Category',
                                            field: 'category',
                                            accessor: (data: any) => {
                                                const be = data as BudgetEntry;
                                                return (
                                                    <TextField
                                                        select
                                                        value={be.categoryRuleID}
                                                    >
                                                        {props.budgetEntryCategoryRules.map((bcr) => (
                                                            <MenuItem key={bcr.id} value={bcr.id}>
                                                                {bcr.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                );
                                            }
                                        }
                                    ]}
                                    //data={props.duplicateCheckResponse.suspectedDuplicates}
                                    data={[]}
                                    title={'Those that are selected will be updated'}
                                />
                            );

                        default:
                            return null;
                    }
                })()}
            </CardContent>
        </Card>
    )
};