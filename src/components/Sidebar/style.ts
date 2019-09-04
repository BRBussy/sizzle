import {Theme, createStyles} from "@material-ui/core";

const drawerWidth = 260
const drawerMiniWidth = 80

const styles = (theme: Theme) => createStyles({
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
    blackBackground: {
        color: "#FFFFFF",
        "&:after": {
            background: "#000",
            opacity: 0.6,
        },
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
        boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            position: "fixed",
            height: "100%"
        },
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
            boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
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
            transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
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
    drawerPaperMini: {
        width: drawerMiniWidth + "px!important"
    },
    background: {
        position: "absolute",
        zIndex: 0,
        height: "100%",
        width: "100%",
        display: "block",
        top: "0",
        left: "0",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        transition: "all 300ms linear"
    },
});

export default styles