import React from 'react';
import {Dialog, DialogTitle, DialogContent, makeStyles, Theme} from '@material-ui/core';


interface EntryDialogProps {
    closeDialog: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({}));

export default function EntryDialog(props: EntryDialogProps) {
    return (
        <Dialog
            open={true}
            onClose={props.closeDialog}
        >
            <DialogTitle>Budget Entry</DialogTitle>
            <DialogContent>
                entry!
            </DialogContent>
        </Dialog>
    );
}