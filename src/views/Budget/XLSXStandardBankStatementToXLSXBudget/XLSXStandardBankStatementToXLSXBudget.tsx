import {BudgetAdmin} from 'bizzle/budget';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

const XLSXStandardBankStatementToXLSXBudget = () => {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader = new FileReader();

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');
            reader.onloadend = async () => {
                const fileData: string = reader.result as string;
                try {
                    await BudgetAdmin.XLSXStandardBankStatementToXLSXBudget({
                        xlsxStatement: fileData.slice(fileData.indexOf(',') + 1)
                    });
                } catch (e) {
                    console.error('error processing file', e);
                }
            };
            reader.readAsDataURL(file);
        });
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div>
            hello!
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
        </div>
    );
};

export default XLSXStandardBankStatementToXLSXBudget;
