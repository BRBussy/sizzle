import {
    createStyles, makeStyles, Theme,
    ExpansionPanel,
    ExpansionPanelSummary, ExpansionPanelDetails,
    Typography,
} from '@material-ui/core';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import React, {useEffect, useState} from 'react';
import {GetMyConfigResponse} from 'bizzle/budget/config/Admin';
import {BudgetConfig, BudgetConfigAdmin} from 'bizzle/budget/config';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%'
    }
}));

export default function Configuration() {
    const [getMyBudgetConfigResponse, setGetMyBudgetConfigResponse] = useState<GetMyConfigResponse>({
        budgetConfig: new BudgetConfig()
    });
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                setGetMyBudgetConfigResponse(await BudgetConfigAdmin.GetMyConfig({}))
            } catch (e) {
                console.error(`error getting my config: ${e.message ? e.message : e.toString()}`);
            }
            setLoading(false);
        })()
    }, []);

    return (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={'panel1bh-content'}
                    id={'panel1bh-header'}
                >
                    <Typography>Set Default Rules</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam.
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
};