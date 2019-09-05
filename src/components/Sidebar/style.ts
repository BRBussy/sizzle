import {Theme, createStyles, makeStyles} from "@material-ui/core";
import {
    drawerMiniWidth,
    drawerWidth,
    transition,
    boxShadow,
} from "components/style";

const useStyles = makeStyles((theme: Theme) => createStyles({
    userMenuLayout: {
        position: "relative",
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            height: "1px",
            right: "15px",
            width: "calc(100% - 30px)",
            backgroundColor: "hsla(0,0%,100%,.3)"
        }
    },
    caret: {
        marginTop: "13px",
        position: "absolute",
        right: "18px",
        transition: "all 150ms ease-in",
        display: "inline-block",
        width: "0",
        height: "0",
        marginLeft: "2px",
        verticalAlign: "middle",
        borderTop: "4px solid",
        borderRight: "4px solid transparent",
        borderLeft: "4px solid transparent"
    },
    caretActive: {
        transform: "rotate(180deg)"
    },
    sidebarLinksLayout: {
        position: "relative",
        height: "calc(100vh - 75px)",
        overflow: "auto",
        width: "260px",
        zIndex: 4,
        overflowScrolling: "touch",
        transitionProperty: "top, bottom, width",
        transitionDuration: ".2s, .2s, .35s",
        transitionTimingFunction: "linear, linear, ease",
        color: "inherit",
        paddingBottom: "30px"
    },
    listItem: {
        cursor: 'pointer',
        paddingLeft: '30px',
        width: drawerWidth,
    },
    listItemSidebarMinimized: {
        width: drawerMiniWidth,
    },
    listItemText: {

    },
    listItemTextSidebarMinimized: {
        opacity: 0,
        transform: "translate3d(-25px, 0, 0)"
    },

    drawerPaper: {
        border: "none",
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        zIndex: 1032,
        transitionProperty: "top, bottom, width",
        transitionDuration: ".2s, .2s, .35s",
        transitionTimingFunction: "linear, linear, ease",
        // overflow: 'auto',
        ...boxShadow,
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            position: "fixed",
            height: "100%"
        },
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
            ...boxShadow,
            position: "fixed",
            display: "block",
            top: "0",
            height: "100vh",
            right: "0",
            left: "auto",
            zIndex: 1032,
            visibility: "visible",
            overflowY: "visible",
            borderTop: "none",
            textAlign: "left",
            paddingRight: "0px",
            paddingLeft: "0",
            transform: `translate3d(${drawerWidth}px, 0, 0)`,
            ...transition
        },
        "&:before,&:after": {
            position: "absolute",
            zIndex: 3,
            width: "100%",
            height: "100%",
            content: '""',
            display: "block",
            top: "0"
        }
    },
    blackBackground: {
        color: "#FFFFFF",
        "&:after": {
            background: "#000",
            opacity: 0.6
        }
    },
    drawerPaperMini: {
        width: drawerMiniWidth + "px!important"
    },
    brandLayout: {
        cursor: "pointer",
        padding: "15px 0px",
        margin: "0",
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        position: "relative",
        zIndex: 4,
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            height: "1px",
            right: "15px",
            width: "calc(100% - 30px)",
            backgroundColor: "hsla(0,0%,100%,.3)"
        }
    },
    logoNormal: {
        transition: "all 300ms linear",
        opacity: 1,
        transform: "translate3d(0px, 0, 0)",
        padding: "5px 0px",
        fontSize: "18px",
        whiteSpace: "nowrap",
        fontWeight: 400,
        overflow: "hidden",
        "&,&:hover,&:focus": {
            color: "inherit"
        }
    },
    logoNormalSidebarMini: {
        opacity: 0,
        transform: "translate3d(-25px, 0, 0)"
    },
    logoImg: {
        width: "35px",
        border: "0",
        transition: "all 300ms linear",
        opacity: 1,
        float: "left",
        marginLeft: "22px",
        marginRight: "18px",
    },
    background: {
        position: "absolute",
        zIndex: 1,
        height: "100%",
        width: "100%",
        display: "block",
        top: "0",
        left: "0",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        transition: "all 300ms linear"
    },
    itemIcon: {
        color: "inherit",
        width: "30px",
        height: "24px",
        float: "left",
        position: "inherit",
        top: "3px",
        marginRight: "15px",
        textAlign: "center",
        verticalAlign: "middle",
        opacity: 0.8
    },
}));

export default useStyles