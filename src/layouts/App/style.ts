import {Theme, createStyles, makeStyles} from "@material-ui/core";
import {
    drawerMiniWidth,
    drawerWidth,
    transition,
} from "components/style";

const useStyles = makeStyles((theme: Theme) => createStyles({
    wrapper: {
        position: "relative",
        top: "0",
        height: "100vh",
        "&:after": {
            display: "table",
            clear: "both",
            content: '" "'
        }
    },
    mainPanel: {
        transitionProperty: "top, bottom, width",
        transitionDuration: ".2s, .2s, .35s",
        transitionTimingFunction: "linear, linear, ease",
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`
        },
        overflow: "hidden",
        position: "relative",
        float: "right",
        ...transition,
        maxHeight: "100%",
        width: "100%",
        overflowScrolling: "touch"
    },
    mainPanelSidebarMini: {
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerMiniWidth}px)`
        }
    },
    mainPanelWithPerfectScrollbar: {
        overflow: "hidden !important"
    }
}));

export default useStyles