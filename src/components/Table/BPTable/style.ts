import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { HexToRGBA } from 'utilities/color';

const tableTitleRowHeight: number = 60;
const tableFilterPanelHeight: number = 80;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%'
    },
    tableTitleLayout: {
        height: tableTitleRowHeight,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        padding: theme.spacing(1),
        alignItems: 'center'
    },
    tableTitle: {},
    tableTitleControlLayout: {
        display: 'flex',
        flexDirection: 'row'
    },
    filterLayout: {
        height: tableFilterPanelHeight,
        borderTop: `1px solid ${HexToRGBA(theme.palette.text.primary, '0.2')}`,
        padding: theme.spacing(1),
        display: 'grid',
        alignItems: 'center'
    },
    tableWrapper: {
        transition: 'height 0.3s ease-out',
        overflow: 'auto'
    },
    loadingWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

export default useStyles;
export {
    tableFilterPanelHeight,
    tableTitleRowHeight
};
