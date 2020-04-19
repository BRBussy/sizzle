import React from 'react';
import {History} from 'history';
import {createStyles, makeStyles, Button} from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
}));


export interface HomeProps {
    history: History;
}

export default function Home(anyProps: any) {
    const props = anyProps as HomeProps;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Button
                onClick={() => props.history.push('/app/budget/summary')}
                variant={'contained'}
                children={'Budget Summary'}
            />
        </div>
    );
}