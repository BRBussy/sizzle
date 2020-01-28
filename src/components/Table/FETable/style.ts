import {createStyles, makeStyles, Theme} from '@material-ui/core';
import {HexToRGBA} from 'utilities/color';

const tableTitleRowHeight: number = 60;
const tableFilterPanelHeight: number = 80;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    }
}));

export default useStyles;
export {
    tableFilterPanelHeight,
    tableTitleRowHeight
};
