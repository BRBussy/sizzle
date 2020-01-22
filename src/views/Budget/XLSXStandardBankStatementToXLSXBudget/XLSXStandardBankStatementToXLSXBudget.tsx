import {Card, CardContent, CardHeader, createStyles, makeStyles, Theme} from '@material-ui/core';
import {Budget, BudgetAdmin} from 'bizzle/budget';
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridRowGap: theme.spacing(1)
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
                const fileData: string = reader.result as string;
                try {
                    setBudgets((await BudgetAdmin.XLSXStandardBankStatementToBudgets({
                        xlsxStatement: fileData.slice(fileData.indexOf(',') + 1)
                    })).budgets);
                } catch (e) {
                    console.error('error processing file', e);
                }
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
                <CardContent>
                    Content
                </CardContent>
            </Card>
        </div>
    );
};

export default XLSXStandardBankStatementToXLSXBudget;
