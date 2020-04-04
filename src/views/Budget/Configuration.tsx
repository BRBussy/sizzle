import {
    createStyles, makeStyles, Theme,
    ExpansionPanel,
    ExpansionPanelSummary, ExpansionPanelDetails,
    Typography, CircularProgress, TextField, MenuItem
} from '@material-ui/core';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import React, {useEffect, useState} from 'react';
import {GetMyConfigResponse} from 'bizzle/budget/config/Admin';
import {BudgetConfig, BudgetConfigAdmin} from 'bizzle/budget/config';
import {useBudgetEntryCategoryRuleStoreFindMany} from 'bizzle/budget/entry/categoryRule/Store';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%'
    },
    expansionPanelSummaryLayout: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        alignItems: 'center',
        gridColumnGap: theme.spacing(1)
    }
}));

export default function Configuration() {
    const [getMyBudgetConfigResponse, setGetMyBudgetConfigResponse] = useState<GetMyConfigResponse>({
        budgetConfig: new BudgetConfig()
    });
    const [getMyBudgetConfigToggle, setGetMyBudgetConfigToggle] = useState(false);
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
    }, [getMyBudgetConfigToggle]);
    const {
        findManyResponse: findManyBudgetCategoryRulesResponse,
        loading: loadingBudgetCategoryRules
    } = useBudgetEntryCategoryRuleStoreFindMany();

    const handleUpdateDefaultOtherRule = async (newOtherRuleID: string) => {
        setLoading(true);
        try {
            await BudgetConfigAdmin.SetMyConfig({
                budgetConfig: new BudgetConfig({
                    ...getMyBudgetConfigResponse.budgetConfig,
                    otherCategoryRuleID: newOtherRuleID
                })
            });
            setGetMyBudgetConfigToggle(!getMyBudgetConfigToggle);
        } catch (e) {
            console.error(`error setting my budget config: ${e.message ? e.message : e.toString()}`);
        }
        setLoading(false);
    };

    const appLoading = loading || loadingBudgetCategoryRules;

    return (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    classes={{content: classes.expansionPanelSummaryLayout}}
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={'panel1bh-content'}
                    id={'panel1bh-header'}
                >
                    <Typography>Set Default Other Rule</Typography>
                    {appLoading && <CircularProgress size={20}/>}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TextField
                        select
                        fullWidth
                        value={getMyBudgetConfigResponse.budgetConfig.otherCategoryRuleID}
                        disabled={appLoading}
                        variant={'outlined'}
                        onChange={(e) => handleUpdateDefaultOtherRule(e.target.value)}
                    >
                        {findManyBudgetCategoryRulesResponse.records.map((bcr) => (
                            <MenuItem key={bcr.id} value={bcr.id}>
                                {bcr.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
};