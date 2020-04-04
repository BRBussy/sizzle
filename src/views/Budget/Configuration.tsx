import {createStyles, makeStyles, Theme} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridRowGap: theme.spacing(1)
    },
    netCardRootOverride: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: `${theme.spacing(0.5)}px !important`
    },
    tableCardRootOverride: {
        padding: 0,
        paddingBottom: '0 !important'
    },
    textField: {
        width: 140
    }
}));

export default function Configuration() {
    return (
        <div>
            config
        </div>
    )
};