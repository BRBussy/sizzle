import {
    AppBar, Button, Card, CardContent, CardHeader,
    CircularProgress, Tab, Tabs, Stepper,
    Step, StepLabel, TextField, MenuItem, makeStyles,
    createStyles, Theme, Checkbox, FormControl, FormControlLabel,
    Typography, Grid, InputAdornment, IconButton
} from '@material-ui/core';
import {BudgetEntry, BudgetEntryAdmin} from 'bizzle/budget/entry';
import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore} from 'bizzle/budget/entry/categoryRule';
import React, {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import {FETable} from 'components/Table';
import {DuplicateCheckResponse, DuplicateEntries} from 'bizzle/budget/entry/Admin';
import moment from 'moment';
import {Cancel as ClearFilterIcon} from '@material-ui/icons';

enum AppStep {
    preparation,
    selectFile,
    parseFile,
    performDuplicateCheck,
    prepareImport,
    performImport,
    done
}

const Import = () => {
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
            await Promise.all([
                (async () => {
                    if (entriesToUpdate.length) {
                        await BudgetEntryAdmin.UpdateMany({
                            budgetEntries: entriesToUpdate
                        })
                    }
                })(),
                (async () => {
                    if (entriesToCreate.length) {
                        await BudgetEntryAdmin.CreateMany({
                            budgetEntries: entriesToCreate
                        })
                    }
                })()
            ])
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
                title={
                    <Grid container>
                        <Grid item>
                            <Stepper activeStep={activeAppStep} alternativeLabel>
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
                            </Stepper>
                        </Grid>
                    </Grid>
                }
            />
            <CardContent>
                {(() => {
                    switch (activeAppStep) {
                        case AppStep.preparation:
                            return (<CircularProgress/>);

                        case AppStep.selectFile:
                            return (
                                <SelectFileStep
                                    onStartStatementParse={() => setActiveAppStep(AppStep.parseFile)}
                                    onFinishStatementParse={handleFinishBudgetEntryParse}
                                />
                            );

                        case AppStep.parseFile:
                        case AppStep.performDuplicateCheck:
                            return (<CircularProgress/>);

                        case AppStep.prepareImport:
                            return (
                                <PrepareImportStep
                                    budgetEntryCategoryRules={budgetEntryCategoryRules}
                                    duplicateCheckResponse={duplicateCheckResponse}
                                    onImport={handleImport}
                                />
                            );

                        case AppStep.performImport:
                            return (<CircularProgress/>);

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

export default Import;

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

interface PrepareImportStepProps {
    budgetEntryCategoryRules: BudgetEntryCategoryRule[];
    duplicateCheckResponse: DuplicateCheckResponse;
    onImport: (entriesToCreate: BudgetEntry[], entriesToUpdate: BudgetEntry[]) => void
}

const usePrepareImportStepStyles = makeStyles((theme: Theme) => createStyles({
    duplicateRowCell: {
        display: 'grid',
        gridTemplateRows: 'auto auto',
        gridRowGap: theme.spacing(1),
        gridTemplateColumns: 'auto'
    },
    duplicateRowExistingCell: {
        borderBottom: `2px solid ${theme.palette.divider}`,
        paddingBottom: 6
    },
    duplicateRowActionCell: {
        display: 'grid',
        gridTemplateRows: 'auto auto',
        gridRowGap: theme.spacing(1),
        gridTemplateColumns: 'auto'
    },
    duplicateRowActionCellButtonLayout: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    categoryFilter: {
        minWidth: 200
    },
    clearFilterIcon: {
        marginRight: 20
    }
}));

enum PrepareImportTab {
    uniques = 'Uniques',
    duplicates = 'Duplicates',
    suspectDuplicates = 'Suspect Duplicates'
}

const PrepareImportStep = (props: PrepareImportStepProps) => {
    const [selectedTab, setSelectedTab] = useState(PrepareImportTab.uniques);
    const [uniquesToImport, setUniquesToImport] = useState(props.duplicateCheckResponse.uniques);
    const [exactDuplicateEntries, setExactDuplicateEntries] = useState(props.duplicateCheckResponse.exactDuplicates);
    const [suspectedDuplicateEntries, setSuspectedDuplicateEntries] = useState(props.duplicateCheckResponse.suspectedDuplicates);
    const [exactDuplicatesCreateNewActions, setExactDuplicatesCreateNewActions] = useState<{ [key: string]: boolean }>({})
    const [suspectedDuplicatesActions, setSuspectedDuplicatesActions] = useState<{
        [key: string]: {
            createNew: boolean,
            updateExisting: boolean
        }
    }>({})
    const classes = usePrepareImportStepStyles();
    const [selectedBudgetCategoryRuleFilter, setSelectedBudgetCategoryRuleFilter] = useState('')

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: PrepareImportTab) => {
        setSelectedTab(newValue);
    };

    const handleUniqueEntryCategoryChange = (uniqueEntryIdx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        uniquesToImport[uniqueEntryIdx].categoryRuleID = e.target.value;
        setUniquesToImport([...uniquesToImport]);
    };

    const handleExactDuplicateEntryCategoryChange = (exactDuplicateEntryIdx: number, existing: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (existing) {
            exactDuplicateEntries[exactDuplicateEntryIdx].existing.categoryRuleID = e.target.value;
        } else {
            exactDuplicateEntries[exactDuplicateEntryIdx].new.categoryRuleID = e.target.value;
        }
        setExactDuplicateEntries([...exactDuplicateEntries]);
    };

    const handleSuspectedDuplicateEntryCategoryChange = (suspectedDuplicateEntryIdx: number, existing: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (existing) {
            suspectedDuplicateEntries[suspectedDuplicateEntryIdx].existing.categoryRuleID = e.target.value;
        } else {
            suspectedDuplicateEntries[suspectedDuplicateEntryIdx].new.categoryRuleID = e.target.value;
        }
        setSuspectedDuplicateEntries([...suspectedDuplicateEntries]);
    };

    const handleExactDuplicateCreateNewCheck = (duplicateEntries: DuplicateEntries) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setExactDuplicatesCreateNewActions({
            ...exactDuplicatesCreateNewActions,
            [duplicateEntries.existing.id]: e.target.checked
        })
    };

    const handleSuspectedDuplicateCreateNewCheck = (duplicateEntries: DuplicateEntries) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // indicate that a new entry should be created
            // clear updating existing flag
            setSuspectedDuplicatesActions({
                ...suspectedDuplicatesActions,
                [duplicateEntries.existing.id]: {
                    createNew: true,
                    updateExisting: false
                }
            });
        } else {
            // indicate that new entry should not be created
            // clear updating existing flag
            setSuspectedDuplicatesActions({
                ...suspectedDuplicatesActions,
                [duplicateEntries.existing.id]: {
                    createNew: false,
                    updateExisting: false
                }
            });
        }
    };

    const handleSuspectedDuplicateUpdateExistingCheck = (duplicateEntries: DuplicateEntries) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // indicate that existing entry should be updated
            // clear create new flag
            setSuspectedDuplicatesActions({
                ...suspectedDuplicatesActions,
                [duplicateEntries.existing.id]: {
                    createNew: false,
                    updateExisting: true
                }
            });
        } else {
            // indicate that existing existing entry should not be updated
            // clear create new flag
            setSuspectedDuplicatesActions({
                ...suspectedDuplicatesActions,
                [duplicateEntries.existing.id]: {
                    createNew: false,
                    updateExisting: false
                }
            });
        }
    };

    const handleImportSelect = () => {
        // to gather entries that should be created
        const entriesToCreate = props.duplicateCheckResponse.uniques;
        // to gather entries that should be updated
        const entriesToUpdate: BudgetEntry[] = [];

        // gather those flagged for creation from exact duplicates
        for (const existingEntryID in exactDuplicatesCreateNewActions) {
            if (exactDuplicatesCreateNewActions[existingEntryID]) {
                // if marked for create new
                const duplicateEntries = props.duplicateCheckResponse.exactDuplicates.find((de) => (de.existing.id === existingEntryID));
                if (!duplicateEntries) {
                    console.error('duplicate entries for flagged existing entry not found');
                    continue;
                }
                entriesToCreate.push(duplicateEntries.new);
            }
        }

        // gather those flagged for either creation or updating from suspected duplicates
        for (const existingEntryID in suspectedDuplicatesActions) {
            if (!(suspectedDuplicatesActions[existingEntryID].createNew || suspectedDuplicatesActions[existingEntryID].updateExisting)) {
                // if flagged for neither, do nothing
                continue;
            }
            // otherwise find the duplicate entries
            const duplicateEntries = props.duplicateCheckResponse.suspectedDuplicates.find((de) => (de.existing.id === existingEntryID));
            if (!duplicateEntries) {
                console.error('duplicate entries for flagged existing entry not found');
                continue;
            }
            if (suspectedDuplicatesActions[existingEntryID].createNew) {
                entriesToCreate.push(duplicateEntries.new);
            } else {
                entriesToUpdate.push(new BudgetEntry({
                    ...duplicateEntries.existing,
                    date: duplicateEntries.new.date,
                    amount: duplicateEntries.new.amount,
                    description: duplicateEntries.new.description,
                    categoryRuleID: duplicateEntries.new.categoryRuleID
                }))
            }
        }
        props.onImport(entriesToCreate, entriesToUpdate);
    };

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
                            <Tab label={PrepareImportTab.uniques} value={PrepareImportTab.uniques}/>
                            <Tab label={PrepareImportTab.duplicates} value={PrepareImportTab.duplicates}/>
                            <Tab label={PrepareImportTab.suspectDuplicates} value={PrepareImportTab.suspectDuplicates}/>
                        </Tabs>
                    </AppBar>
                }
            />
            <CardContent>
                <Button onClick={handleImportSelect}>
                    Perform Import
                </Button>
                {(() => {
                    switch (selectedTab) {
                        case PrepareImportTab.uniques:
                            return (
                                <FETable
                                    height={700}
                                    filters={[
                                        <TextField
                                            label={'Category'}
                                            select
                                            className={classes.categoryFilter}
                                            onChange={(e) => setSelectedBudgetCategoryRuleFilter(e.target.value)}
                                            value={selectedBudgetCategoryRuleFilter}
                                            InputProps={{
                                                endAdornment: selectedBudgetCategoryRuleFilter && (
                                                    <InputAdornment
                                                        position={'end'}
                                                        className={classes.clearFilterIcon}
                                                    >
                                                        <IconButton
                                                            size={'small'}
                                                            onClick={() => setSelectedBudgetCategoryRuleFilter('')}
                                                        >
                                                            <ClearFilterIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem value={''} children={'-'}/>
                                            {props.budgetEntryCategoryRules.map((bcr) => (
                                                <MenuItem
                                                    key={bcr.id}
                                                    value={bcr.id}
                                                    children={bcr.name}
                                                />
                                            ))}
                                        </TextField>
                                    ]}
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
                                            minWidth: 180,
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
                                    height={700}
                                    columns={[
                                        {
                                            label: 'Action',
                                            field: '-',
                                            accessor: (data: any, rowIdx: number) => {
                                                const duplicateEntries = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowActionCell}>
                                                        <Typography variant={'caption'}>
                                                            Existing
                                                        </Typography>
                                                        <FormControl>
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    onChange={handleExactDuplicateCreateNewCheck(duplicateEntries)}
                                                                    checked={!!exactDuplicatesCreateNewActions[duplicateEntries.existing.id]}
                                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                                />}
                                                                label={<Typography variant={'caption'}>
                                                                    Create New
                                                                </Typography>}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Date',
                                            field: 'date',
                                            minWidth: 90,
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {moment(de.existing.date).format('YY-MM-DD')}
                                                        </div>
                                                        <div>
                                                            {moment(de.new.date).format('YY-MM-DD')}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Description',
                                            field: 'description',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {de.existing.description}
                                                        </div>
                                                        <div>
                                                            {de.new.description}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Amount',
                                            field: 'amount',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {de.existing.amount}
                                                        </div>
                                                        <div>
                                                            {de.new.amount}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Category',
                                            field: 'category',
                                            minWidth: 180,
                                            accessor: (data: any, dataIdx: number) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <TextField
                                                            select
                                                            value={de.existing.categoryRuleID}
                                                            onChange={handleExactDuplicateEntryCategoryChange(dataIdx, true)}
                                                        >
                                                            <MenuItem value={''}>Other</MenuItem>
                                                            {props.budgetEntryCategoryRules.map((bcr) => (
                                                                <MenuItem key={bcr.id} value={bcr.id}>
                                                                    {bcr.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        <TextField
                                                            select
                                                            value={de.new.categoryRuleID}
                                                            onChange={handleExactDuplicateEntryCategoryChange(dataIdx, false)}
                                                        >
                                                            <MenuItem value={''}>Other</MenuItem>
                                                            {props.budgetEntryCategoryRules.map((bcr) => (
                                                                <MenuItem key={bcr.id} value={bcr.id}>
                                                                    {bcr.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>
                                                )
                                            }
                                        }
                                    ]}
                                    data={props.duplicateCheckResponse.exactDuplicates}
                                    title={'Select Entries To Create Anew'}
                                />
                            );

                        case PrepareImportTab.suspectDuplicates:
                            return (
                                <FETable
                                    height={700}
                                    columns={[
                                        {
                                            label: 'Action',
                                            field: '-',
                                            accessor: (data: any, rowIdx: number) => {
                                                const duplicateEntries = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowActionCell}>
                                                        <FormControl>
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={
                                                                        suspectedDuplicatesActions[duplicateEntries.existing.id]
                                                                            ? suspectedDuplicatesActions[duplicateEntries.existing.id].updateExisting
                                                                            : false
                                                                    }
                                                                    onChange={handleSuspectedDuplicateUpdateExistingCheck(duplicateEntries)}
                                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                                />}
                                                                label={<Typography variant={'caption'}>
                                                                    Update Existing
                                                                </Typography>}
                                                            />
                                                        </FormControl>
                                                        <FormControl>
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={
                                                                        suspectedDuplicatesActions[duplicateEntries.existing.id]
                                                                            ? suspectedDuplicatesActions[duplicateEntries.existing.id].createNew
                                                                            : false
                                                                    }
                                                                    onChange={handleSuspectedDuplicateCreateNewCheck(duplicateEntries)}
                                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                                />}
                                                                label={<Typography variant={'caption'}>
                                                                    Create New
                                                                </Typography>}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Date',
                                            field: 'date',
                                            minWidth: 90,
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {moment(de.existing.date).format('YY-MM-DD')}
                                                        </div>
                                                        <div>
                                                            {moment(de.new.date).format('YY-MM-DD')}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Description',
                                            field: 'description',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {de.existing.description}
                                                        </div>
                                                        <div>
                                                            {de.new.description}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Amount',
                                            field: 'amount',
                                            accessor: (data: any) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <div className={classes.duplicateRowExistingCell}>
                                                            {de.existing.amount}
                                                        </div>
                                                        <div>
                                                            {de.new.amount}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            label: 'Category',
                                            field: 'category',
                                            minWidth: 180,
                                            accessor: (data: any, dataIdx: number) => {
                                                const de = data as DuplicateEntries;
                                                return (
                                                    <div className={classes.duplicateRowCell}>
                                                        <TextField
                                                            select
                                                            value={de.existing.categoryRuleID}
                                                            onChange={handleSuspectedDuplicateEntryCategoryChange(dataIdx, true)}
                                                        >
                                                            <MenuItem value={''}>Other</MenuItem>
                                                            {props.budgetEntryCategoryRules.map((bcr) => (
                                                                <MenuItem key={bcr.id} value={bcr.id}>
                                                                    {bcr.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        <TextField
                                                            select
                                                            value={de.new.categoryRuleID}
                                                            onChange={handleSuspectedDuplicateEntryCategoryChange(dataIdx, false)}
                                                        >
                                                            <MenuItem value={''}>Other</MenuItem>
                                                            {props.budgetEntryCategoryRules.map((bcr) => (
                                                                <MenuItem key={bcr.id} value={bcr.id}>
                                                                    {bcr.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>
                                                )
                                            }
                                        }
                                    ]}
                                    data={props.duplicateCheckResponse.suspectedDuplicates}
                                    title={'Update Existing or Create New'}
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